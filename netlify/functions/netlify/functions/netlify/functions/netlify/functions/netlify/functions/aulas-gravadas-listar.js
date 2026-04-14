const { getStore } = require('@netlify/blobs');

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'remo-admin-2025';

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

  const incluirOcultos = event.queryStringParameters?.incluirOcultos === 'true';
  const token = event.headers['x-admin-token'] || event.headers['X-Admin-Token'];
  const podeVerOcultos = incluirOcultos && token === ADMIN_TOKEN;

  try {
    const store = abrirStore('aulas-gravadas');
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

    const aulas = registros
      .filter(Boolean)
      .filter(aula => (podeVerOcultos ? true : aula.publicado !== false))
      .sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0));

    return resposta(200, { total: aulas.length, aulas });
  } catch (err) {
    console.error('Erro ao listar aulas gravadas:', err);
    return resposta(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
