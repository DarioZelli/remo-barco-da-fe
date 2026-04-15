const { json, requireAdmin } = require('./_lib/admin-auth');
const { getAllFromStore, upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  const auth = await requireAdmin(event);
  if (!auth.autorizado) return auth.response;

  try {
    const alunos = await getAllFromStore('alunos');
    const envios = await getAllFromStore('bf-envios');

    const gerados = [];
    for (const aluno of alunos) {
      const diasSemAcesso = aluno.ultimoAcesso ? Math.floor((Date.now() - Date.parse(aluno.ultimoAcesso)) / 86400000) : 999;
      if (diasSemAcesso >= 14) {
        const id = `alerta_${aluno.id}_sem_acesso`;
        const alerta = {
          id,
          alunoId: aluno.id,
          tipo: 'sem_acesso',
          nivel: diasSemAcesso >= 30 ? 'alto' : 'medio',
          descricao: `Aluno sem acesso há ${diasSemAcesso} dias`,
          resolvido: false,
          dataGeracao: nowIso()
        };
        await upsert('bf-alertas', id, alerta);
        gerados.push(alerta);
      }

      const pendencias = envios.filter((e) => e.alunoId === aluno.id && e.status === 'enviado').length;
      if (pendencias >= 3) {
        const id = `alerta_${aluno.id}_pendencias`;
        const alerta = {
          id,
          alunoId: aluno.id,
          tipo: 'pendencias',
          nivel: 'medio',
          descricao: `Aluno com ${pendencias} atividades pendentes de correção`,
          resolvido: false,
          dataGeracao: nowIso()
        };
        await upsert('bf-alertas', id, alerta);
        gerados.push(alerta);
      }
    }

    return json(200, { ok: true, gerados: gerados.length });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
