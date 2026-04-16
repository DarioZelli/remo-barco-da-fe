const { getStore } = require('@netlify/blobs');

const POR_PAGINA = 12;

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
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ erro: 'Method Not Allowed' })
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const temaFiltro = params.tema || '';
    const pagina = Math.max(1, parseInt(params.pagina || '1', 10));

    const store = abrirStore('pedidos-oracao');
    const { blobs } = await store.list();

    const pedidos = [];
    for (const blob of blobs) {
      try {
        const item = await store.get(blob.key, { type: 'json' });
        if (!item) continue;
        if (!item.compartilhar || item.status !== 'ativo') continue;
        if (temaFiltro && item.tema !== temaFiltro) continue;

        // Omite campos privados
        const { telefone, email, ...pedidoPublico } = item;
        pedidos.push(pedidoPublico);
      } catch {
        // Ignora registro inválido
      }
    }

    pedidos.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

    const total = pedidos.length;
    const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
    const inicio = (pagina - 1) * POR_PAGINA;
    const paginaAtual = pedidos.slice(inicio, inicio + POR_PAGINA);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ total, pagina, totalPaginas, pedidos: paginaAtual })
    };
  } catch (err) {
    console.error('Erro ao listar pedidos públicos:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message })
    };
  }
};
