
'use strict';

// ─── Configuração via variáveis de ambiente ───────────────────────────────────
const ZAPI_BASE_URL       = String(process.env.ZAPI_BASE_URL     || 'https://api.z-api.io').replace(/\/+$/, '');
const ZAPI_INSTANCE_ID    = String(process.env.ZAPI_INSTANCE_ID  || '').trim();
const ZAPI_INSTANCE_TOKEN = String(process.env.ZAPI_INSTANCE_TOKEN || '').trim();
const ZAPI_CLIENT_TOKEN   = String(process.env.ZAPI_CLIENT_TOKEN || '').trim();

const MIN_BR_PHONE_LENGTH = 12;   // 55 + DDD(2) + número(8 ou 9)
const ZAPI_TIMEOUT_MS     = 5000; // 5 s — evita travar a Netlify Function

// ─── Utilitários de nome e resumo ────────────────────────────────────────────

/**
 * Extrai o primeiro nome de uma string.
 * Retorna null se o valor for vazio, nulo ou inválido.
 *
 * Exemplos:
 *   "Dário Levi Vitor Zelli" → "Dário"
 *   " Maria Clara "          → "Maria"
 *   ""                       → null
 *   undefined                → null
 */
function extrairPrimeiroNome(nome) {
  if (!nome || typeof nome !== 'string') return null;
  const limpo = nome.trim().replace(/\s+/g, ' ');
  if (!limpo) return null;
  return limpo.split(' ')[0];
}

/**
 * Monta a saudação personalizada.
 * Se o nome for inválido, usa a forma genérica sem nome.
 */
function saudacao(nome) {
  const primeiro = extrairPrimeiroNome(nome);
  return primeiro
    ? `Olá, ${primeiro}. A paz do Senhor!`
    : 'Olá. A paz do Senhor!';
}

/**
 * Verifica se um valor é exibível (não vazio, nulo ou literal inválido).
 */
function valorValido(v) {
  if (v === null || v === undefined) return false;
  const s = String(v).trim();
  return s !== '' && s !== 'null' && s !== 'undefined';
}

/**
 * Converte boolean/string para texto legível "Sim" ou "Não".
 * Retorna undefined se o valor não for reconhecível.
 */
function simNao(valor) {
  if (valor === true  || valor === 'true'  || valor === 'sim'  || valor === '1' || valor === 1)  return 'Sim';
  if (valor === false || valor === 'false' || valor === 'nao'  || valor === 'não' ||
      valor === '0'   || valor === 0)                                                             return 'Não';
  return valorValido(valor) ? String(valor) : undefined;
}

/**
 * Monta o bloco de resumo filtrando campos inválidos.
 *
 * @param {string}                        titulo  - Cabeçalho do bloco
 * @param {Array<{label:string,valor:*}>} campos  - Pares label/valor
 * @returns {string} Bloco formatado ou string vazia se nenhum campo válido
 */
function montarResumo(titulo, campos) {
  const linhas = campos
    .filter(({ valor }) => valorValido(valor))
    .map(({ label, valor }) => `- ${label}: ${String(valor).trim()}`);
  if (!linhas.length) return '';
  return `${titulo}\n${linhas.join('\n')}`;
}

// ─── Templates dinâmicos ─────────────────────────────────────────────────────

