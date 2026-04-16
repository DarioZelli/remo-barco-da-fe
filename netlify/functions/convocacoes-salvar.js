const { abrirStore, json, requireAdmin } = require('./_lib/admin-auth');

const CANAIS_VALIDOS = ['WhatsApp', 'Email', 'Ambos'];

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

    if (!dados.titulo || !dados.mensagem) {
      return json(400, { erro: 'Campos obrigatórios ausentes: titulo, mensagem' });
    }

    if (dados.canal && !CANAIS_VALIDOS.includes(dados.canal)) {
      return json(400, { erro: 'Canal inválido. Use: ' + CANAIS_VALIDOS.join(', ') });
    }

    const id = 'convocacao_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

    const registro = {
      id,
      titulo: dados.titulo,
      tipo: dados.tipo || '',
      mensagem: dados.mensagem,
      publicoAlvo: dados.publicoAlvo || 'Todos',
      canal: dados.canal || 'WhatsApp',
      dataDisparo: dados.dataDisparo || new Date().toISOString(),
      status: 'ativo',
      criadoEm: new Date().toISOString()
    };

    const store = abrirStore('convocacoes');
    await store.setJSON(id, registro);

    return json(200, { sucesso: true, id });
  } catch (err) {
    console.error('Erro ao salvar convocação:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
