const { getStore } = require('@netlify/blobs');

function abrirStore(nome) {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_TOKEN;

  if (siteID && token) {
    return getStore({ name: nome, siteID, token });
  }

  return getStore(nome);
}

function resposta(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return resposta(200, { ok: true });
  }

  if (event.httpMethod !== 'GET') {
    return resposta(405, { erro: 'Method Not Allowed' });
  }

  try {
    const store = abrirStore('home-cards');
    const { blobs } = await store.list();

    const registros = await Promise.all(
      blobs.map(async item => {
        try {
          return await store.get(item.key, { type: 'json' });
        } catch {
          return null;
        }
      })
    );

    const cards = registros
      .filter(Boolean)
      .filter(card => card.ativo !== false)
      .sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0));

    return resposta(200, { total: cards.length, cards });
  } catch (err) {
    console.error('Erro ao listar home-cards:', err);
    return resposta(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