const ZAPI_TEMPLATES = {

  // 1. Pedido de oração
  pedido_oracao(d) {
    d = d || {};
    const nome = d.nome || d.nomeSolicitante;
    const descricao = valorValido(d.descricao)
      ? String(d.descricao).trim().slice(0, 300) + (String(d.descricao).trim().length > 300 ? '...' : '')
      : undefined;
    const resumo = montarResumo('Resumo do seu envio:', [
      { label: 'Nome do solicitante',            valor: nome },
      { label: 'Pessoa por quem se pede oração', valor: d.paraQuem },
      { label: 'Tema',                           valor: d.tema },
      { label: 'Causa',                          valor: d.causa },
      { label: 'Descrição',                      valor: descricao },
    ]);
    return [
      saudacao(nome),
      'Recebemos seu pedido de oração com carinho e atenção.',
      resumo,
      'Sua solicitação foi registrada na REMO e será apresentada ao Senhor por nossa equipe de intercessão. Seguiremos em concordância com você, crendo que Deus age no tempo certo e segundo a Sua perfeita vontade.',
      'Mais adiante, você poderá receber uma nova mensagem pedindo uma breve atualização do caso, para que o acompanhamento continue de forma correta.',
      'Deus abençoe você e sua família!',
    ].filter(Boolean).join('\n\n');
  },

  // 2. Acompanhamento futuro do pedido de oração (disparo programado)
  pedido_oracao_atualizacao(d) {
    d = d || {};
    const nome = d.nome || d.nomeSolicitante;
    const resumo = montarResumo('Resumo do pedido acompanhado:', [
      { label: 'Pessoa por quem se pede oração', valor: d.paraQuem },
      { label: 'Tema',                           valor: d.tema },
      { label: 'Causa',                          valor: d.causa },
    ]);
    const linkBloco = valorValido(d.linkAtualizacao)
      ? `Para seguirmos intercedendo de forma mais precisa, pedimos, por favor, uma breve atualização do caso por este link:\n${d.linkAtualizacao}\n\nSe Deus já respondeu, se houve mudança no quadro, ou se deseja encerrar o acompanhamento, nos informe por ali.`
      : 'Para seguirmos intercedendo de forma mais precisa, pedimos, por favor, uma breve atualização do caso. Se Deus já respondeu, se houve mudança no quadro, ou se deseja encerrar o acompanhamento, nos informe.';
    return [
      saudacao(nome),
      'Seu pedido de oração continua em acompanhamento na REMO.',
      resumo,
      linkBloco,
      'Seguimos em oração por você e sua família.',
    ].filter(Boolean).join('\n\n');
  },

  // 3. Cadastro de intercessor
  cadastro_intercessor(d) {
    d = d || {};
    const nome = d.nome || d.nomeCompleto;
    const telefone = d.telefoneCelular || d.telefone;
    const resumo = montarResumo('Resumo da sua inscrição:', [
      { label: 'Nome',       valor: nome },
      { label: 'Cidade',     valor: d.cidade },
      { label: 'Estado',     valor: d.estado },
      { label: 'Igreja',     valor: d.igreja },
      { label: 'Ministério', valor: d.ministerio },
      { label: 'Telefone',   valor: telefone },
    ]);
    return [
      saudacao(nome),
      'Recebemos sua inscrição para servir como intercessor na REMO.',
      resumo,
      'Seu cadastro será analisado com atenção pela coordenação, conforme as informações enviadas. Se necessário, entraremos em contato para os próximos passos.',
      'Obrigado por se colocar à disposição para esta missão de oração.',
      'Deus abençoe sua vida!',
    ].filter(Boolean).join('\n\n');
  },

  // 4. Inscrição geral / Escola Barco da Fé (candidatura e complementar)
  inscricao_geral(d) {
    d = d || {};
    const nome = d.nome || d.nomeCompleto;
    const cursoOuModulo = d.curso || d.modulo || d.etapa || d.turma;
    const resumo = montarResumo('Resumo da sua inscrição:', [
      { label: 'Nome',                   valor: nome },
      { label: 'Curso, módulo ou etapa', valor: cursoOuModulo },
      { label: 'Cidade',                 valor: d.cidade },
      { label: 'Estado',                 valor: d.estado },
      { label: 'Telefone',               valor: d.telefone },
      { label: 'E-mail',                 valor: d.email },
    ]);
    return [
      saudacao(nome),
      'Recebemos sua inscrição na Escola Barco da Fé com alegria.',
      resumo,
      'Sua candidatura foi registrada e será analisada pela equipe responsável. Em breve, você poderá ser contatado sobre os próximos passos da sua caminhada de formação na REMO.',
      'Que o Senhor confirme Seu propósito sobre sua vida e conduza cada passo.',
      'Deus abençoe você!',
    ].filter(Boolean).join('\n\n');
  },

  // 5. Relógio de oração
  relogio_oracao(d) {
    d = d || {};
    const nome = d.nome || d.nomeCompleto;
    const duracaoCompromisso = d.duracaoCompromisso || d.duracao || d.periodo;
    const tempoOracao        = d.tempoOracao || d.tempo;
    const resumo = montarResumo('Resumo do seu compromisso:', [
      { label: 'Horário escolhido',      valor: d.horario },
      { label: 'Tempo de oração',        valor: tempoOracao },
      { label: 'Duração do compromisso', valor: duracaoCompromisso },
      { label: 'Exibição do nome',       valor: simNao(d.exibirNome) },
    ]);
    return [
      saudacao(nome),
      'Recebemos seu compromisso no Relógio de Oração da REMO com gratidão.',
      resumo,
      'Seu horário de intercessão foi registrado com sucesso, e sua participação fortalece a cobertura contínua de oração da rede.',
      'Que o Senhor sustente sua vida, renove suas forças e honre sua dedicação.',
      'Deus abençoe você!',
    ].filter(Boolean).join('\n\n');
  },

  // 6. Cadastro de grupo / núcleo / frente de oração
  cadastro_grupo(d) {
    d = d || {};
    const nomeGrupo       = d.nome || d.nomeGrupo;
    const nomeResponsavel = d.responsavel || d.nomeResponsavel;
    const resumo = montarResumo('Resumo do cadastro:', [
      { label: 'Nome do grupo, núcleo ou igreja', valor: nomeGrupo },
      { label: 'Tipo',                            valor: d.tipo },
      { label: 'Responsável',                     valor: nomeResponsavel },
      { label: 'Cidade',                          valor: d.cidade },
      { label: 'Estado',                          valor: d.estado },
      { label: 'Telefone',                        valor: d.telefone },
    ]);
    return [
      saudacao(nomeResponsavel || nomeGrupo),
      'Recebemos o cadastro enviado por você na REMO.',
      resumo,
      'As informações foram registradas com sucesso e serão analisadas pela coordenação para o encaminhamento adequado dentro da rede.',
      'Obrigado por desejar caminhar conosco em unidade, oração e propósito.',
      'Deus abençoe você e todos os envolvidos!',
    ].filter(Boolean).join('\n\n');
  },

  // 7. Cadastro de parceiro / apoiador
  cadastro_parceiro(d) {
    d = d || {};
    const nome = d.nome || d.nomeCompleto;
    const tipoParceria = d.tipoParceria || d.tipo;
    const resumo = montarResumo('Resumo do cadastro:', [
      { label: 'Nome',             valor: nome },
      { label: 'Tipo de parceria', valor: tipoParceria },
      { label: 'Cidade',           valor: d.cidade },
      { label: 'Estado',           valor: d.estado },
      { label: 'Telefone',         valor: d.telefone },
      { label: 'E-mail',           valor: d.email },
    ]);
    return [
      saudacao(nome),
      'Recebemos seu cadastro de parceria na REMO.',
      resumo,
      'As informações enviadas foram registradas e serão analisadas com atenção. Havendo alinhamento, entraremos em contato para os próximos passos.',
      'Obrigado por desejar somar conosco em oração e serviço.',
      'Deus abençoe você!',
    ].filter(Boolean).join('\n\n');
  },
};

