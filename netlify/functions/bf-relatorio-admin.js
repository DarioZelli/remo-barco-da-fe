const { json, requireAdmin } = require('./_lib/admin-auth');
const { getAllFromStore } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'GET') return json(405, { erro: 'Method Not Allowed' });

  const auth = await requireAdmin(event);
  if (!auth.autorizado) return auth.response;

  try {
    const [alunos, professores, matriculas, envios, certificados, alertas] = await Promise.all([
      getAllFromStore('alunos'),
      getAllFromStore('professores'),
      getAllFromStore('bf-matriculas'),
      getAllFromStore('bf-envios'),
      getAllFromStore('bf-certificados'),
      getAllFromStore('bf-alertas')
    ]);

    return json(200, {
      resumo: {
        alunos: alunos.length,
        professores: professores.length,
        matriculasAtivas: matriculas.filter((m) => m.status === 'ativa').length,
        correcoesPendentes: envios.filter((e) => e.status === 'enviado').length,
        certificadosEmitidos: certificados.filter((c) => c.status === 'emitido').length,
        alertasAbertos: alertas.filter((a) => !a.resolvido).length
      }
    });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
