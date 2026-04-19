const { abrirStore, json, extrairToken, validarSessao } = require('./_lib/admin-auth');
const { cloneProgramasPadrao } = require('./_lib/programas-niveis-defaults');

function ordenar(lista) {
  return [...lista].sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0));
}

async function carregarStore() {
  const store = abrirStore('programas-niveis');
  const { blobs } = await store.list();
  const itens = [];
  for (const blob of blobs) {
    try {
      const item = await store.get(blob.key, { type: 'json' });
      if (item) itens.push(item);
    } catch {
      // ignora
    }
  }
  return itens;
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'GET') return json(405, { erro: 'Method Not Allowed' });

  try {
    const token = extrairToken(event);
    const sessao = await validarSessao(token);
    const incluirInativos = event.queryStringParameters?.incluirInativos === 'true';
    const podeVerInativos = sessao.valido && sessao.role === 'admin';

    let programas = await carregarStore();
    if (!programas.length) {
      programas = cloneProgramasPadrao();
    }

    let saida = ordenar(programas);
    if (!incluirInativos || !podeVerInativos) {
      saida = saida.filter((item) => item.ativo !== false);
    }

    return json(200, { programas: saida });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
