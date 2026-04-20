const ZAPI_BASE_URL = String(process.env.ZAPI_BASE_URL || 'https://api.z-api.io').replace(/\/+$/, '');
const ZAPI_INSTANCE_ID = String(process.env.ZAPI_INSTANCE_ID || '').trim();
const ZAPI_INSTANCE_TOKEN = String(process.env.ZAPI_INSTANCE_TOKEN || '').trim();
const ZAPI_CLIENT_TOKEN = String(process.env.ZAPI_CLIENT_TOKEN || '').trim();
const MIN_PHONE_LENGTH = 12;

const ZAPI_MESSAGE_TEMPLATES = Object.freeze({
  inscricao_geral: [
    'Olá! 🙏 A paz do Senhor!',
    'Recebemos sua inscrição com gratidão e alegria.',
    'Oramos para que Deus abençoe sua vida, fortaleça sua fé e conduza seus passos segundo a Sua vontade.',
    '',
    '“Entrega o teu caminho ao Senhor; confia nele, e Ele o fará.” — Salmo 37:5',
    '',
    'Conte conosco em oração. Deus abençoe você e sua família!'
  ].join('\n'),
  cadastro_intercessor: [
    'Olá! 🙏 A paz do Senhor!',
    'Recebemos seu cadastro como intercessor com alegria e gratidão.',
    'Agradecemos por seu coração disponível para servir em oração e clamar a Deus pela vida das pessoas.',
    '',
    '“Orai uns pelos outros.” — Tiago 5:16',
    '',
    'Que o Senhor fortaleça sua fé, renove suas forças e use sua vida poderosamente para a glória dEle. Deus abençoe você e sua família!'
  ].join('\n'),
  pedido_oracao: [
    'Olá! 🙏 A paz do Senhor!',
    'Recebemos seu pedido de oração com carinho e atenção.',
    'Estamos em concordância com você, crendo que Deus vai agir no tempo certo e segundo a perfeita vontade dEle.',
    '',
    '“Clama a mim, e responder-te-ei.” — Jeremias 33:3',
    '',
    'Conte conosco em oração. Que o Senhor te dê paz, direção, consolo e vitória em cada área da sua vida. Deus abençoe você e sua família!'
  ].join('\n')
});

function zapiConfigurada() {
  return Boolean(ZAPI_INSTANCE_ID && ZAPI_INSTANCE_TOKEN);
}

function normalizarTelefone(telefone) {
  const apenasDigitos = String(telefone || '').replace(/\D/g, '');
  if (!apenasDigitos) return '';

  const semPrefixoInternacional = apenasDigitos.startsWith('00')
    ? apenasDigitos.slice(2)
    : apenasDigitos;

  const numero = semPrefixoInternacional.startsWith('55')
    ? semPrefixoInternacional
    : `55${semPrefixoInternacional}`;

  if (numero.length < MIN_PHONE_LENGTH) return '';
  return numero;
}

async function enviarMensagemZapi({ telefone, mensagem }) {
  const url = `${ZAPI_BASE_URL}/instances/${encodeURIComponent(ZAPI_INSTANCE_ID)}/token/${encodeURIComponent(ZAPI_INSTANCE_TOKEN)}/send-text`;
  const headers = { 'Content-Type': 'application/json' };
  if (ZAPI_CLIENT_TOKEN) {
    headers['Client-Token'] = ZAPI_CLIENT_TOKEN;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      phone: telefone,
      message: mensagem
    })
  });

  if (!response.ok) {
    const detalhe = await response.text();
    throw new Error(`Falha ao enviar WhatsApp via Z-API: ${response.status} ${detalhe}`);
  }

  return response.json().catch((erroParse) => {
    console.warn('Resposta da Z-API sem JSON válido:', erroParse?.message || erroParse);
    return {};
  });
}

async function enviarNotificacaoWhatsApp({ telefone, tipoEvento, contexto }) {
  const mensagem = ZAPI_MESSAGE_TEMPLATES[tipoEvento];
  if (!mensagem) {
    return { ok: false, skipped: true, reason: 'template_ausente' };
  }

  const telefoneNormalizado = normalizarTelefone(telefone);
  if (!telefoneNormalizado) {
    return { ok: false, skipped: true, reason: 'telefone_invalido' };
  }

  if (!zapiConfigurada()) {
    console.warn(`[${contexto}] Z-API não configurada. Defina ZAPI_INSTANCE_ID e ZAPI_INSTANCE_TOKEN para habilitar envio de WhatsApp.`);
    return { ok: false, skipped: true, reason: 'zapi_nao_configurada' };
  }

  await enviarMensagemZapi({
    telefone: telefoneNormalizado,
    mensagem
  });

  return { ok: true };
}

module.exports = {
  ZAPI_MESSAGE_TEMPLATES,
  enviarNotificacaoWhatsApp
};
