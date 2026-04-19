const { abrirStore, json, requireAdmin } = require('./_lib/admin-auth');

function statusPorDecisao(decisao) {
  switch (decisao) {
    case 'aprovar_direto':
      return 'ativo';
    case 'encaminhar_escola_barco_da_fe':
      return 'encaminhado_barco_da_fe';
    case 'reprovar':
      return 'reprovado';
    default:
      return 'pendente_triagem';
  }
}

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
    const body = JSON.parse(event.body || '{}');
    const id = String(body.id || '').trim();
    const decisaoCoordenador = String(body.decisaoCoordenador || '').trim();

    if (!id) {
      return json(400, { erro: 'ID do intercessor é obrigatório' });
    }

    const store = abrirStore('intercessores');
    const registro = await store.get(id, { type: 'json' });

    if (!registro) {
      return json(404, { erro: 'Intercessor não encontrado' });
    }

    const atualizado = {
      ...registro,
      decisaoCoordenador,
      observacoesCoordenador: String(body.observacoesCoordenador || ''),
      status: statusPorDecisao(decisaoCoordenador),
      triagem: {
        ...(registro.triagem || {}),
        analisado: !!decisaoCoordenador,
        analisadoEm: decisaoCoordenador ? new Date().toISOString() : '',
        analisadoPor: 'admin'
      },
      atualizadoEm: new Date().toISOString()
    };

    await store.setJSON(id, atualizado);

    return json(200, { sucesso: true, registro: atualizado });
  } catch (err) {
    console.error('Erro ao atualizar intercessor:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
