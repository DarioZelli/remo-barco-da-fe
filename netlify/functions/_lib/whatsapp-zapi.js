'use strict';

const ZAPI_BASE_URL = String(process.env.ZAPI_BASE_URL || 'https://api.z-api.io').replace(/\/+$/, '');
const ZAPI_INSTANCE_ID = String(process.env.ZAPI_INSTANCE_ID || '').trim();
const ZAPI_INSTANCE_TOKEN = String(process.env.ZAPI_INSTANCE_TOKEN || '').trim();
const ZAPI_CLIENT_TOKEN = String(process.env.ZAPI_CLIENT_TOKEN || '').trim();

// 55 + DDD (2) + número local (8 ou 9 dígitos)
const MIN_BR_PHONE_LENGTH = 12;
// Timeout máximo para chamada à Z-API (evita travar a Netlify Function)
const ZAPI_TIMEOUT_MS = 5000;

const ZAPI_MESSAGE_TEMPLATES = Object.freeze({
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

function zapiConfigurada() {
  return Boolean(ZAPI_INSTANCE_ID && ZAPI_INSTANCE_TOKEN);
}

/**
 * Normaliza um número de telefone para o formato E.164 brasileiro (55DDXXXXXXXXX).
 * Corrige números com zero à esquerda (ex.: 047..., 011...) que antes geravam
 * formatos inválidos como 550479... ou 550119...
 */
function normalizarTelefone(telefone) {
  const apenasDigitos = String(telefone || '').replace(/\D/g, '');
  if (!apenasDigitos) return '';

  // Remove eventual prefixo 00 de discagem internacional
  const semPrefixo00 = apenasDigitos.startsWith('00')
    ? apenasDigitos.slice(2)
    : apenasDigitos;

  // Já tem DDI 55 — aceita diretamente
  if (semPrefixo00.startsWith('55')) {
    const numero = semPrefixo00;
    return numero.length >= MIN_BR_PHONE_LENGTH ? numero : '';
  }

  // Número nacional — pode ter 0 inicial (ex.: 047..., 011...)
  let numeroNacional = semPrefixo00;
  if (numeroNacional.startsWith('0')) {
    numeroNacional = numeroNacional.slice(1);
    // Se ainda tiver 12+ dígitos após remover o 0, descarta mais 2 (código de operadora antigo)
    if (numeroNacional.length >= 12) {
      numeroNacional = numeroNacional.slice(2);
    }
  }

  // Deve ter exatamente 10 (DDD + 8 dígitos) ou 11 (DDD + 9 dígitos)
  if (numeroNacional.length !== 10 && numeroNacional.length !== 11) {
    return '';
  }

  return `55${numeroNacional}`;
}

function analisarRespostaJsonTolerante(rawBody, status) {
  try {
    return JSON.parse(rawBody);
  } catch (erroParse) {
    // Body omitido do log para evitar vazamento de PII
    console.warn('Resposta da Z-API sem JSON válido:', {
      status,
      detalhe: erroParse?.message || String(erroParse)
    });
    return {};
  }
}

async function enviarMensagemZAPI({ telefone, mensagem }) {
  const url = `${ZAPI_BASE_URL}/instances/${encodeURIComponent(ZAPI_INSTANCE_ID)}/token/${encodeURIComponent(ZAPI_INSTANCE_TOKEN)}/send-text`;

  const headers = { 'Content-Type': 'application/json' };
  if (ZAPI_CLIENT_TOKEN) {
    headers['Client-Token'] = ZAPI_CLIENT_TOKEN;
  }

  // Timeout de 5 s — impede que a Netlify Function trave se a Z-API não responder
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ZAPI_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phone: telefone, message: mensagem }),
      signal: controller.signal
    });
  } catch (erroFetch) {
    const isTimeout = erroFetch?.name === 'AbortError';
    throw new Error(
      isTimeout
        ? `Z-API: timeout após ${ZAPI_TIMEOUT_MS}ms`
        : `Z-API: erro de rede — ${erroFetch?.message || String(erroFetch)}`
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const rawBody = await response.text();

  if (!response.ok) {
    // Body não incluído na mensagem para evitar vazamento de PII nos logs
    throw new Error(`Falha ao enviar WhatsApp via Z-API: HTTP ${response.status}`);
  }

  if (!rawBody) return {};
  return analisarRespostaJsonTolerante(rawBody, response.status);
}

/**
 * Envia notificação WhatsApp de forma segura.
 * Nunca lança exceção — retorna { ok: false, error: '...' } em caso de falha,
 * de modo que nenhum fluxo de formulário é interrompido por falha no envio.
 */
async function enviarNotificacaoWhatsApp({ telefone, tipoEvento, contexto }) {
  const mensagem = ZAPI_MESSAGE_TEMPLATES[tipoEvento];
  if (!mensagem) {
    return { ok: false, skipped: true, reason: 'template_ausente' };
  }

  const telefoneNormalizado = normalizarTelefone(telefone);
  if (!telefoneNormalizado) {
    console.warn(`[${contexto}] Telefone inválido ou ausente — WhatsApp não enviado.`);
    return { ok: false, skipped: true, reason: 'telefone_invalido' };
  }

  if (!zapiConfigurada()) {
    console.warn(`[${contexto}] Z-API não configurada. Defina ZAPI_INSTANCE_ID e ZAPI_INSTANCE_TOKEN nas variáveis de ambiente do Netlify.`);
    return { ok: false, skipped: true, reason: 'zapi_nao_configurada' };
  }

  try {
    await enviarMensagemZAPI({ telefone: telefoneNormalizado, mensagem });
    return { ok: true };
  } catch (erroEnvio) {
    // Telefone omitido do log para evitar vazamento de PII
    console.warn(`[${contexto}] Falha ao enviar notificação de WhatsApp.`, {
      tipoEvento,
      detalhe: erroEnvio?.message || String(erroEnvio)
    });
    return { ok: false, error: erroEnvio?.message || String(erroEnvio) };
  }
}

module.exports = {
  ZAPI_MESSAGE_TEMPLATES,
  enviarNotificacaoWhatsApp
};
