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
    const store = abrirStore('home-config');
    const config = await store.get('atual', { type: 'json' });

    if (!config) {
      return resposta(200, {
        config: {
          tituloPrincipal: '',
          subtitulo: '',
          videoPrincipal: '',
          imagemPrincipal: '',
          botaoPrincipal: '',
          linkBotao: '',
          mostrarVideo: false,
          atualizadoEm: null
        }
      });
    }

    return resposta(200, { config });
  } catch (err) {
    console.error('Erro ao listar home-config:', err);
    return resposta(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
