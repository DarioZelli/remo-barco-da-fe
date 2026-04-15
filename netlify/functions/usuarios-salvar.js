const { randomUUID } = require('crypto');
const { json, requireAdmin } = require('./_lib/admin-auth');
const { upsert, getById, nowIso, num } = require('./_lib/data-utils');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { erro: 'Method Not Allowed' });

  const auth = await requireAdmin(event);
  if (!auth.autorizado) return auth.response;

  try {
    const body = JSON.parse(event.body || '{}');
    const colecao = body.colecao;

    if (!['professores', 'alunos'].includes(colecao)) {
      return json(400, { erro: 'Coleção inválida' });
    }

    if (!String(body.nome || '').trim() || !String(body.email || '').trim()) {
      return json(400, { erro: 'Nome e e-mail são obrigatórios' });
    }

    const id = String(body.id || `${colecao.slice(0, -1)}_${randomUUID()}`);
    const anterior = await getById(colecao, id);
    const agora = nowIso();

    const base = {
      id,
      nome: String(body.nome || '').trim(),
      email: String(body.email || '').trim().toLowerCase(),
      telefone: String(body.telefone || '').trim(),
      status: String(body.status || 'ativo').trim(),
      updatedAt: agora,
      createdAt: anterior?.createdAt || agora
    };

    const payload = colecao === 'professores'
      ? {
          ...base,
          especialidade: String(body.especialidade || '').trim(),
          limiteAlunos: num(body.limiteAlunos, 0),
          turmas: Array.isArray(body.turmas) ? body.turmas : []
        }
      : {
          ...base,
          professorId: String(body.professorId || '').trim(),
          moduloAtual: String(body.moduloAtual || 'N1 — Fundamentação').trim(),
          progresso: num(body.progresso, 0),
          turma: String(body.turma || '').trim(),
          riscoEvasao: Boolean(body.riscoEvasao),
          ultimoAcesso: body.ultimoAcesso || null
        };

    await upsert(colecao, id, payload);
    return json(200, { ok: true, registro: payload });
  } catch (err) {
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
