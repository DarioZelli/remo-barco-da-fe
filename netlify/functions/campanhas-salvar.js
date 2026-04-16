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

    if (!dados.titulo || !dados.descricao) {
      return json(400, { erro: 'Campos obrigatórios ausentes: titulo, descricao' });
    }

    const id = 'campanha_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

    const registro = {
      id,
      titulo: dados.titulo,
      descricao: dados.descricao,
      local: dados.local || '',
      data: dados.data || '',
      metaValor: dados.metaValor || null,
      totalArrecadado: 0,
      status: dados.status || 'ativo',
      criadoEm: new Date().toISOString()
    };

    const store = abrirStore('campanhas-doacoes');
    await store.setJSON(id, registro);

    return json(200, { sucesso: true, id });
  } catch (err) {
    console.error('Erro ao salvar campanha:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
