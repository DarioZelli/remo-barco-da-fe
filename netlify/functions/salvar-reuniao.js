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

    if (!dados.titulo || !dados.dataHora) {
      return { statusCode: 400, body: JSON.stringify({ erro: 'Campos obrigatórios ausentes: titulo, dataHora' }) };
    }

    const id = dados.id || ('reuniao_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));
    const store = abrirStore('reunioes');

    let existente = {};
    if (dados.id) {
      try { existente = await store.get(dados.id, { type: 'json' }) || {}; } catch (_) {}
    }

    const registro = {
      ...existente,
      id,
      titulo: dados.titulo,
      tipo: dados.tipo || 'online',
      dataHora: dados.dataHora,
      local: dados.local || '',
      linkVideoconferencia: dados.linkVideoconferencia || '',
      plataforma: dados.plataforma || '',
      pauta: dados.pauta || '',
      publicoAlvo: dados.publicoAlvo || 'todos',
      status: dados.status || 'agendada',
      lembreteEnviado: dados.lembreteEnviado || false,
      confirmacoes: Number(dados.confirmacoes) || 0,
      observacoes: dados.observacoes || '',
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
    console.error('Erro ao salvar reunião:', err);
    return { statusCode: 500, body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message }) };
  }
};
