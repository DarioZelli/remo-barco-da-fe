const { json } = require('./_lib/admin-auth');
const { getAllFromStore } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'GET') return json(405, { erro: 'Method Not Allowed' });

  try {
    const alunoId = String(event.queryStringParameters?.alunoId || '').trim();
    if (!alunoId) return json(400, { erro: 'Informe alunoId' });

    const [alunos, envios, mensagens, diario, matriculas, alertas] = await Promise.all([
      getAllFromStore('alunos'),
      getAllFromStore('bf-envios'),
      getAllFromStore('bf-mensagens'),
      getAllFromStore('bf-diario-oracao'),
      getAllFromStore('bf-matriculas'),
      getAllFromStore('bf-alertas')
    ]);

    const aluno = alunos.find((a) => a.id === alunoId);
    if (!aluno) return json(404, { erro: 'Aluno não encontrado' });

    return json(200, {
      aluno,
      matriculas: matriculas.filter((m) => m.alunoId === alunoId),
      envios: envios.filter((e) => e.alunoId === alunoId),
      mensagens: mensagens.filter((m) => m.alunoId === alunoId),
      diario: diario.filter((d) => d.alunoId === alunoId),
      alertas: alertas.filter((a) => a.alunoId === alunoId)
    });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
