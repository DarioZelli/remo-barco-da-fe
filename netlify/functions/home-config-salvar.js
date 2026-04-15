const { abrirStore, json, requireAdmin } = require('./_lib/admin-auth');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { erro: 'Method Not Allowed' });
  }

  const auth = await requireAdmin(event);
  if (!auth.autorizado) {
    return auth.response;
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const payload = {
      tituloPrincipal: String(body.tituloPrincipal || ''),
      subtitulo: String(body.subtitulo || ''),
      videoPrincipal: String(body.videoPrincipal || ''),
      imagemPrincipal: String(body.imagemPrincipal || ''),
      botaoPrincipal: String(body.botaoPrincipal || ''),
      linkBotao: String(body.linkBotao || ''),
      mostrarVideo: Boolean(body.mostrarVideo),
      atualizadoEm: new Date().toISOString()
    };

    const store = abrirStore('home-config');
    await store.setJSON('atual', payload);

    return json(200, { ok: true, config: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
