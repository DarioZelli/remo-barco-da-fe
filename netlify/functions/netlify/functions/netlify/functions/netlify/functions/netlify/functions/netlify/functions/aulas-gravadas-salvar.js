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

    if (!limparTexto(dados.titulo) || !limparTexto(dados.linkVideo)) {
      return resposta(400, { erro: 'Título e link do vídeo são obrigatórios' });
    }

    const id = limparTexto(dados.id) || `aula_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const aula = {
      id,
      titulo: limparTexto(dados.titulo),
      modulo: limparTexto(dados.modulo),
      professor: limparTexto(dados.professor),
      descricao: limparTexto(dados.descricao),
      linkVideo: limparTexto(dados.linkVideo),
      thumbnail: limparTexto(dados.thumbnail),
      pdf: limparTexto(dados.pdf),
      ordem: Number(dados.ordem) || 0,
      publicado: dados.publicado !== false,
      atualizadoEm: new Date().toISOString()
    };

    const store = abrirStore('aulas-gravadas');
    await store.setJSON(id, aula);

    return resposta(200, { sucesso: true, aula });
  } catch (err) {
    console.error('Erro ao salvar aula gravada:', err);
    return resposta(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
