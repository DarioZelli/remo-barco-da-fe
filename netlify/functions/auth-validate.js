const { json, requireAdmin } = require('./_lib/admin-auth');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'GET') {
    return json(405, { erro: 'Method Not Allowed' });
  }

  const auth = await requireAdmin(event);
  if (!auth.autorizado) {
    return auth.response;
  }

  return json(200, {
    ok: true,
    role: auth.sessao.role,
    origem: auth.sessao.origem,
    expiraEm: auth.sessao.expiraEm || null
  });
};
