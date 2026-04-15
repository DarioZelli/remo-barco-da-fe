const { randomUUID } = require('crypto');
const { json } = require('./_lib/admin-auth');
const { getAllFromStore, upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  try {
    const body = JSON.parse(event.body || '{}');
    const email = String(body.email || '').trim().toLowerCase();
    if (!email) return json(400, { erro: 'Informe email' });

    const alunos = await getAllFromStore('alunos');
    const aluno = alunos.find((a) => String(a.email || '').toLowerCase() === email);
    if (!aluno) return json(404, { erro: 'Aluno não encontrado' });

    const id = `diario_${randomUUID()}`;
    const payload = {
      id,
      alunoId: aluno.id,
      moduloId: String(body.moduloId || aluno.moduloAtual || ''),
      dataRegistro: body.dataRegistro || nowIso(),
      temaSemana: String(body.temaSemana || ''),
      praticaRealizada: String(body.praticaRealizada || ''),
      reflexao: String(body.reflexao || ''),
      testemunho: String(body.testemunho || ''),
      pedidoOrientacao: String(body.pedidoOrientacao || ''),
      visibilidade: String(body.visibilidade || 'professor'),
      createdAt: nowIso()
    };

    await upsert('bf-diario-oracao', id, payload);
    return json(200, { ok: true, registro: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
