const { abrirStore, json, requireAdmin } = require('./_lib/admin-auth');

const TIPOS_VALIDOS = ['Encontro Online', 'Retiro', 'Culto de Clamor', 'Reunião de Líderes', 'Outro'];

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

    if (!dados.titulo || !dados.tipo || !dados.dataHora) {
      return json(400, { erro: 'Campos obrigatórios ausentes: titulo, tipo, dataHora' });
    }

    if (!TIPOS_VALIDOS.includes(dados.tipo)) {
      return json(400, { erro: 'Tipo inválido. Use: ' + TIPOS_VALIDOS.join(', ') });
    }

    const id = 'reuniao_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

    const registro = {
      id,
      titulo: dados.titulo,
      tipo: dados.tipo,
      dataHora: dados.dataHora,
      linkVideo: dados.linkVideo || '',
      pauta: dados.pauta || '',
      publicoAlvo: dados.publicoAlvo || 'Todos',
      status: 'agendado',
      criadoEm: new Date().toISOString()
    };

    const store = abrirStore('reunioes');
    await store.setJSON(id, registro);

    return json(200, { sucesso: true, id });
  } catch (err) {
    console.error('Erro ao salvar reunião:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
