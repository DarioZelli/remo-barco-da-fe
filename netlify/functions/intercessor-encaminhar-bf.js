const crypto = require('crypto');
const { requireAdmin, json, abrirStore } = require('./_lib/admin-auth');
const { getById, upsert, nowIso } = require('./_lib/data-utils');

function mapearExperiencia(intercessor) {
  if (intercessor.liderouIntercessao) return 'Líder — coordeno intercessores ou grupos';
  if (intercessor.participouGrupoOracao) return 'Intermediário — já participo de grupos de oração';
  return 'Básico — oro regularmente de forma pessoal';
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  const auth = await requireAdmin(event);
  if (!auth.autorizado) return auth.response;

  try {
    const body = JSON.parse(event.body || '{}');
    const intercessorId = String(body.intercessorId || body.id || '').trim();
    if (!intercessorId) return json(400, { erro: 'ID do intercessor é obrigatório' });

    const intercessor = await getById('intercessores', intercessorId);
    if (!intercessor) return json(404, { erro: 'Intercessor não encontrado' });

    if (intercessor.candidaturaBfId) {
      const existente = await getById('candidaturas-bf', intercessor.candidaturaBfId);
      if (existente) {
        return json(200, {
          sucesso: true,
          reutilizado: true,
          candidaturaId: existente.id,
          tokenComplementacao: intercessor.candidaturaBfToken || existente.tokenComplementacao || '',
          linkComplementacao: intercessor.candidaturaBfLink || existente.linkComplementacao || ''
        });
      }
    }

    const agora = nowIso();
    const candidaturaId = 'candidatura_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const tokenComplementacao = 'bfpre_' + crypto.randomBytes(16).toString('hex');
    const linkComplementacao = `/barco-da-fe/complementar?token=${tokenComplementacao}`;

    const candidatura = {
      id: candidaturaId,
      nomeCompleto: intercessor.nomeCompleto || '',
      cpf: '',
      dataNascimento: intercessor.dataNascimento || '',
      email: intercessor.email || '',
      telefone: intercessor.telefoneCelular || intercessor.telefone || '',
      cidade: '',
      estado: '',
      pais: 'Brasil',
      moduloDesejado: 'N1 — Fundamentação',
      igrejaMinisterio: intercessor.comunidadeCongrega || '',
      experienciaOracao: mapearExperiencia(intercessor),
      disponibilidade: '',
      motivacao: intercessor.motivacao || '',
      aceiteVoluntariado: false,
      aceiteComunicacoes: false,
      dataEnvio: agora,
      criadoEm: agora,
      atualizadoEm: agora,
      status: 'pendente',
      preCadastro: true,
      precisaComplementacao: true,
      origem: 'triagem_intercessor',
      intercessorOrigemId: intercessor.id,
      tokenComplementacao,
      linkComplementacao,
      observacoesAdmin: 'Pré-candidatura criada automaticamente a partir da triagem de intercessores da REMO.',
      pendenciasObrigatorias: ['cpf', 'cidade', 'estado', 'moduloDesejado', 'disponibilidade', 'aceiteVoluntariado']
    };

    await upsert('candidaturas-bf', candidaturaId, candidatura);

    const tokenStore = abrirStore('bf-pre-candidatura-tokens');
    await tokenStore.setJSON(tokenComplementacao, {
      token: tokenComplementacao,
      candidaturaId,
      intercessorId: intercessor.id,
      criadoEm: agora,
      usado: false
    });

    const intercessorAtualizado = {
      ...intercessor,
      status: intercessor.status === 'ativo' ? 'ativo' : 'encaminhado_barco_da_fe',
      candidaturaBfId: candidaturaId,
      candidaturaBfToken: tokenComplementacao,
      candidaturaBfLink: linkComplementacao,
      atualizadoEm: agora
    };

    await upsert('intercessores', intercessor.id, intercessorAtualizado);

    return json(200, {
      sucesso: true,
      candidaturaId,
      tokenComplementacao,
      linkComplementacao
    });
  } catch (err) {
    console.error('Erro ao encaminhar intercessor para BF:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
