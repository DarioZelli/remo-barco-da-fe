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

function parseBoolean(valor) {
  if (typeof valor === 'boolean') return valor;
  const normalizado = String(valor || '').trim().toLowerCase();
  return ['true', '1', 'sim', 'yes', 'on'].includes(normalizado);
}

function parseTempoCaminhada(valor) {
  const texto = String(valor || '').trim().toLowerCase();
  const numero = Number((texto.match(/\d+(?:[\.,]\d+)?/) || [])[0]?.replace(',', '.'));
  if (!Number.isFinite(numero)) return 0;
  return numero;
}

function decidirTriagem(dados) {
  const professa = parseBoolean(dados.feProfessa);
  const participouGrupo = parseBoolean(dados.participouGrupoOracao);
  const liderou = parseBoolean(dados.liderouIntercessao);
  const aceitaServir = parseBoolean(dados.aceitaServir);
  const alinhado = parseBoolean(dados.declaracaoAlinhamento);
  const anos = parseTempoCaminhada(dados.tempoCaminhada);

  if (!professa) {
    return {
      recomendacao: 'avaliacao_doutrinaria',
      justificativa: 'Não houve confirmação de fé cristã evangélica. O cadastro deve passar por análise ministerial antes de qualquer aprovação.'
    };
  }

  let pontuacao = 0;
  if (participouGrupo) pontuacao += 2;
  if (liderou) pontuacao += 3;
  if (anos >= 7) pontuacao += 3;
  else if (anos >= 3) pontuacao += 2;
  else if (anos >= 1) pontuacao += 1;
  if (aceitaServir) pontuacao += 1;
  if (alinhado) pontuacao += 1;

  if ((liderou && anos >= 3 && aceitaServir) || pontuacao >= 7) {
    return {
      recomendacao: 'aprovacao_direta',
      justificativa: 'Perfil com sinais de maturidade cristã, experiência prévia em oração e condições para avaliação favorável à entrada direta como intercessor.',
      pontuacao
    };
  }

  return {
    recomendacao: 'encaminhar_escola_barco_da_fe',
    justificativa: 'Perfil promissor, porém com necessidade de formação adicional antes de aprovação direta como intercessor ativo.',
    pontuacao
  };
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ ok: true })
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

    if (
      !dados.nomeCompleto ||
      !dados.email ||
      !dados.telefoneCelular ||
      !dados.dataNascimento ||
      !dados.enderecoCompleto ||
      !dados.motivacao ||
      !dados.comunidadeCongrega ||
      !dados.tempoCaminhada
    ) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ erro: 'Campos obrigatórios ausentes' })
      };
    }

    if (!parseBoolean(dados.aceitaServir) || !parseBoolean(dados.declaracaoAlinhamento)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ erro: 'É necessário aceitar servir na REMO e confirmar alinhamento doutrinário.' })
      };
    }

    const id = 'intercessor_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const agora = new Date().toISOString();
    const triagem = decidirTriagem(dados);

    const registro = {
      id,
      nomeCompleto: dados.nomeCompleto,
      dataNascimento: dados.dataNascimento,
      email: String(dados.email || '').trim().toLowerCase(),
      telefoneCelular: dados.telefoneCelular,
      telefone: dados.telefoneCelular,
      enderecoCompleto: dados.enderecoCompleto,
      motivacao: dados.motivacao,
      participouGrupoOracao: parseBoolean(dados.participouGrupoOracao),
      liderouIntercessao: parseBoolean(dados.liderouIntercessao),
      feProfessa: parseBoolean(dados.feProfessa),
      comunidadeCongrega: dados.comunidadeCongrega,
      tempoCaminhada: dados.tempoCaminhada,
      aceitaServir: parseBoolean(dados.aceitaServir),
      declaracaoAlinhamento: parseBoolean(dados.declaracaoAlinhamento),
      status: 'pendente_triagem',
      decisaoCoordenador: '',
      observacoesCoordenador: '',
      triagem,
      criadoEm: agora,
      createdAt: agora,
      atualizadoEm: agora,
      origem: 'formulario_intercessor_barco_da_fe'
    };

    const store = abrirStore('intercessores');
    await store.setJSON(id, registro);
    await sendWhatsAppByEvent({
      eventType: 'intercessor_registration',
      phone: dados.telefoneCelular,
      context: { funcao: 'salvar-intercessor', id }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        sucesso: true,
        id,
        status: registro.status,
        recomendacao: triagem.recomendacao,
        justificativa: triagem.justificativa
      })
    };
  } catch (err) {
    console.error('Erro ao salvar intercessor:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message })
    };
  }
};
