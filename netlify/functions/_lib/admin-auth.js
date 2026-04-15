const crypto = require('crypto');
const { getStore } = require('@netlify/blobs');

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'remo-admin-2025';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'remo@2025';
const SESSION_TTL_MS = Number(process.env.ADMIN_SESSION_TTL_MS || 1000 * 60 * 60 * 4);

function abrirStore(nome) {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_TOKEN;

  if (siteID && token) {
    return getStore({ name: nome, siteID, token });
  }

  return getStore(nome);
}

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      ...extraHeaders
    },
    body: JSON.stringify(body)
  };
}

function extrairToken(event) {
  const headers = event.headers || {};
  const raw = headers['x-admin-token'] || headers['X-Admin-Token'] || headers.authorization || headers.Authorization || '';

  if (!raw) return '';
  if (raw.startsWith('Bearer ')) return raw.slice(7).trim();
  return String(raw).trim();
}

async function criarSessaoAdmin() {
  const token = `session_${crypto.randomBytes(24).toString('hex')}`;
  const agora = Date.now();
  const expiraEm = agora + SESSION_TTL_MS;

  const store = abrirStore('admin-sessoes');
  await store.setJSON(token, {
    token,
    role: 'admin',
    criadoEm: new Date(agora).toISOString(),
    expiraEm: new Date(expiraEm).toISOString()
  });

  return {
    token,
    role: 'admin',
    criadoEm: new Date(agora).toISOString(),
    expiraEm: new Date(expiraEm).toISOString()
  };
}

async function validarSessao(token) {
  if (!token) {
    return { valido: false, motivo: 'Token ausente' };
  }

  if (token === ADMIN_TOKEN) {
    return {
      valido: true,
      role: 'admin',
      origem: 'legacy-token',
      expiraEm: null
    };
  }

  const store = abrirStore('admin-sessoes');
  let sessao;

  try {
    sessao = await store.get(token, { type: 'json' });
  } catch {
    sessao = null;
  }

  if (!sessao) {
    return { valido: false, motivo: 'Sessão não encontrada' };
  }

  if (!sessao.expiraEm || Date.parse(sessao.expiraEm) <= Date.now()) {
    return { valido: false, motivo: 'Sessão expirada' };
  }

  return {
    valido: true,
    role: sessao.role || 'admin',
    origem: 'sessao',
    expiraEm: sessao.expiraEm
  };
}

async function requireAdmin(event) {
  const token = extrairToken(event);
  const validacao = await validarSessao(token);

  if (!validacao.valido || validacao.role !== 'admin') {
    return {
      autorizado: false,
      response: json(401, { erro: 'Não autorizado', motivo: validacao.motivo || 'token inválido' })
    };
  }

  return {
    autorizado: true,
    token,
    sessao: validacao
  };
}

function credenciaisValidas(usuario, senha) {
  return usuario === ADMIN_USER && senha === ADMIN_PASSWORD;
}

module.exports = {
  abrirStore,
  json,
  extrairToken,
  criarSessaoAdmin,
  validarSessao,
  requireAdmin,
  credenciaisValidas
};
