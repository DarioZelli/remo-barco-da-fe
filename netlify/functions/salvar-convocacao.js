const { getStore } = require('@netlify/blobs');

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'remo-admin-2025';

function abrirStore(nome) {
  const siteID = process.env.BLOBS_SITE_ID;
  const token  = process.env.BLOBS_TOKEN;
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

    if (!dados.titulo || !dados.mensagem) {
      return { statusCode: 400, body: JSON.stringify({ erro: 'Campos obrigatórios ausentes: titulo, mensagem' }) };
    }

    const id = dados.id || ('conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));
    const store = abrirStore('convocacoes');

    let existente = {};
    if (dados.id) {
      try { existente = await store.get(dados.id, { type: 'json' }) || {}; } catch (_) {}
    }

    const registro = {
      ...existente,
      id,
      titulo: dados.titulo,
      tipo: dados.tipo || 'oração',
      mensagem: dados.mensagem,
      publicoAlvo: dados.publicoAlvo || 'todos',
      canal: dados.canal || 'whatsapp',
      reuniaoId: dados.reuniaoId || '',
      metaId: dados.metaId || '',
      urgente: dados.urgente === true || dados.urgente === 'true',
      status: dados.status || 'rascunho',
      dataEnvio: dados.dataEnvio || '',
      criadoEm: existente.criadoEm || new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };

    await store.setJSON(id, registro);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ sucesso: true, id, registro })
    };
  } catch (err) {
    console.error('Erro ao salvar convocação:', err);
    return { statusCode: 500, body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message }) };
  }
};
