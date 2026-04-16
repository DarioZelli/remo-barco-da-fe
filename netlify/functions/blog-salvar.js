const { abrirStore, json, requireAdmin } = require('./_lib/admin-auth');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { erro: 'Method Not Allowed' });
  }

  const auth = await requireAdmin(event);
  if (!auth.autorizado) {
    return auth.response;
  }

  try {
    const dados = JSON.parse(event.body || '{}');

    if (!dados.titulo || !dados.slug || !dados.conteudo) {
      return json(400, { erro: 'Campos obrigatórios ausentes: titulo, slug, conteudo' });
    }

    const id = 'post_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

    const registro = {
      id,
      titulo: dados.titulo,
      slug: dados.slug,
      categoria: dados.categoria || '',
      resumo: dados.resumo || '',
      conteudo: dados.conteudo,
      destaque: !!dados.destaque,
      publicado: !!dados.publicado,
      criadoEm: new Date().toISOString()
    };

    const store = abrirStore('blog-posts');
    await store.setJSON(id, registro);

    return json(200, { sucesso: true, id });
  } catch (err) {
    console.error('Erro ao salvar post:', err);
    return json(500, { erro: 'Erro interno', detalhe: err.message });
  }
};
