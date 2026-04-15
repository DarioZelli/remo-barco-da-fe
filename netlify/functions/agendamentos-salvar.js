const { randomUUID } = require('crypto');
const { json } = require('./_lib/admin-auth');
const { getAllFromStore, getById, upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  try {
    const body = JSON.parse(event.body || '{}');

    const professorEmail = String(body.professorEmail || '').trim().toLowerCase();
    const alunoEmail = String(body.alunoEmail || '').trim().toLowerCase();
    const alunoIdParam = String(body.alunoId || '').trim();
    const dataHora = String(body.dataHora || '').trim();

    if (!dataHora) {
      return json(400, { erro: 'dataHora é obrigatória' });
    }

    const professores = await getAllFromStore('professores');
    const alunos = await getAllFromStore('alunos');

    let professor = null;
    if (professorEmail) {
      professor = professores.find((p) => String(p.email || '').toLowerCase() === professorEmail) || null;
      if (!professor) return json(404, { erro: 'Professor não encontrado' });
    }

    let aluno = null;
    if (alunoEmail) {
      aluno = alunos.find((a) => String(a.email || '').toLowerCase() === alunoEmail) || null;
    }
    if (!aluno && alunoIdParam) {
      aluno = alunos.find((a) => a.id === alunoIdParam) || null;
    }
    if (!aluno) return json(404, { erro: 'Aluno não encontrado' });

    if (professor && aluno.professorId && aluno.professorId !== professor.id) {
      return json(403, { erro: 'Aluno não vinculado ao professor informado' });
    }

    const id = String(body.id || `agendamento_${randomUUID()}`);
    const existente = body.id ? await getById('bf-agendamentos', id) : null;
    const agora = nowIso();

    const payload = {
      id,
      professorId: professor?.id || aluno.professorId || String(body.professorId || ''),
      alunoId: aluno.id,
      assunto: String(body.assunto || 'Conversa online').trim(),
      dataHora,
      linkSala: String(body.linkSala || '').trim(),
      observacoes: String(body.observacoes || '').trim(),
      status: String(body.status || (professor ? 'agendado' : 'solicitado')).trim(),
      criadoPor: professor ? 'professor' : 'aluno',
      createdAt: existente?.createdAt || agora,
      updatedAt: agora
    };

    if (!payload.professorId) {
      return json(400, { erro: 'Professor não definido para este agendamento' });
    }

    await upsert('bf-agendamentos', id, payload);
    return json(200, { ok: true, agendamento: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