// Compatibilidade retroativa: ZAPI_MESSAGE_TEMPLATES como versão estática (sem dados)
const ZAPI_MESSAGE_TEMPLATES = Object.freeze(
  Object.fromEntries(
    Object.entries(ZAPI_TEMPLATES).map(([k, fn]) => [k, fn({})])
  )
);

// ─── Mapeamento chaves inglês → português ────────────────────────────────────
const CHAVE_EN_PARA_PT = {
  general_registration:     'inscricao_geral',
  intercessor_registration: 'cadastro_intercessor',
  prayer_request:           'pedido_oracao',
  prayer_clock:             'relogio_oracao',
  group_registration:       'cadastro_grupo',
  partner_registration:     'cadastro_parceiro',
  school_registration:      'inscricao_geral',
  prayer_follow_up:         'pedido_oracao_atualizacao',
};

// ─── Helpers internos ─────────────────────────────────────────────────────────
function zapiConfigurada() {
  return Boolean(ZAPI_INSTANCE_ID && ZAPI_INSTANCE_TOKEN);
}

function resolverTipoEvento(tipoEvento) {
  return CHAVE_EN_PARA_PT[tipoEvento] || tipoEvento;
}

function normalizarTelefone(telefone) {
  const apenasDigitos = String(telefone || '').replace(/\D/g, '');
  if (!apenasDigitos) return '';

  const semPrefixo00 = apenasDigitos.startsWith('00')
    ? apenasDigitos.slice(2)
    : apenasDigitos;

  if (semPrefixo00.startsWith('55')) {
    return semPrefixo00.length >= MIN_BR_PHONE_LENGTH ? semPrefixo00 : '';
  }

  let numeroNacional = semPrefixo00;
  if (numeroNacional.startsWith('0')) {
    numeroNacional = numeroNacional.slice(1);
    if (numeroNacional.length >= 12) {
      numeroNacional = numeroNacional.slice(2);
    }
  }

  if (numeroNacional.length !== 10 && numeroNacional.length !== 11) {
    return '';
  }

  return `55${numeroNacional}`;
}

