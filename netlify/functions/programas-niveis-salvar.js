const { abrirStore, json, requireAdmin } = require('./_lib/admin-auth');
const { cloneProgramasPadrao } = require('./_lib/programas-niveis-defaults');

function encontrarPadrao(nivel) {
  return cloneProgramasPadrao().find((item) => item.nivel === nivel);
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  const auth = await requireAdmin(event);
  if (!auth.autorizado) return auth.response;

  try {
    const body = JSON.parse(event.body || '{}');
    const nivel = String(body.nivel || '').trim().toUpperCase();
    if (!nivel) return json(400, { erro: 'Nível é obrigatório' });

    const store = abrirStore('programas-niveis');
    const anterior = await store.get(nivel, { type: 'json' }).catch(() => null);
    const padrao = encontrarPadrao(nivel) || { id: nivel, nivel, titulo: nivel, icone: '📘', ordem: 99 };
    const agora = new Date().toISOString();

    const payload = {
      ...padrao,
      ...anterior,
      id: nivel,
      nivel,
      titulo: String(body.titulo || padrao.titulo || nivel).trim(),
      icone: String(body.icone || padrao.icone || '📘').trim(),
      subtitulo: String(body.subtitulo || ''),
      resumo: String(body.resumo || ''),
      objetivos: Array.isArray(body.objetivos) ? body.objetivos.map((v) => String(v).trim()).filter(Boolean) : (anterior?.objetivos || padrao.objetivos || []),
      conteudos: Array.isArray(body.conteudos) ? body.conteudos.map((v) => String(v).trim()).filter(Boolean) : (anterior?.conteudos || padrao.conteudos || []),
      publico: String(body.publico || ''),
      ordem: Number(body.ordem) || padrao.ordem || 99,
      ativo: body.ativo !== false,
      atualizadoEm: agora,
      criadoEm: anterior?.criadoEm || agora
    };

    await store.setJSON(nivel, payload);
    return json(200, { ok: true, programa: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
