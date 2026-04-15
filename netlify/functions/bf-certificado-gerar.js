const { randomUUID } = require('crypto');
const { json, requireAdmin } = require('./_lib/admin-auth');
const { upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  const auth = await requireAdmin(event);
  if (!auth.autorizado) return auth.response;

  try {
    const body = JSON.parse(event.body || '{}');
    if (!body.alunoId || !body.moduloId) {
      return json(400, { erro: 'alunoId e moduloId são obrigatórios' });
    }

    const id = `cert_${randomUUID()}`;
    const codigo = `BF-${Date.now().toString(36).toUpperCase()}`;
    const payload = {
      id,
      alunoId: String(body.alunoId),
      moduloId: String(body.moduloId),
      codigo,
      dataEmissao: nowIso(),
      urlDocumento: String(body.urlDocumento || ''),
      status: String(body.status || 'emitido')
    };

    await upsert('bf-certificados', id, payload);
    return json(200, { ok: true, certificado: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
