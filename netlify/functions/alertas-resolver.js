const { json, requireAdmin } = require('./_lib/admin-auth');
const { getById, upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  const auth = await requireAdmin(event);
  if (!auth.autorizado) return auth.response;

  try {
    const body = JSON.parse(event.body || '{}');
    const id = String(body.id || '').trim();
    if (!id) return json(400, { erro: 'Informe id do alerta' });

    const alerta = await getById('bf-alertas', id);
    if (!alerta) return json(404, { erro: 'Alerta não encontrado' });

    const atualizado = {
      ...alerta,
      resolvido: true,
      resolvidoEm: nowIso()
    };

    await upsert('bf-alertas', id, atualizado);
    return json(200, { ok: true, alerta: atualizado });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
