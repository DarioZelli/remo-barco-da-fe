const { randomUUID } = require('crypto');
const { json, requireAdmin } = require('./_lib/admin-auth');
const { upsert, nowIso, num } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  const auth = await requireAdmin(event);
  if (!auth.autorizado) return auth.response;

  try {
    const body = JSON.parse(event.body || '{}');

    if (!body.alunoId || !body.moduloId || !body.professorId) {
      return json(400, { erro: 'alunoId, moduloId e professorId são obrigatórios' });
    }

    const id = String(body.id || `matricula_${randomUUID()}`);
    const agora = nowIso();

    const payload = {
      id,
      alunoId: String(body.alunoId),
      moduloId: String(body.moduloId),
      professorId: String(body.professorId),
      status: String(body.status || 'ativa'),
      dataInicio: body.dataInicio || agora,
      dataConclusao: body.dataConclusao || null,
      notaTeorica: num(body.notaTeorica, 0),
      notaPratica: num(body.notaPratica, 0),
      notaCompromisso: num(body.notaCompromisso, 0),
      notaFinal: num(body.notaFinal, 0),
      parecerFinal: String(body.parecerFinal || ''),
      certificadoEmitido: Boolean(body.certificadoEmitido),
      createdAt: agora,
      updatedAt: agora
    };

    await upsert('bf-matriculas', id, payload);
    return json(200, { ok: true, matricula: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
