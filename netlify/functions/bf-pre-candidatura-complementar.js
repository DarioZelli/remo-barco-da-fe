const { abrirStore, json } = require('./_lib/admin-auth');
const { getById, upsert, nowIso } = require('./_lib/data-utils');
const { sendWhatsAppByEvent } = require('./_lib/whatsapp-zapi');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  try {
    const body = JSON.parse(event.body || '{}');
    const token = String(body.token || '').trim();
    if (!token) return json(400, { erro: 'Token ausente' });

    const tokenStore = abrirStore('bf-pre-candidatura-tokens');
    const tokenRegistro = await tokenStore.get(token, { type: 'json' });
    if (!tokenRegistro?.candidaturaId) return json(404, { erro: 'Pré-candidatura não encontrada' });

    const candidatura = await getById('candidaturas-bf', tokenRegistro.candidaturaId);
    if (!candidatura) return json(404, { erro: 'Pré-candidatura não encontrada' });

    const obrigatorios = {
      nomeCompleto: String(body.nomeCompleto || '').trim(),
      cpf: String(body.cpf || '').trim(),
      email: String(body.email || '').trim(),
      telefone: String(body.telefone || '').trim(),
      cidade: String(body.cidade || '').trim(),
      estado: String(body.estado || '').trim(),
      pais: String(body.pais || '').trim(),
      moduloDesejado: String(body.moduloDesejado || '').trim(),
      experienciaOracao: String(body.experienciaOracao || '').trim(),
      disponibilidade: String(body.disponibilidade || '').trim(),
      motivacao: String(body.motivacao || '').trim()
    };

    const faltando = Object.entries(obrigatorios).filter(([, valor]) => !valor).map(([campo]) => campo);
    if (faltando.length) {
      return json(400, { erro: 'Campos obrigatórios ausentes', campos: faltando });
    }

    if (!body.aceiteVoluntariado) {
      return json(400, { erro: 'É necessário aceitar o Termo de Voluntariado.' });
    }

    const atualizado = {
      ...candidatura,
      ...obrigatorios,
      dataNascimento: String(body.dataNascimento || candidatura.dataNascimento || '').trim(),
      igrejaMinisterio: String(body.igrejaMinisterio || '').trim(),
      aceiteVoluntariado: true,
      aceiteComunicacoes: !!body.aceiteComunicacoes,
      preCadastro: false,
      precisaComplementacao: false,
      complementadoEm: nowIso(),
      atualizadoEm: nowIso(),
      status: 'pendente'
    };

    await upsert('candidaturas-bf', candidatura.id, atualizado);

    await tokenStore.setJSON(token, {
      ...tokenRegistro,
      usado: true,
      usadoEm: nowIso()
    });

    await sendWhatsAppByEvent({
      eventType: 'general_registration',
      phone: obrigatorios.telefone,
      data: atualizado,
      context: { funcao: 'bf-pre-candidatura-complementar', id: candidatura.id }
    }).catch((notificationError) => {
      console.error('Falha no envio de WhatsApp (bf-complementar):', notificationError);
    });

    return json(200, {
      sucesso: true,
      candidaturaId: candidatura.id
    });
  } catch (err) {
    console.error('Erro ao complementar pré-candidatura BF:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
