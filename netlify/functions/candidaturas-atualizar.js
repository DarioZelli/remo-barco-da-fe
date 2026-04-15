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

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ erro: 'Method Not Allowed' }) };
  }

  const token = event.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return { statusCode: 401, body: JSON.stringify({ erro: 'Não autorizado' }) };
  }

  try {
    const dados = JSON.parse(event.body || '{}');
    const id = dados.id;
    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ erro: 'ID da candidatura é obrigatório' }) };
    }

    const store = abrirStore('candidaturas-bf');
    let registroExistente;
    try {
      registroExistente = await store.get(id, { type: 'json' });
    } catch (err) {
      console.error('Candidatura não encontrada:', err);
      return { statusCode: 404, body: JSON.stringify({ erro: 'Candidatura não encontrada' }) };
    }

    const atualizacao = {
      ...registroExistente,
      ...dados,
      atualizadoEm: new Date().toISOString()
    };

    const notas = [
      Number(atualizacao.notaTeorica) || 0,
      Number(atualizacao.notaPratica) || 0,
      Number(atualizacao.notaCompromisso) || 0
    ];
    if (notas.some(n => n > 0)) {
      atualizacao.notaFinal = Number((notas.reduce((sum, n) => sum + n, 0) / notas.length).toFixed(2));
    }

    await store.setJSON(id, atualizacao);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ sucesso: true, registro: atualizacao })
    };
  } catch (err) {
    console.error('Erro ao atualizar candidatura:', err);
    return { statusCode: 500, body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message }) };
  }
};
