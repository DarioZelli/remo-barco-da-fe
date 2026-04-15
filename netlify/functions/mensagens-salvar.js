const { randomUUID } = require('crypto');
const { json, requireAdmin } = require('./_lib/admin-auth');
const { upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  const auth = await requireAdmin(event);
  if (!auth.autorizado) return auth.response;

  try {
    const body = JSON.parse(event.body || '{}');
    if (!body.alunoId || !body.mensagem) return json(400, { erro: 'alunoId e mensagem são obrigatórios' });

    const id = String(body.id || `msg_${randomUUID()}`);
    const payload = {
      id,
      alunoId: String(body.alunoId),
      professorId: String(body.professorId || ''),
      moduloId: String(body.moduloId || ''),
      assunto: String(body.assunto || 'Mensagem'),
      categoria: String(body.categoria || 'geral'),
      mensagem: String(body.mensagem || ''),
      remetenteTipo: String(body.remetenteTipo || 'admin'),
      lida: Boolean(body.lida),
      statusConversa: String(body.statusConversa || 'aberta'),
      createdAt: body.createdAt || nowIso()
    };

    await upsert('bf-mensagens', id, payload);
    return json(200, { ok: true, mensagem: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
