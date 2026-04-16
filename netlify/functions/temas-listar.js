const { getStore } = require('@netlify/blobs');

const TEMAS_PADRAO = [
  { id: 't1', nome: 'Saúde e Cura', slug: 'saude-cura', icone: '🏥', ativo: true },
  { id: 't2', nome: 'Família', slug: 'familia', icone: '👨‍👩‍👧', ativo: true },
  { id: 't3', nome: 'Finanças', slug: 'financas', icone: '💰', ativo: true },
  { id: 't4', nome: 'Salvação', slug: 'salvacao', icone: '✝️', ativo: true },
  { id: 't5', nome: 'Libertação', slug: 'libertacao', icone: '🕊️', ativo: true },
  { id: 't6', nome: 'Saúde Mental', slug: 'saude-mental', icone: '🧠', ativo: true },
  { id: 't7', nome: 'Nações', slug: 'nacoes', icone: '🌍', ativo: true },
  { id: 't8', nome: 'Missões', slug: 'missoes', icone: '🚢', ativo: true },
  { id: 't9', nome: 'Casamento', slug: 'casamento', icone: '💍', ativo: true },
  { id: 't10', nome: 'Filhos', slug: 'filhos', icone: '👶', ativo: true },
  { id: 't11', nome: 'Milagres', slug: 'milagres', icone: '⚡', ativo: true },
  { id: 't12', nome: 'Avivamento', slug: 'avivamento', icone: '🔥', ativo: true }
];

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
    const store = abrirStore('temas-oracao');
    const { blobs } = await store.list();

    if (!blobs || blobs.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ total: TEMAS_PADRAO.length, temas: TEMAS_PADRAO })
      };
    }

    const temas = [];
    for (const blob of blobs) {
      try {
        const item = await store.get(blob.key, { type: 'json' });
        if (!item) continue;
        if (!item.ativo) continue;
        temas.push(item);
      } catch {
        // Ignora registro inválido
      }
    }

    if (temas.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ total: TEMAS_PADRAO.length, temas: TEMAS_PADRAO })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ total: temas.length, temas })
    };
  } catch (err) {
    console.error('Erro ao listar temas:', err);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ total: TEMAS_PADRAO.length, temas: TEMAS_PADRAO })
    };
  }
};
