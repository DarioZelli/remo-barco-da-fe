const { getStore } = require('@netlify/blobs');

function abrirStore(nome) {
  const siteID = process.env.BLOBS_SITE_ID;
  const token  = process.env.BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name: nome, siteID, token });
  }
  return getStore(nome);
}

async function listarColecao(nome) {
  const store = abrirStore(nome);
  const { blobs } = await store.list();
  const registros = await Promise.all(
    blobs.map(async b => {
      try { return await store.get(b.key, { type: 'json' }); }
      catch { return null; }
    })
  );
  return registros.filter(Boolean);
}

exports.handler = async function(event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ erro: 'Method Not Allowed' }) };
  }

  try {
    const agora = new Date();

    // Meta de oração publicada e vigente
    const todasMetas = await listarColecao('metas-oracao');
    const metaAtiva = todasMetas
      .filter(m => m.publicado && new Date(m.dataFim) >= agora)
      .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio))[0] || null;

    // Próximas reuniões (agendadas, data futura)
    const todasReunioes = await listarColecao('reunioes');
    const reunioesFuturas = todasReunioes
      .filter(r => r.status === 'agendada' && new Date(r.dataHora) >= agora)
      .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
      .slice(0, 5);

    // Convocações ativas
    const todasConvocacoes = await listarColecao('convocacoes');
    const convocacoesAtivas = todasConvocacoes
      .filter(c => c.status === 'enviada')
      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))
      .slice(0, 3);

    // Grupos ativos (resumo)
    const grupos = await listarColecao('grupos-oracao');
    const gruposAtivos = grupos.filter(g => g.status === 'ativo');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        metaAtiva,
        reunioesFuturas,
        convocacoesAtivas,
        totalGrupos: gruposAtivos.length
      })
    };
  } catch (err) {
    console.error('Erro em rede-listar:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ erro: 'Erro interno', detalhe: err.message }) };
  }
};
