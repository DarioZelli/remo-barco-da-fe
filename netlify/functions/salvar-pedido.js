const { getStore } = require('@netlify/blobs');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const dados = JSON.parse(event.body);

    if (!dados.nomeSolicitante || !dados.telefone || !dados.descricao || !dados.tema) {
      return { statusCode: 400, body: JSON.stringify({ erro: 'Campos obrigatórios ausentes' }) };
    }

    const id = 'pedido_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const registro = { id, ...dados, criadoEm: new Date().toISOString(), status: 'ativo' };

    const store = getStore('pedidos-oracao');
    await store.setJSON(id, registro);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ sucesso: true, id })
    };
  } catch (err) {
    console.error('Erro ao salvar pedido:', err);
    return { statusCode: 500, body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message }) };
  }
};
