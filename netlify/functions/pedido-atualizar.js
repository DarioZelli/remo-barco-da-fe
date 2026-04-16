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

    if (!dados.id || !dados.status) {
      return json(400, { erro: 'Campos obrigatórios ausentes: id, status' });
    }

    const store = abrirStore('pedidos-oracao');
    const pedido = await store.get(dados.id, { type: 'json' });

    if (!pedido) {
      return json(404, { erro: 'Pedido não encontrado' });
    }

    const atualizado = {
      ...pedido,
      status: dados.status,
      observacao: dados.observacao || pedido.observacao || '',
      ultimaAtualizacao: new Date().toISOString()
    };

    await store.setJSON(dados.id, atualizado);

    return json(200, { sucesso: true });
  } catch (err) {
    console.error('Erro ao atualizar pedido:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
