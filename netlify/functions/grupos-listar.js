const { abrirStore, json, requireAdmin } = require('./_lib/admin-auth');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'GET') {
    return json(405, { erro: 'Method Not Allowed' });
  }

  const auth = await requireAdmin(event);
  if (!auth.autorizado) {
    return auth.response;
  }

  try {
    const store = abrirStore('grupos');
    const { blobs } = await store.list();

    const grupos = [];
    for (const blob of blobs) {
      try {
        const item = await store.get(blob.key, { type: 'json' });
        if (!item) continue;
        grupos.push(item);
      } catch {
        // Ignora registro inválido
      }
    }

    grupos.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

    return json(200, { total: grupos.length, grupos });
  } catch (err) {
    console.error('Erro ao listar grupos:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
