const { json } = require('./_lib/admin-auth');
const { getAllFromStore } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'GET') return json(405, { erro: 'Method Not Allowed' });

  try {
    const email = String(event.queryStringParameters?.email || '').trim().toLowerCase();
    if (!email) return json(400, { erro: 'Informe email' });

    const alunos = await getAllFromStore('alunos');
    const aluno = alunos.find((a) => String(a.email || '').toLowerCase() === email);
    if (!aluno) return json(404, { erro: 'Aluno não encontrado' });

    const aulas = await getAllFromStore('aulas-gravadas');
    const moduloAtual = aluno.moduloAtual || 'N1 — Fundamentação';

    const lista = aulas
      .filter((a) => a.publicado !== false && (!a.modulo || a.modulo === moduloAtual))
      .sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0));

    return json(200, { moduloAtual, aulas: lista });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
