const { abrirStore, json, requireAdmin } = require('./_lib/admin-auth');

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

  try {
    const agora = new Date();

    // Próximas 5 reuniões agendadas
    const storeReunioes = abrirStore('reunioes');
    const { blobs: blobsReunioes } = await storeReunioes.list();
    const todasReunioes = [];
    for (const blob of blobsReunioes) {
      try {
        const item = await storeReunioes.get(blob.key, { type: 'json' });
        if (!item) continue;
        if (item.status === 'cancelado') continue;
        if (new Date(item.dataHora) >= agora) todasReunioes.push(item);
      } catch {
        // Ignora registro inválido
      }
    }
    todasReunioes.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
    const proximasReunioes = todasReunioes.slice(0, 5);

    // Top 5 convocações ativas
    const storeConvocacoes = abrirStore('convocacoes');
    const { blobs: blobsConvocacoes } = await storeConvocacoes.list();
    const todasConvocacoes = [];
    for (const blob of blobsConvocacoes) {
      try {
        const item = await storeConvocacoes.get(blob.key, { type: 'json' });
        if (!item) continue;
        if (item.status === 'ativo') todasConvocacoes.push(item);
      } catch {
        // Ignora registro inválido
      }
    }
    todasConvocacoes.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
    const convocacoesAtivas = todasConvocacoes.slice(0, 5);

    // Grupos pendentes (count)
    const storeGrupos = abrirStore('grupos');
    const { blobs: blobsGrupos } = await storeGrupos.list();
    let gruposPendentes = 0;
    for (const blob of blobsGrupos) {
      try {
        const item = await storeGrupos.get(blob.key, { type: 'json' });
        if (item && item.status === 'pendente') gruposPendentes++;
      } catch {
        // Ignora registro inválido
      }
    }

    // Candidaturas BF pendentes (count)
    const storeCandidaturas = abrirStore('candidaturas-bf');
    const { blobs: blobsCandidaturas } = await storeCandidaturas.list();
    let candidaturasPendentes = 0;
    for (const blob of blobsCandidaturas) {
      try {
        const item = await storeCandidaturas.get(blob.key, { type: 'json' });
        if (item && item.status === 'pendente') candidaturasPendentes++;
      } catch {
        // Ignora registro inválido
      }
    }

    return json(200, {
      dashboard: {
        proximasReunioes,
        convocacoesAtivas,
        gruposPendentes,
        candidaturasPendentes
      }
    });
  } catch (err) {
    console.error('Erro no dashboard de coordenação:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
