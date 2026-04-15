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
  const query = event.queryStringParameters || {};
  const id = query.id?.trim();
  const email = query.email?.trim().toLowerCase();
  const cpf = query.cpf?.trim().replace(/\D/g, '');

  if (!id && !email && !cpf) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ erro: 'Informe id, email ou cpf para consulta.' })
    };
  }

  try {
    const store = abrirStore('candidaturas-bf');
    const { blobs } = await store.list();
    const registros = await Promise.all(blobs.map(async b => {
      try {
        return await store.get(b.key, { type: 'json' });
      } catch {
        return null;
      }
    }));

    const resultados = registros.filter(Boolean).filter(r => {
      if (id && r.id === id) return true;
      if (email && r.email?.toLowerCase() === email) return true;
      if (cpf && r.cpf?.replace(/\D/g, '') === cpf) return true;
      return false;
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ resultados })
    };
  } catch (err) {
    console.error('Erro ao buscar candidaturas:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message })
    };
  }
};
