'use strict';

// ─── Configuração via variáveis de ambiente ───────────────────────────────────
const ZAPI_BASE_URL     = String(process.env.ZAPI_BASE_URL     || 'https://api.z-api.io').replace(/\/+$/, '');
const ZAPI_INSTANCE_ID  = String(process.env.ZAPI_INSTANCE_ID  || '').trim();
const ZAPI_INSTANCE_TOKEN = String(process.env.ZAPI_INSTANCE_TOKEN || '').trim();
const ZAPI_CLIENT_TOKEN = String(process.env.ZAPI_CLIENT_TOKEN || '').trim();

const MIN_BR_PHONE_LENGTH = 12;   // 55 + DDD(2) + número(8 ou 9)
const ZAPI_TIMEOUT_MS     = 5000; // 5 s — evita travar a Netlify Function

// ─── Templates de mensagem ────────────────────────────────────────────────────
const ZAPI_MESSAGE_TEMPLATES = Object.freeze({
  // Chaves em português (usadas por enviarNotificacaoWhatsApp)
  inscricao_geral: [
    'Olá! 🙏 A paz do Senhor!',
    'Recebemos sua inscrição com gratidão e alegria.',
    'Oramos para que Deus abençoe sua vida, fortaleça sua fé e conduza seus passos segundo a Sua vontade.',
    '',
    '"Entrega o teu caminho ao Senhor; confia nele, e Ele o fará." — Salmo 37:5',
    '',
    'Conte conosco em oração. Deus abençoe você e sua família!'
  ].join('\n'),

  cadastro_intercessor: [
    'Olá! 🙏 A paz do Senhor!',
    'Recebemos seu cadastro como intercessor com alegria e gratidão.',
    'Agradecemos por seu coração disponível para servir em oração e clamar a Deus pela vida das pessoas.',
    '',
    '"Orai uns pelos outros." — Tiago 5:16',
    '',
    'Que o Senhor fortaleça sua fé, renove suas forças e use sua vida poderosamente para a glória dEle. Deus abençoe você e sua família!'
  ].join('\n'),

  pedido_oracao: [
    'Olá! 🙏 A paz do Senhor!',
    'Recebemos seu pedido de oração com carinho e atenção.',
    'Estamos em concordância com você, crendo que Deus vai agir no tempo certo e segundo a perfeita vontade dEle.',
    '',
    '"Clama a mim, e responder-te-ei." — Jeremias 33:3',
    '',
    'Conte conosco em oração. Que o Senhor te dê paz, direção, consolo e vitória em cada área da sua vida. Deus abençoe você e sua família!'
  ].join('\n')
});

// Mapeamento de chaves em inglês → português (compatibilidade com versão anterior)
const CHAVE_EN_PARA_PT = {
  general_registration:    'inscricao_geral',
  intercessor_registration: 'cadastro_intercessor',
  prayer_request:          'pedido_oracao'
};

// ─── Helpers internos ─────────────────────────────────────────────────────────
function zapiConfigurada() {
  return Boolean(ZAPI_INSTANCE_ID && ZAPI_INSTANCE_TOKEN);
}

function resolverTipoEvento(tipoEvento) {
  return CHAVE_EN_PARA_PT[tipoEvento] || tipoEvento;
}

function normalizarTelefone(telefone) {
  const apenasDigitos = String(telefone || '').replace(/\D/g, '');
  if (!apenasDigitos) return '';

  const semPrefixo00 = apenasDigitos.startsWith('00')
    ? apenasDigitos.slice(2)
    : apenasDigitos;

  if (semPrefixo00.startsWith('55')) {
    return semPrefixo00.length >= MIN_BR_PHONE_LENGTH ? semPrefixo00 : '';
  }

  let numeroNacional = semPrefixo00;
  if (numeroNacional.startsWith('0')) {
    numeroNacional = numeroNacional.slice(1);
    if (numeroNacional.length >= 12) {
      numeroNacional = numeroNacional.slice(2);
    }
  }

  if (numeroNacional.length !== 10 && numeroNacional.length !== 11) {
    return '';
  }

  return `55${numeroNacional}`;
}

function parsearRespostaTolerant(rawBody, status) {
  try {
    return JSON.parse(rawBody);
  } catch (e) {
    console.warn('[whatsapp-zapi] Resposta sem JSON válido:', { status });
    return {};
  }
}

async function enviarViaZAPI({ telefone, mensagem }) {
  const url = `${ZAPI_BASE_URL}/instances/${encodeURIComponent(ZAPI_INSTANCE_ID)}/token/${encodeURIComponent(ZAPI_INSTANCE_TOKEN)}/send-text`;

  const headers = { 'Content-Type': 'application/json' };
  if (ZAPI_CLIENT_TOKEN) headers['Client-Token'] = ZAPI_CLIENT_TOKEN;

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), ZAPI_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phone: telefone, message: mensagem }),
      signal: controller.signal
    });
  } catch (err) {
    throw new Error(err?.name === 'AbortError'
      ? `Z-API: timeout após ${ZAPI_TIMEOUT_MS}ms`
      : `Z-API: erro de rede — ${err?.message || String(err)}`
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const rawBody = await response.text();
  if (!response.ok) {
    throw new Error(`Z-API: HTTP ${response.status}`);
  }
  return rawBody ? parsearRespostaTolerant(rawBody, response.status) : {};
}

// ─── Núcleo do envio (nunca lança exceção) ────────────────────────────────────
async function _enviarSeguro({ telefone, tipoEvento, contexto }) {
  const chave    = resolverTipoEvento(tipoEvento);
  const mensagem = ZAPI_MESSAGE_TEMPLATES[chave];

  if (!mensagem) {
    console.warn(`[whatsapp-zapi][${contexto}] Template ausente para evento: ${tipoEvento}`);
    return { ok: false, skipped: true, reason: 'template_ausente' };
  }

  const tel = normalizarTelefone(telefone);
  if (!tel) {
    console.warn(`[whatsapp-zapi][${contexto}] Telefone inválido ou ausente.`);
    return { ok: false, skipped: true, reason: 'telefone_invalido' };
  }

  if (!zapiConfigurada()) {
    console.warn(`[whatsapp-zapi][${contexto}] ZAPI_INSTANCE_ID / ZAPI_INSTANCE_TOKEN não configurados no Netlify.`);
    return { ok: false, skipped: true, reason: 'zapi_nao_configurada' };
  }

  try {
    await enviarViaZAPI({ telefone: tel, mensagem });
    return { ok: true };
  } catch (err) {
    console.warn(`[whatsapp-zapi][${contexto}] Falha no envio:`, { tipoEvento: chave, detalhe: err?.message });
    return { ok: false, error: err?.message || String(err) };
  }
}

// ─── API pública — suporta ambas as assinaturas ───────────────────────────────

/**
 * Assinatura em português (usada nos handlers do PR Copilot):
 *   enviarNotificacaoWhatsApp({ telefone, tipoEvento, contexto })
 */
async function enviarNotificacaoWhatsApp({ telefone, tipoEvento, contexto = 'desconhecido' }) {
  return _enviarSeguro({ telefone, tipoEvento, contexto });
}

/**
 * Assinatura em inglês (usada nos handlers da versão anterior):
 *   sendWhatsAppByEvent({ phone, eventType, context })
 */
async function sendWhatsAppByEvent({ phone, eventType, context = 'desconhecido' }) {
  return _enviarSeguro({ telefone: phone, tipoEvento: eventType, contexto: context });
}

module.exports = {
  ZAPI_MESSAGE_TEMPLATES,
  enviarNotificacaoWhatsApp,
  sendWhatsAppByEvent
};
