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
    const dados = JSON.parse(event.body || '{}');
    const id = dados.id;
    if (!id) {
      return json(400, { erro: 'ID da candidatura é obrigatório' });
    }

    const store = abrirStore('candidaturas-bf');
    let registroExistente;
    try {
      registroExistente = await store.get(id, { type: 'json' });
    } catch (err) {
      console.error('Candidatura não encontrada:', err);
      return json(404, { erro: 'Candidatura não encontrada' });
    }

    const atualizacao = {
      ...registroExistente,
      ...dados,
      atualizadoEm: new Date().toISOString()
    };

    const notas = [
      Number(atualizacao.notaTeorica) || 0,
      Number(atualizacao.notaPratica) || 0,
      Number(atualizacao.notaCompromisso) || 0
    ];
    if (notas.some(n => n > 0)) {
      atualizacao.notaFinal = Number((notas.reduce((sum, n) => sum + n, 0) / notas.length).toFixed(2));
    }

    await store.setJSON(id, atualizacao);

    return json(200, { sucesso: true, registro: atualizacao });
  } catch (err) {
    console.error('Erro ao atualizar candidatura:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
