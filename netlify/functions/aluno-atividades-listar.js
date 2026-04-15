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

    const atividades = await getAllFromStore('bf-atividades');
    const envios = await getAllFromStore('bf-envios');
    const doAluno = envios.filter((e) => e.alunoId === aluno.id);

    const resposta = atividades
      .filter((a) => a.publicada !== false)
      .map((a) => {
        const envio = doAluno.find((e) => e.atividadeId === a.id);
        return {
          ...a,
          envio: envio || null
        };
      });

    return json(200, { atividades: resposta });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
