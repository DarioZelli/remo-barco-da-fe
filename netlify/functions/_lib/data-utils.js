const { abrirStore } = require('./admin-auth');

async function getAllFromStore(storeName) {
  const store = abrirStore(storeName);
  const { blobs } = await store.list();
  const itens = [];

  for (const blob of blobs) {
    try {
      const item = await store.get(blob.key, { type: 'json' });
      if (item) itens.push(item);
    } catch {
      // Ignora item inválido.
    }
  }

  return itens;
}

async function upsert(storeName, id, payload) {
  const store = abrirStore(storeName);
  await store.setJSON(id, payload);
  return payload;
}

async function getById(storeName, id) {
  if (!id) return null;
  const store = abrirStore(storeName);
  try {
    return await store.get(id, { type: 'json' });
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

module.exports = {
  getAllFromStore,
  upsert,
  getById,
  nowIso,
  num
};
