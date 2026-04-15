const { list } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método não permitido' }) };
  }

  // Verificar token de admin
  const token = event.headers['x-admin-token'];
  if (token !== 'remo-admin-2025') {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Token inválido' }) };
  }

  try {
    const { colecao } = event.queryStringParameters || {};

    if (!colecao) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Coleção não especificada' }) };
    }

    // Listar blobs da coleção
    const blobs = await list({ prefix: `${colecao}/` });
    const dados = [];

    for (const blob of blobs.blobs) {
      try {
        const content = await blob.text();
        const item = JSON.parse(content);
        dados.push({
          id: blob.key.replace(`${colecao}/`, '').replace('.json', ''),
          ...item
        });
      } catch (e) {
        console.error(`Erro ao processar ${blob.key}:`, e);
      }
    }

    // Ordenar por data de criação (mais recentes primeiro)
    dados.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(dados)
    };

  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno do servidor' })
    };
  }
};