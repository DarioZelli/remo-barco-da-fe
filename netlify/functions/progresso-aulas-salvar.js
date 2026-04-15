const { json } = require('./_lib/admin-auth');
const { getAllFromStore, upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  try {
    const body = JSON.parse(event.body || '{}');
    const email = String(body.email || '').trim().toLowerCase();
    const progresso = Number(body.progresso || 0);
    if (!email) return json(400, { erro: 'Informe email' });

    const alunos = await getAllFromStore('alunos');
    const aluno = alunos.find((a) => String(a.email || '').toLowerCase() === email);
    if (!aluno) return json(404, { erro: 'Aluno não encontrado' });

    const atualizado = {
      ...aluno,
      progresso: Math.max(0, Math.min(100, progresso)),
      ultimoAcesso: nowIso(),
      updatedAt: nowIso()
    };

    await upsert('alunos', aluno.id, atualizado);
    return json(200, { ok: true, aluno: atualizado });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
