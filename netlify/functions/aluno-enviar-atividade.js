const { randomUUID } = require('crypto');
const { json } = require('./_lib/admin-auth');
const { getAllFromStore, upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  try {
    const body = JSON.parse(event.body || '{}');
    const email = String(body.email || '').trim().toLowerCase();
    const atividadeId = String(body.atividadeId || '').trim();
    if (!email || !atividadeId) return json(400, { erro: 'email e atividadeId são obrigatórios' });

    const alunos = await getAllFromStore('alunos');
    const aluno = alunos.find((a) => String(a.email || '').toLowerCase() === email);
    if (!aluno) return json(404, { erro: 'Aluno não encontrado' });

    const agora = nowIso();
    const id = String(body.id || `envio_${randomUUID()}`);
    const payload = {
      id,
      atividadeId,
      alunoId: aluno.id,
      respostaTexto: String(body.respostaTexto || ''),
      anexoUrl: String(body.anexoUrl || ''),
      status: 'enviado',
      nota: null,
      feedbackProfessor: '',
      corrigidoPor: null,
      dataEnvio: agora,
      dataCorrecao: null,
      createdAt: agora,
      updatedAt: agora
    };

    await upsert('bf-envios', id, payload);
    return json(200, { ok: true, envio: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
