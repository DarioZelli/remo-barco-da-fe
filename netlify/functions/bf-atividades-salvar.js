const { randomUUID } = require('crypto');
const { json, requireAdmin } = require('./_lib/admin-auth');
const { upsert, getById, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  const auth = await requireAdmin(event);
  if (!auth.autorizado) return auth.response;

  try {
    const body = JSON.parse(event.body || '{}');
    const titulo = String(body.titulo || '').trim();
    if (!titulo) return json(400, { erro: 'Título é obrigatório' });

    const id = String(body.id || `atividade_${randomUUID()}`);
    const anterior = await getById('bf-atividades', id);
    const agora = nowIso();

    const payload = {
      id,
      moduloId: String(body.moduloId || ''),
      aulaId: String(body.aulaId || ''),
      titulo,
      enunciado: String(body.enunciado || ''),
      tipo: String(body.tipo || 'texto'),
      prazo: body.prazo || null,
      obrigatoria: body.obrigatoria !== false,
      notaMaxima: Number(body.notaMaxima || 10),
      publicada: body.publicada !== false,
      createdAt: anterior?.createdAt || agora,
      updatedAt: agora
    };

    await upsert('bf-atividades', id, payload);
    return json(200, { ok: true, atividade: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