function parsearRespostaTolerant(rawBody, status) {
  try {
    return JSON.parse(rawBody);
  } catch (e) {
    console.warn('[whatsapp-zapi] Resposta sem JSON válido:', { status });
    return {};
  }
}

async function enviarViaZAPI({ telefone, mensagem }) {
  const url = `${ZAPI_BASE_URL}/instances/${encodeURIComponent(ZAPI_INSTANCE_ID)}/token/${encodeURIComponent(ZAPI_INSTANCE_TOKEN)}/send-text`;

  const headers = { 'Content-Type': 'application/json' };
  if (ZAPI_CLIENT_TOKEN) headers['Client-Token'] = ZAPI_CLIENT_TOKEN;

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), ZAPI_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phone: telefone, message: mensagem }),
      signal: controller.signal,
    });
  } catch (err) {
    throw new Error(err?.name === 'AbortError'
      ? `Z-API: timeout após ${ZAPI_TIMEOUT_MS}ms`
      : `Z-API: erro de rede — ${err?.message || String(err)}`
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const rawBody = await response.text();
  if (!response.ok) {
    throw new Error(`Z-API: HTTP ${response.status}`);
  }
  return rawBody ? parsearRespostaTolerant(rawBody, response.status) : {};
}

// ─── Núcleo do envio (nunca lança exceção) ────────────────────────────────────
async function _enviarSeguro({ telefone, tipoEvento, dados, contexto }) {
  const chave    = resolverTipoEvento(tipoEvento);
  const template = ZAPI_TEMPLATES[chave];

  if (!template) {
    console.warn(`[whatsapp-zapi][${contexto}] Template ausente para evento: ${tipoEvento}`);
    return { ok: false, skipped: true, reason: 'template_ausente' };
  }

  const mensagem = template(dados || {});

  const tel = normalizarTelefone(telefone);
  if (!tel) {
    console.warn(`[whatsapp-zapi][${contexto}] Telefone inválido ou ausente.`);
    return { ok: false, skipped: true, reason: 'telefone_invalido' };
  }

  if (!zapiConfigurada()) {
    console.warn(`[whatsapp-zapi][${contexto}] ZAPI_INSTANCE_ID / ZAPI_INSTANCE_TOKEN não configurados.`);
    return { ok: false, skipped: true, reason: 'zapi_nao_configurada' };
  }

  try {
    await enviarViaZAPI({ telefone: tel, mensagem });
    return { ok: true };
  } catch (err) {
    console.warn(`[whatsapp-zapi][${contexto}] Falha no envio:`, { tipoEvento: chave, detalhe: err?.message });
    return { ok: false, error: err?.message || String(err) };
  }
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Assinatura em português (usada pelos handlers):
 *   enviarNotificacaoWhatsApp({ telefone, tipoEvento, dados, contexto })
 *
 * O parâmetro `dados` é o objeto completo do formulário (registro).
 * É opcional: se omitido, a mensagem é enviada sem resumo personalizado.
 */
async function enviarNotificacaoWhatsApp({ telefone, tipoEvento, dados, contexto = 'desconhecido' }) {
  return _enviarSeguro({ telefone, tipoEvento, dados, contexto });
}

/**
 * Assinatura em inglês (compatibilidade com versão anterior):
 *   sendWhatsAppByEvent({ phone, eventType, data, context })
 */
async function sendWhatsAppByEvent({ phone, eventType, data, context = 'desconhecido' }) {
  return _enviarSeguro({ telefone: phone, tipoEvento: eventType, dados: data, contexto: context });
}

module.exports = {
  ZAPI_MESSAGE_TEMPLATES,
  ZAPI_TEMPLATES,
  extrairPrimeiroNome,
  enviarNotificacaoWhatsApp,
  sendWhatsAppByEvent,
};
