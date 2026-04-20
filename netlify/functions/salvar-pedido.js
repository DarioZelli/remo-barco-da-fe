const { getStore } = require('@netlify/blobs');
const { sendWhatsAppByEvent } = require('./_lib/whatsapp-zapi');

function abrirStore(nome) {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_TOKEN;

  if (siteID && token) {
    return getStore({ name: nome, siteID, token });
  }

  return getStore(nome);
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ erro: 'Method Not Allowed' })
    };
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
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ erro: 'Campos obrigatórios ausentes' })
      };
    }

    const id =
      'pedido_' +
      Date.now() +
      '_' +
      Math.random().toString(36).substr(2, 6);

    const registro = {
      id,
      nomeSolicitante: dados.nomeSolicitante,
      telefone: dados.telefone,
      paraQuem: dados.paraQuem || '',
      tema: dados.tema,
      causa: dados.causa,
      descricao: dados.descricao,
      compartilhar: !!dados.compartilhar,
      oracaoContinua: !!dados.oracaoContinua,
      campanhaColetiva: !!dados.campanhaColetiva,
      dataEnvio: dados.dataEnvio || new Date().toISOString(),
      criadoEm: new Date().toISOString(),
      status: 'ativo'
    };

    const store = abrirStore('pedidos-oracao');
    await store.setJSON(id, registro);
    await sendWhatsAppByEvent({
      eventType: 'prayer_request',
      phone: dados.telefone,
      context: { funcao: 'salvar-pedido', id }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ sucesso: true, id })
    };
  } catch (err) {
    console.error('Erro ao salvar pedido:', err);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        erro: 'Erro interno',
        detalhe: err.message
      })
    };
  }
};
