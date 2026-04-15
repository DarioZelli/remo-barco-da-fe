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
    const idsAlunos = new Set(alunos.filter((a) => a.professorId === professor.id).map((a) => a.id));

    const envios = await getAllFromStore('bf-envios');
    const atividades = await getAllFromStore('bf-atividades');

    const pendentes = envios
      .filter((e) => idsAlunos.has(e.alunoId) && e.status === 'enviado')
      .map((e) => ({
        ...e,
        atividade: atividades.find((a) => a.id === e.atividadeId) || null
      }));

    return json(200, { pendentes });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
