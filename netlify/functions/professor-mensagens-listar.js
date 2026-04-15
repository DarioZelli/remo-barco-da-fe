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

    const mensagens = await getAllFromStore('bf-mensagens');
    const conversa = mensagens
      .filter((m) => m.professorId === professor.id)
      .sort((a, b) => Date.parse(a.createdAt || 0) - Date.parse(b.createdAt || 0));

    return json(200, { mensagens: conversa });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
