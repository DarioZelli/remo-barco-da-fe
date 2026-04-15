const { json } = require('./_lib/admin-auth');
const { getById, upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  try {
    const body = JSON.parse(event.body || '{}');
    const id = String(body.id || '').trim();
    const status = String(body.status || '').trim();

    if (!id || !status) return json(400, { erro: 'id e status são obrigatórios' });

    const atual = await getById('bf-agendamentos', id);
    if (!atual) return json(404, { erro: 'Agendamento não encontrado' });

    const permitido = ['solicitado', 'agendado', 'confirmado', 'cancelado', 'concluido'];
    if (!permitido.includes(status)) {
      return json(400, { erro: 'Status inválido' });
    }

    const atualizado = {
      ...atual,
      status,
      observacoes: String(body.observacoes ?? atual.observacoes ?? ''),
      updatedAt: nowIso()
    };

    await upsert('bf-agendamentos', id, atualizado);
    return json(200, { ok: true, agendamento: atualizado });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
