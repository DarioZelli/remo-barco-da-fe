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
    const envios = await getAllFromStore('bf-envios');
    const mensagens = await getAllFromStore('bf-mensagens');

    const vinculados = alunos.filter((a) => a.professorId === professor.id);
    const idsAlunos = new Set(vinculados.map((a) => a.id));

    const pendentes = envios.filter((e) => idsAlunos.has(e.alunoId) && e.status === 'enviado').length;
    const mensagensPendentes = mensagens.filter((m) => idsAlunos.has(m.alunoId) && m.remetenteTipo === 'aluno' && m.lida !== true).length;
    const emRisco = vinculados.filter((a) => a.riscoEvasao).length;

    return json(200, {
      professor: {
        id: professor.id,
        nome: professor.nome,
        email: professor.email,
        especialidade: professor.especialidade || ''
      },
      resumo: {
        alunosAtivos: vinculados.length,
        alunosEmRisco: emRisco,
        atividadesParaCorrigir: pendentes,
        mensagensPendentes
      }
    });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
