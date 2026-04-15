const { abrirStore, json, extrairToken, validarSessao } = require('./_lib/admin-auth');

function ordenar(aulas) {
  return aulas.sort((a, b) => {
    const oa = Number(a.ordem) || 0;
    const ob = Number(b.ordem) || 0;
    return oa - ob;
  });
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'GET') {
    return json(405, { erro: 'Method Not Allowed' });
  }

  try {
    const token = extrairToken(event);
    const sessao = await validarSessao(token);
    const incluirOcultos = event.queryStringParameters?.incluirOcultos === 'true';
    const podeVerOcultas = sessao.valido && sessao.role === 'admin';

    const store = abrirStore('aulas-gravadas');
    const { blobs } = await store.list();

    const aulas = [];
    for (const blob of blobs) {
      try {
        const item = await store.get(blob.key, { type: 'json' });
        if (!item) continue;
        aulas.push(item);
      } catch {
        // Ignora registro inválido
      }
    }

    let saida = ordenar(aulas);
    if (!incluirOcultos || !podeVerOcultas) {
      saida = saida.filter((aula) => aula.publicado !== false);
    }

    return json(200, { aulas: saida });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
