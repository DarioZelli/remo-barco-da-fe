const { json, requireAdmin } = require('./_lib/admin-auth');
const { getAllFromStore } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'GET') return json(405, { erro: 'Method Not Allowed' });

  const auth = await requireAdmin(event);
  if (!auth.autorizado) return auth.response;

  try {
    const alertas = await getAllFromStore('bf-alertas');
    alertas.sort((a, b) => Date.parse(b.dataGeracao || 0) - Date.parse(a.dataGeracao || 0));
    return json(200, { alertas });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
