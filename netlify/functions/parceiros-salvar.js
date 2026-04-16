const { getStore } = require('@netlify/blobs');

const TIPOS_VALIDOS = ['Igreja', 'Ministério', 'Organização', 'Empresa', 'Pessoa'];

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

    if (!dados.nomePublico || !dados.responsavel || !dados.telefone || !dados.email || !dados.cidade || !dados.tipo) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ erro: 'Campos obrigatórios ausentes: nomePublico, responsavel, telefone, email, cidade, tipo' })
      };
    }

    if (!TIPOS_VALIDOS.includes(dados.tipo)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ erro: 'Tipo inválido. Use: ' + TIPOS_VALIDOS.join(', ') })
      };
    }

    const id = 'parceiro_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

    const registro = {
      id,
      nomePublico: dados.nomePublico,
      responsavel: dados.responsavel,
      telefone: dados.telefone,
      email: dados.email,
      cidade: dados.cidade,
      estado: dados.estado || '',
      tipo: dados.tipo,
      autorizaDivulgacao: !!dados.autorizaDivulgacao,
      divulgarPublicamente: false,
      aprovado: false,
      status: 'pendente',
      criadoEm: new Date().toISOString()
    };

    const store = abrirStore('parceiros');
    await store.setJSON(id, registro);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ sucesso: true, id })
    };
  } catch (err) {
    console.error('Erro ao salvar parceiro:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message })
    };
  }
};
