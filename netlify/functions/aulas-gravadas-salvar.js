const { randomUUID } = require('crypto');
const { abrirStore, json, requireAdmin } = require('./_lib/admin-auth');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { erro: 'Method Not Allowed' });
  }

  const auth = await requireAdmin(event);
  if (!auth.autorizado) {
    return auth.response;
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const titulo = String(body.titulo || '').trim();
    const linkVideo = String(body.linkVideo || '').trim();

    if (!titulo || !linkVideo) {
      return json(400, { erro: 'Título e link do vídeo são obrigatórios' });
    }

    const id = String(body.id || `aula_${randomUUID()}`);
    const agora = new Date().toISOString();

    const payload = {
      id,
      titulo,
      modulo: String(body.modulo || ''),
      professor: String(body.professor || ''),
      descricao: String(body.descricao || ''),
      linkVideo,
      thumbnail: String(body.thumbnail || ''),
      pdf: String(body.pdf || ''),
      ordem: Number(body.ordem) || 0,
      publicado: body.publicado !== false,
      atualizadoEm: agora
    };

    const store = abrirStore('aulas-gravadas');
    const anterior = await store.get(id, { type: 'json' }).catch(() => null);
    payload.criadoEm = anterior?.criadoEm || agora;

    await store.setJSON(id, payload);

    return json(200, { ok: true, aula: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
