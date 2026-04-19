const { json } = require('./_lib/admin-auth');
const { getAllFromStore } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'GET') return json(405, { erro: 'Method Not Allowed' });

  try {
    const email = String(event.queryStringParameters?.email || '').trim().toLowerCase();
    if (!email) return json(400, { erro: 'Informe email' });

    const alunos = await getAllFromStore('alunos');
    let aluno = alunos.find((a) => String(a.email || '').toLowerCase() === email);

    // Fallback: busca na store de candidaturas quando não há registro em 'alunos'
    if (!aluno) {
      const candidaturas = await getAllFromStore('candidaturas-bf');
      const cand = candidaturas.find(
        (c) => String(c.email || '').toLowerCase() === email && c.status === 'aprovado'
      );
      if (cand) {
        aluno = {
          id: cand.id,
          nome: cand.nomeCompleto || cand.nome || '',
          email: cand.email,
          professorId: '',
          moduloAtual: 'N1 — Fundamentação',
          progresso: 0,
          status: 'matriculado',
          riscoEvasao: false
        };
      }
    }

    if (!aluno) return json(404, { erro: 'Aluno não encontrado' });

    const matriculas = await getAllFromStore('bf-matriculas');
    const aulas = await getAllFromStore('aulas-gravadas');
    const envios = await getAllFromStore('bf-envios');
    const mensagens = await getAllFromStore('bf-mensagens');
    const certificados = await getAllFromStore('bf-certificados');

    const matriculaAtiva = matriculas.find((m) => m.alunoId === aluno.id && m.status !== 'concluida') || null;
    const atividadesPendentes = envios.filter((e) => e.alunoId === aluno.id && e.status !== 'corrigido').length;
    const naoLidas = mensagens.filter((m) => m.alunoId === aluno.id && m.remetenteTipo !== 'aluno' && m.lida !== true).length;

    const moduloAtual = aluno.moduloAtual || matriculaAtiva?.moduloId || 'N1 — Fundamentação';
    const aulasModulo = aulas.filter((a) => a.modulo === moduloAtual && a.publicado !== false);

    return json(200, {
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        email: aluno.email,
        professorId: aluno.professorId || matriculaAtiva?.professorId || '',
        moduloAtual,
        progresso: Number(aluno.progresso || 0),
        status: aluno.status || 'ativo',
        riscoEvasao: Boolean(aluno.riscoEvasao)
      },
      resumo: {
        aulasDisponiveis: aulasModulo.length,
        atividadesPendentes,
        mensagensNaoLidas: naoLidas,
        certificadoStatus: certificados.some((c) => c.alunoId === aluno.id && c.status === 'emitido') ? 'emitido' : 'pendente'
      }
    });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
