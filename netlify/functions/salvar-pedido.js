const { getStore } = require('@netlify/blobs');

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { erro: 'Method Not Allowed' });
  }

  try {
    const dados = JSON.parse(event.body || '{}');

    if (
      !dados.nomeSolicitante ||
      !dados.telefone ||
      !dados.descricao ||
      !dados.tema ||
      !dados.causa
    ) {
      return json(400, { erro: 'Campos obrigatórios ausentes' });
    }

    const id =
      'pedido_' +
      Date.now() +
      '_' +
      Math.random().toString(36).slice(2, 8);

    const registro = {
      id,
      nomeSolicitante: String(dados.nomeSolicitante).trim(),
      telefone: String(dados.telefone).trim(),
      paraQuem: String(dados.paraQuem || '').trim(),
      tema: String(dados.tema).trim(),
      causa: String(dados.causa).trim(),
      descricao: String(dados.descricao).trim(),
      compartilhar: !!dados.compartilhar,
      oracaoContinua: !!dados.oracaoContinua,
      campanhaColetiva: !!dados.campanhaColetiva,
      dataEnvio: dados.dataEnvio || new Date().toISOString(),
      criadoEm: new Date().toISOString(),
      status: 'ativo'
    };

    // Em Netlify Functions do mesmo site, o Blobs injeta credenciais automaticamente.
    const store = getStore('pedidos-oracao');

    await store.setJSON(id, registro);

    return json(200, {
      sucesso: true,
      id
    });
  } catch (err) {
    console.error('Erro ao salvar pedido:', {
      message: err?.message,
      stack: err?.stack
    });

    return json(500, {
      erro: 'Erro interno',
      detalhe: err?.message || 'Falha ao salvar pedido'
    });
  }
};
