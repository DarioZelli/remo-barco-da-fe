const { abrirStore, json, extrairToken, validarSessao } = require('./_lib/admin-auth');

function ordenar(cards) {
  return cards.sort((a, b) => {
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
    const incluirInativos = event.queryStringParameters?.incluirInativos === 'true';
    const podeVerInativos = sessao.valido && sessao.role === 'admin';

    const store = abrirStore('home-cards');
    const { blobs } = await store.list();

    const cards = [];
    for (const blob of blobs) {
      try {
        const item = await store.get(blob.key, { type: 'json' });
        if (!item) continue;
        cards.push(item);
      } catch {
        // Ignora registro inválido
      }
    }

    let saida = ordenar(cards);
    if (!incluirInativos || !podeVerInativos) {
      saida = saida.filter((card) => card.ativo !== false);
    }

    return json(200, { cards: saida });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
