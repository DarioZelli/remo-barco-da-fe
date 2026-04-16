const { getStore } = require('@netlify/blobs');

const POR_PAGINA = 9;

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
    const categoriaFiltro = params.categoria || '';
    const pagina = Math.max(1, parseInt(params.pagina || '1', 10));

    const store = abrirStore('blog-posts');
    const { blobs } = await store.list();

    const posts = [];
    for (const blob of blobs) {
      try {
        const item = await store.get(blob.key, { type: 'json' });
        if (!item) continue;
        if (!item.publicado) continue;
        if (categoriaFiltro && item.categoria !== categoriaFiltro) continue;
        posts.push(item);
      } catch {
        // Ignora registro inválido
      }
    }

    posts.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

    const total = posts.length;
    const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
    const inicio = (pagina - 1) * POR_PAGINA;
    const paginaAtual = posts.slice(inicio, inicio + POR_PAGINA);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ total, pagina, totalPaginas, posts: paginaAtual })
    };
  } catch (err) {
    console.error('Erro ao listar blog posts:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message })
    };
  }
};
