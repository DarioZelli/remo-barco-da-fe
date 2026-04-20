const { getStore } = require('@netlify/blobs');
const { sendWhatsAppByEvent } = require('./_lib/whatsapp-zapi');

const TIPOS_VALIDOS = ['Grupo Doméstico', 'Igreja Local', 'Ministério Parceiro', 'Núcleo Regional'];
const FORMATOS_VALIDOS = ['Presencial', 'Online', 'Híbrido'];

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
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ erro: 'Method Not Allowed' })
    };
  }

  try {
    const dados = JSON.parse(event.body || '{}');

    if (!dados.tipo || !dados.nomeGrupo || !dados.responsavel || !dados.telefone || !dados.email || !dados.cidade || !dados.estado) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ erro: 'Campos obrigatórios ausentes: tipo, nomeGrupo, responsavel, telefone, email, cidade, estado' })
      };
    }

    if (!TIPOS_VALIDOS.includes(dados.tipo)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ erro: 'Tipo inválido. Use: ' + TIPOS_VALIDOS.join(', ') })
      };
    }

    if (dados.formato && !FORMATOS_VALIDOS.includes(dados.formato)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ erro: 'Formato inválido. Use: ' + FORMATOS_VALIDOS.join(', ') })
      };
    }

    const id = 'grupo_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

    const registro = {
      id,
      tipo: dados.tipo,
      nomeGrupo: dados.nomeGrupo,
      responsavel: dados.responsavel,
      telefone: dados.telefone,
      email: dados.email,
      cidade: dados.cidade,
      estado: dados.estado,
      quantidadeAproximada: dados.quantidadeAproximada ? Number(dados.quantidadeAproximada) : null,
      formato: dados.formato || '',
      diasDisponiveis: dados.diasDisponiveis || [],
      autorizaDivulgacao: !!dados.autorizaDivulgacao,
      status: 'pendente',
      criadoEm: new Date().toISOString()
    };

    const store = abrirStore('grupos');
    await store.setJSON(id, registro);
    await sendWhatsAppByEvent({
      eventType: 'general_registration',
      phone: dados.telefone,
      context: { funcao: 'grupos-salvar', id }
    }).catch((notificationError) => {
      console.error('Falha no envio de WhatsApp (grupo):', notificationError);
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ sucesso: true, id })
    };
  } catch (err) {
    console.error('Erro ao salvar grupo:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message })
    };
  }
};
