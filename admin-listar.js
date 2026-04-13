const { getStore } = require('@netlify/blobs');

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'remo-admin-2025';

exports.handler = async function(event) {
  // Autenticação simples via header
  const token = event.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return { statusCode: 401, body: JSON.stringify({ erro: 'Não autorizado' }) };
  }

  const colecao = event.queryStringParameters?.colecao || 'pedidos-oracao';
  const colecoesPermitidas = ['pedidos-oracao', 'candidaturas-bf', 'relogio-oracao', 'intercessores'];

  if (!colecoesPermitidas.includes(colecao)) {
    return { statusCode: 400, body: JSON.stringify({ erro: 'Coleção inválida' }) };
  }

  try {
    const store = getStore(colecao);
    const { blobs } = await store.list();

    const registros = await Promise.all(
      blobs.map(async b => {
        try { return await store.get(b.key, { type: 'json' }); }
        catch { return null; }
      })
    );

    const resultado = registros
      .filter(Boolean)
      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ total: resultado.length, registros: resultado })
    };
  } catch (err) {
    console.error('Erro ao listar:', err);
    return { statusCode: 500, body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message }) };
  }
};
