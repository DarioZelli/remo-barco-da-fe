const { randomUUID } = require('crypto');
const { json } = require('./_lib/admin-auth');
const { getAllFromStore, upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  try {
    const body = JSON.parse(event.body || '{}');
    const email = String(body.email || '').trim().toLowerCase();
    const mensagem = String(body.mensagem || '').trim();

    if (!email || !mensagem) {
      return json(400, { erro: 'email e mensagem são obrigatórios' });
    }

    const alunos = await getAllFromStore('alunos');
    const aluno = alunos.find((a) => String(a.email || '').toLowerCase() === email);
    if (!aluno) return json(404, { erro: 'Aluno não encontrado' });

    const id = `msg_${randomUUID()}`;
    const payload = {
      id,
      alunoId: aluno.id,
      professorId: String(body.professorId || aluno.professorId || ''),
      moduloId: String(body.moduloId || aluno.moduloAtual || ''),
      assunto: String(body.assunto || 'Mensagem do aluno'),
      categoria: String(body.categoria || 'geral'),
      mensagem,
      remetenteTipo: 'aluno',
      lida: false,
      statusConversa: 'aberta',
      createdAt: nowIso()
    };

    await upsert('bf-mensagens', id, payload);
    return json(200, { ok: true, mensagem: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
