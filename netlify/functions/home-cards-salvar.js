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

    if (!titulo) {
      return json(400, { erro: 'Título é obrigatório' });
    }

    const id = String(body.id || `card_${randomUUID()}`);
    const agora = new Date().toISOString();

    const payload = {
      id,
      titulo,
      ordem: Number(body.ordem) || 0,
      icone: String(body.icone || ''),
      link: String(body.link || ''),
      descricao: String(body.descricao || ''),
      imagem: String(body.imagem || ''),
      ativo: body.ativo !== false,
      atualizadoEm: agora
    };

    const store = abrirStore('home-cards');
    const anterior = await store.get(id, { type: 'json' }).catch(() => null);
    payload.criadoEm = anterior?.criadoEm || agora;

    await store.setJSON(id, payload);

    return json(200, { ok: true, card: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
