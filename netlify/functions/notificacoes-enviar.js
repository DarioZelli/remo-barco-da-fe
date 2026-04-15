const { json, requireAdmin } = require('./_lib/admin-auth');
const { upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  const auth = await requireAdmin(event);
  if (!auth.autorizado) return auth.response;

  try {
    const body = JSON.parse(event.body || '{}');
    const id = `notif_${Date.now()}`;
    const payload = {
      id,
      destinatario: String(body.destinatario || ''),
      tipo: String(body.tipo || 'informativo'),
      titulo: String(body.titulo || 'Notificação REMO'),
      mensagem: String(body.mensagem || ''),
      createdAt: nowIso()
    };

    await upsert('bf-notificacoes', id, payload);
    return json(200, { ok: true, notificacao: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
