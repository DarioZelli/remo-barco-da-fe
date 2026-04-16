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
    const tipo = event.queryStringParameters?.tipo || 'igrejas';

    if (!['igrejas', 'ministerios'].includes(tipo)) {
      return { statusCode: 400, body: JSON.stringify({ erro: 'Tipo inválido. Use: igrejas ou ministerios' }) };
    }

    if (!dados.nome || !dados.contato) {
      return { statusCode: 400, body: JSON.stringify({ erro: 'Campos obrigatórios ausentes: nome, contato' }) };
    }

    const prefixo = tipo === 'igrejas' ? 'igreja' : 'ministerio';
    const id = dados.id || (prefixo + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));
    const store = abrirStore(tipo);

    let existente = {};
    if (dados.id) {
      try { existente = await store.get(dados.id, { type: 'json' }) || {}; } catch (_) {}
    }

    const registro = {
      ...existente,
      id,
      nome: dados.nome,
      contato: dados.contato,
      telefone: dados.telefone || '',
      email: dados.email || '',
      cidade: dados.cidade || '',
      estado: dados.estado || '',
      ...(tipo === 'igrejas' ? {
        diocese: dados.diocese || '',
        paroquia: dados.paroquia || '',
        pastor: dados.pastor || ''
      } : {
        responsavel: dados.responsavel || '',
        descricao: dados.descricao || '',
        tipoParceria: dados.tipoParceria || 'associado'
      }),
      status: dados.status || 'ativo',
      criadoEm: existente.criadoEm || new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };

    await store.setJSON(id, registro);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ sucesso: true, id })
    };
  } catch (err) {
    console.error('Erro ao salvar:', err);
    return { statusCode: 500, body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message }) };
  }
};
