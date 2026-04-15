const { randomUUID } = require('crypto');
const { json } = require('./_lib/admin-auth');
const { getAllFromStore, upsert, nowIso } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  try {
    const body = JSON.parse(event.body || '{}');
    const email = String(body.email || '').trim().toLowerCase();
    const mensagem = String(body.mensagem || '').trim();
    const alunoId = String(body.alunoId || '').trim();

    if (!email || !mensagem || !alunoId) {
      return json(400, { erro: 'email, alunoId e mensagem são obrigatórios' });
    }

    const professores = await getAllFromStore('professores');
    const professor = professores.find((p) => String(p.email || '').toLowerCase() === email);
    if (!professor) return json(404, { erro: 'Professor não encontrado' });

    const id = `msg_${randomUUID()}`;
    const payload = {
      id,
      alunoId,
      professorId: professor.id,
      moduloId: String(body.moduloId || ''),
      assunto: String(body.assunto || 'Resposta do professor'),
      categoria: String(body.categoria || 'feedback'),
      mensagem,
      remetenteTipo: 'professor',
      lida: false,
      statusConversa: 'aberta',
      createdAt: nowIso()
    };

    await upsert('bf-mensagens', id, payload);
    return json(200, { ok: true, mensagem: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
