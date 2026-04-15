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

  const colecao = event.queryStringParameters?.colecao;
  if (!['professores', 'alunos'].includes(colecao)) {
    return json(400, { erro: 'Coleção inválida. Use professores ou alunos.' });
  }

  try {
    const store = abrirStore(colecao);
    const { blobs } = await store.list();

    const registros = [];
    for (const blob of blobs) {
      try {
        const item = await store.get(blob.key, { type: 'json' });
        if (item) registros.push(item);
      } catch {
        // Ignora registro inválido
      }
    }

    registros.sort((a, b) => {
      const da = Date.parse(b.createdAt || b.criadoEm || 0) || 0;
      const db = Date.parse(a.createdAt || a.criadoEm || 0) || 0;
      return da - db;
    });

    return json(200, registros);
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
