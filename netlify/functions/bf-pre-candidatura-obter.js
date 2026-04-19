const { abrirStore, json } = require('./_lib/admin-auth');
const { getById } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'GET') return json(405, { erro: 'Method Not Allowed' });

  try {
    const token = String(event.queryStringParameters?.token || '').trim();
    if (!token) return json(400, { erro: 'Token ausente' });

    const tokenStore = abrirStore('bf-pre-candidatura-tokens');
    const tokenRegistro = await tokenStore.get(token, { type: 'json' });
    if (!tokenRegistro?.candidaturaId) return json(404, { erro: 'Pré-candidatura não encontrada' });

    const candidatura = await getById('candidaturas-bf', tokenRegistro.candidaturaId);
    if (!candidatura) return json(404, { erro: 'Pré-candidatura não encontrada' });

    return json(200, {
      sucesso: true,
      candidatura: {
        id: candidatura.id,
        nomeCompleto: candidatura.nomeCompleto || '',
        dataNascimento: candidatura.dataNascimento || '',
        email: candidatura.email || '',
        telefone: candidatura.telefone || '',
        cidade: candidatura.cidade || '',
        estado: candidatura.estado || '',
        pais: candidatura.pais || 'Brasil',
        moduloDesejado: candidatura.moduloDesejado || 'N1 — Fundamentação',
        igrejaMinisterio: candidatura.igrejaMinisterio || '',
        experienciaOracao: candidatura.experienciaOracao || '',
        disponibilidade: candidatura.disponibilidade || '',
        motivacao: candidatura.motivacao || '',
        preCadastro: candidatura.preCadastro === true,
        precisaComplementacao: candidatura.precisaComplementacao === true,
        origem: candidatura.origem || ''
      }
    });
  } catch (err) {
    console.error('Erro ao obter pré-candidatura BF:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
