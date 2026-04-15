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

  const colecao = event.queryStringParameters?.colecao || 'pedidos-oracao';
  const colecoesPermitidas = ['pedidos-oracao', 'candidaturas-bf', 'relogio-oracao', 'intercessores'];

  if (!colecoesPermitidas.includes(colecao)) {
    return { statusCode: 400, body: JSON.stringify({ erro: 'Coleção inválida' }) };
  }

  try {
    const store = abrirStore(colecao);
    const { blobs } = await store.list();

    const registros = await Promise.all(
      blobs.map(async b => {
        try { return await store.get(b.key, { type: 'json' }); }
        catch { return null; }
      })
    );

    const resultado = registros
      .filter(Boolean)
      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

    return json(200, { total: resultado.length, registros: resultado });
  } catch (err) {
    console.error('Erro ao listar:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
