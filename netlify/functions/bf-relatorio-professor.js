const { json } = require('./_lib/admin-auth');
const { getAllFromStore } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'GET') return json(405, { erro: 'Method Not Allowed' });

  try {
    const email = String(event.queryStringParameters?.email || '').trim().toLowerCase();
    if (!email) return json(400, { erro: 'Informe email' });

    const professores = await getAllFromStore('professores');
    const professor = professores.find((p) => String(p.email || '').toLowerCase() === email);
    if (!professor) return json(404, { erro: 'Professor não encontrado' });

    const alunos = await getAllFromStore('alunos');
    const ids = new Set(alunos.filter((a) => a.professorId === professor.id).map((a) => a.id));

    const envios = await getAllFromStore('bf-envios');
    const doProfessor = envios.filter((e) => ids.has(e.alunoId));

    const corrigidos = doProfessor.filter((e) => e.status === 'corrigido' && Number.isFinite(Number(e.nota)));
    const media = corrigidos.length
      ? corrigidos.reduce((sum, e) => sum + Number(e.nota || 0), 0) / corrigidos.length
      : 0;

    return json(200, {
      resumo: {
        alunosAtendidos: ids.size,
        pendentes: doProfessor.filter((e) => e.status === 'enviado').length,
        corrigidos: corrigidos.length,
        mediaNotas: Number(media.toFixed(2))
      }
    });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
