const { json } = require('./_lib/admin-auth');
const { getAllFromStore, upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  try {
    const body = JSON.parse(event.body || '{}');
    const email = String(body.email || '').trim().toLowerCase();
    const envioId = String(body.envioId || '').trim();
    if (!email || !envioId) return json(400, { erro: 'email e envioId são obrigatórios' });

    const professores = await getAllFromStore('professores');
    const professor = professores.find((p) => String(p.email || '').toLowerCase() === email);
    if (!professor) return json(404, { erro: 'Professor não encontrado' });

    const envios = await getAllFromStore('bf-envios');
    const envio = envios.find((e) => e.id === envioId);
    if (!envio) return json(404, { erro: 'Envio não encontrado' });

    const atualizado = {
      ...envio,
      status: 'corrigido',
      nota: Number(body.nota || 0),
      feedbackProfessor: String(body.feedbackProfessor || ''),
      corrigidoPor: professor.id,
      dataCorrecao: nowIso(),
      updatedAt: nowIso()
    };

    await upsert('bf-envios', envioId, atualizado);
    return json(200, { ok: true, envio: atualizado });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
