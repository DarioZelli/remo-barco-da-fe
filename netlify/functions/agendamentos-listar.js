const { json } = require('./_lib/admin-auth');
const { getAllFromStore } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'GET') return json(405, { erro: 'Method Not Allowed' });

  try {
    const professorEmail = String(event.queryStringParameters?.professorEmail || '').trim().toLowerCase();
    const alunoEmail = String(event.queryStringParameters?.alunoEmail || '').trim().toLowerCase();

    const [agendamentos, professores, alunos] = await Promise.all([
      getAllFromStore('bf-agendamentos'),
      getAllFromStore('professores'),
      getAllFromStore('alunos')
    ]);

    let filtroProfessorId = '';
    let filtroAlunoId = '';

    if (professorEmail) {
      const professor = professores.find((p) => String(p.email || '').toLowerCase() === professorEmail);
      if (!professor) return json(404, { erro: 'Professor não encontrado' });
      filtroProfessorId = professor.id;
    }

    if (alunoEmail) {
      const aluno = alunos.find((a) => String(a.email || '').toLowerCase() === alunoEmail);
      if (!aluno) return json(404, { erro: 'Aluno não encontrado' });
      filtroAlunoId = aluno.id;
    }

    const lista = agendamentos
      .filter((a) => {
        if (filtroProfessorId && a.professorId !== filtroProfessorId) return false;
        if (filtroAlunoId && a.alunoId !== filtroAlunoId) return false;
        return true;
      })
      .map((a) => {
        const aluno = alunos.find((x) => x.id === a.alunoId);
        const professor = professores.find((x) => x.id === a.professorId);
        return {
          ...a,
          alunoNome: aluno?.nome || '—',
          professorNome: professor?.nome || '—'
        };
      })
      .sort((x, y) => Date.parse(x.dataHora || 0) - Date.parse(y.dataHora || 0));

    return json(200, { agendamentos: lista });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
