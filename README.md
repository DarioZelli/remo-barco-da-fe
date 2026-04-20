# remo-barco-da-fe

Sistema REMO (Rede Mundial de Orações) com base em páginas HTML estáticas e backend em Netlify Functions.

## Estrutura real atual

- `index.html` — home pública
- `pedido-oracao.html` — formulário público de pedido de oração
- `candidatura.html` — formulário público da Escola Barco da Fé
- `status-inscricao.html` — consulta pública de status da candidatura
- `intercessor.html` — cadastro público de intercessor
- `relogio.html` — cadastro público no relógio de oração
- `aulas-gravadas.html` — vitrine pública de aulas gravadas
- `aluno.html` — área do aluno (estado atual: interface estática/parcial)
- `professor.html` — área do professor (estado atual: interface estática/parcial)
- `admin.html` — painel administrativo
- `netlify/functions/` — backend em Netlify Functions

## Functions existentes

- `auth-login.js` — login do admin com sessão
- `auth-validate.js` — valida sessão/token admin
- `admin-listar.js` — leitura admin de coleções operacionais
- `candidaturas-atualizar.js` — atualização admin de candidatura
- `candidaturas-buscar.js` — consulta pública de candidatura
- `home-config-listar.js` — leitura pública de config da home
- `home-config-salvar.js` — gravação admin de config da home
- `home-cards-listar.js` — leitura pública/admin de cards da home
- `home-cards-salvar.js` — gravação admin de cards da home
- `aulas-gravadas-listar.js` — leitura pública/admin de aulas
- `aulas-gravadas-salvar.js` — gravação admin de aulas
- `salvar-candidatura.js` — criação de candidatura pública
- `salvar-intercessor.js` — criação de intercessor público
- `salvar-pedido.js` — criação de pedido público
- `salvar-relogio.js` — criação de cadastro público no relógio
- `usuarios-listar.js` — leitura admin de alunos/professores

## Deploy

- Plataforma: Netlify
- Branch de produção: `main`
- Publish directory: `.`
- Functions directory: `netlify/functions`

## Observações de arquitetura

- A base operacional atual é `HTML + Netlify Functions`.
- Não existe, neste repositório, base React/Vite funcional integrada.
- Diretórios `src/`, `docs/`, `tests/` e `public/` não existem no estado atual.

## Execução local

Recomendado usar Netlify CLI para simular static + functions:

```bash
npx netlify dev
```

## Variáveis de ambiente (WhatsApp via Z-API)

Para envio automático de WhatsApp nos formulários públicos, configure:

- `ZAPI_BASE_URL` (opcional, padrão: `https://api.z-api.io`)
- `ZAPI_INSTANCE_ID`
- `ZAPI_INSTANCE_TOKEN`
- `ZAPI_CLIENT_TOKEN` (opcional, quando exigido pela instância)
- `ZAPI_DEFAULT_DDI` (opcional, padrão: `55`)
