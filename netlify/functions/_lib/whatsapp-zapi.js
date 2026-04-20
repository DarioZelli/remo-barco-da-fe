const EVENT_MESSAGES = {
  general_registration: [
    'Olá! 🙏 A paz do Senhor!',
    'Recebemos sua inscrição com gratidão e alegria.',
    'Oramos para que Deus abençoe sua vida, fortaleça sua fé e conduza seus passos segundo a Sua vontade.',
    '',
    '“Entrega o teu caminho ao Senhor; confia nele, e Ele o fará.” — Salmo 37:5',
    '',
    'Conte conosco em oração. Deus abençoe você e sua família!'
  ].join('\n'),
  intercessor_registration: [
    'Olá! 🙏 A paz do Senhor!',
    'Recebemos seu cadastro como intercessor com alegria e gratidão.',
    'Agradecemos por seu coração disponível para servir em oração e clamar a Deus pela vida das pessoas.',
    '',
    '“Orai uns pelos outros.” — Tiago 5:16',
    '',
    'Que o Senhor fortaleça sua fé, renove suas forças e use sua vida poderosamente para a glória dEle. Deus abençoe você e sua família!'
  ].join('\n'),
  prayer_request: [
    'Olá! 🙏 A paz do Senhor!',
    'Recebemos seu pedido de oração com carinho e atenção.',
    'Estamos em concordância com você, crendo que Deus vai agir no tempo certo e segundo a perfeita vontade dEle.',
    '',
    '“Clama a mim, e responder-te-ei.” — Jeremias 33:3',
    '',
    'Conte conosco em oração. Que o Senhor te dê paz, direção, consolo e vitória em cada área da sua vida. Deus abençoe você e sua família!'
  ].join('\n')
};

function getMessageForEvent(eventType) {
  return EVENT_MESSAGES[eventType] || EVENT_MESSAGES.general_registration;
}

function normalizePhone(phone) {
  let digits = String(phone || '').replace(/\D/g, '');

  if (!digits) return '';

  // Remove prefixo 00 se vier em formato internacional “00DDI...”
  if (digits.startsWith('00')) digits = digits.slice(2);

  // Se já vier com DDI brasileiro
  if (digits.startsWith('55')) {
    return digits;
  }

  // Se for número BR sem DDI, precisa ter pelo menos DDD + 8/9 dígitos
  if (digits.length < 10) return '';

  const defaultDdi = String(process.env.ZAPI_DEFAULT_DDI || '55').replace(/\D/g, '');
  if (!defaultDdi) return digits;

  // Remove zeros à esquerda antes de prefixar DDI
  digits = digits.replace(/^0+/, '');

  return `${defaultDdi}${digits}`;
}

function getZApiConfig() {
  const baseUrl = String(process.env.ZAPI_BASE_URL || 'https://api.z-api.io').replace(/\/+$/'', '');
  const instanceId = String(process.env.ZAPI_INSTANCE_ID || '').trim();
  const instanceToken = String(process.env.ZAPI_INSTANCE_TOKEN || '').trim();
  const clientToken = String(process.env.ZAPI_CLIENT_TOKEN || '').trim();

  if (!instanceId || !instanceToken) return null;

  return {
    url: `${baseUrl}/instances/${encodeURIComponent(instanceId)}/token/${encodeURIComponent(instanceToken)}/send-text`,
    clientToken
  };
}

async function sendWhatsAppByEvent({ eventType, phone, context }) {
  const cfg = getZApiConfig();
  if (!cfg) {
    return { ok: false, skipped: true, reason: 'missing_zapi_config' };
  }

  if (typeof fetch !== 'function') {
    return { ok: false, skipped: true, reason: 'fetch_unavailable' };
  }

  const phoneNumber = normalizePhone(phone);
  if (!phoneNumber) {
    console.warn('[whatsapp-zapi] Telefone inválido para envio.', { context, phone });
    return { ok: false, skipped: true, reason: 'invalid_phone' };
  }

  const message = getMessageForEvent(eventType);
  const headers = { 'Content-Type': 'application/json' };

  if (cfg.clientToken) {
    headers['Client-Token'] = cfg.clientToken;
  }

  try {
    const response = await fetch(cfg.url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phone: phoneNumber, message })
    });

    const responseText = await response.text();
    let parsedResponse = null;

    try {
      parsedResponse = responseText ? JSON.parse(responseText) : null;
    } catch {
      parsedResponse = responseText;
    }

    if (!response.ok) {
      console.error('[whatsapp-zapi] Falha no envio.', {
        context,
        status: response.status,
        response: parsedResponse
      });

      return {
        ok: false,
        skipped: false,
        reason: 'zapi_http_error',
        status: response.status,
        response: parsedResponse
      };
    }

    console.log('[whatsapp-zapi] Envio realizado com sucesso.', {
      context,
      status: response.status,
      response: parsedResponse
    });

    return {
      ok: true,
      skipped: false,
      status: response.status,
      response: parsedResponse
    };
  } catch (err) {
    console.error('[whatsapp-zapi] Erro inesperado no envio.', {
      context,
      erro: err.message
    });

    return { ok: false, skipped: false, reason: 'zapi_request_error', error: err.message };
  }
}

module.exports = {
  sendWhatsAppByEvent
};