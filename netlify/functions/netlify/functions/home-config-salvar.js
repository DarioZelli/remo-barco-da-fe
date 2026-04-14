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
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

function limparTexto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return resposta(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return resposta(405, { erro: 'Method Not Allowed' });
  }

  const token = event.headers['x-admin-token'] || event.headers['X-Admin-Token'];
  if (token !== ADMIN_TOKEN) {
    return resposta(401, { erro: 'Não autorizado' });
  }

  try {
    const dados = JSON.parse(event.body || '{}');

    const registro = {
      tituloPrincipal: limparTexto(dados.tituloPrincipal),
      subtitulo: limparTexto(dados.subtitulo),
      videoPrincipal: limparTexto(dados.videoPrincipal),
      imagemPrincipal: limparTexto(dados.imagemPrincipal),
      botaoPrincipal: limparTexto(dados.botaoPrincipal),
      linkBotao: limparTexto(dados.linkBotao),
      mostrarVideo: !!dados.mostrarVideo,
      atualizadoEm: new Date().toISOString()
    };

    const store = abrirStore('home-config');
    await store.setJSON('atual', registro);

    return resposta(200, { sucesso: true, config: registro });
  } catch (err) {
    console.error('Erro ao salvar home-config:', err);
    return resposta(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
