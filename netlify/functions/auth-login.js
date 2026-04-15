const { json, credenciaisValidas, criarSessaoAdmin } = require('./_lib/admin-auth');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { erro: 'Method Not Allowed' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const usuario = String(body.usuario || '').trim();
    const senha = String(body.senha || '');

    if (!usuario || !senha) {
      return json(400, { erro: 'Usuário e senha são obrigatórios' });
    }

    if (!credenciaisValidas(usuario, senha)) {
      return json(401, { erro: 'Credenciais inválidas' });
    }

    const sessao = await criarSessaoAdmin();
    return json(200, {
      ok: true,
      token: sessao.token,
      role: sessao.role,
      expiraEm: sessao.expiraEm
    });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
