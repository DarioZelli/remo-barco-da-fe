const { getStore } = require('@netlify/blobs');

function abrirStore(nome) {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name: nome, siteID, token });
  }
  return getStore(nome);
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ erro: 'Method Not Allowed' })
    };
  }

  try {
    const dados = JSON.parse(event.body || '{}');

    if (!dados.campanhaId || !dados.nome || !dados.valorPrometido) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ erro: 'Campos obrigatórios ausentes: campanhaId, nome, valorPrometido' })
      };
    }

    const id = 'doacao_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

    const registro = {
      id,
      campanhaId: dados.campanhaId,
      nome: dados.nome,
      valorPrometido: Number(dados.valorPrometido),
      valorEnviado: dados.valorEnviado ? Number(dados.valorEnviado) : null,
      comprovanteUrl: dados.comprovanteUrl || '',
      exibirPublicamente: !!dados.exibirPublicamente,
      observacoes: dados.observacoes || '',
      status: 'pendente',
      criadoEm: new Date().toISOString()
    };

    const store = abrirStore('doacoes');
    await store.setJSON(id, registro);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ sucesso: true, id })
    };
  } catch (err) {
    console.error('Erro ao salvar doação:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message })
    };
  }
};
