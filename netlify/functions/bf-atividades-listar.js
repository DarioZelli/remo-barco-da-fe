const { json, requireAdmin, extrairToken, validarSessao } = require('./_lib/admin-auth');
const { getAllFromStore } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'GET') return json(405, { erro: 'Method Not Allowed' });

  try {
    const incluirOcultas = event.queryStringParameters?.incluirOcultas === 'true';
    const token = extrairToken(event);
    const sessao = await validarSessao(token);
    const admin = sessao.valido && sessao.role === 'admin';

    if (incluirOcultas && !admin) {
      const auth = await requireAdmin(event);
      if (!auth.autorizado) return auth.response;
    }

    const atividades = await getAllFromStore('bf-atividades');
    const lista = atividades
      .filter((a) => incluirOcultas ? true : a.publicada !== false)
      .sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0));

    return json(200, { atividades: lista });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
