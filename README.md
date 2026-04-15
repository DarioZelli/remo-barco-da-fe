diff --git a/README.md b/README.md
index 9806cdeaff6dae0d3045300c93f40445fa9a0774..33b9cd8d68358e531d74c578c32133846a8977bd 100644
--- a/README.md
+++ b/README.md
@@ -1,71 +1,22 @@
-diff --git a/README.md b/README.md
-index 33b9cd8d68358e531d74c578c32133846a8977bd..58b7155129db2ea69df9a261d8d5db9d96c91b4f 100644
---- a/README.md
-+++ b/README.md
-@@ -1,22 +1,65 @@
- # remo-barco-da-fe
- 
- Sistema de gestão e formação de intercessores do projeto Barco da Fé — REMO (Rede Mundial de Orações).
- 
- ## Estrutura
- 
- - `index.html` — página inicial
- - `pedido-oracao.html` — formulário público de pedido de oração
- - `candidatura.html` — inscrição na Escola Barco da Fé
- - `intercessor.html` — cadastro de intercessor
- - `relogio.html` — relógio de oração 24 horas
- - `admin.html` — painel administrativo
-+- `aulas-gravadas.html` — vitrine pública das aulas gravadas
- - `logo-remo.png` — logotipo oficial
- - `netlify.toml` — configuração de deploy
- - `package.json` — dependências Node
- - `netlify/functions/` — backend (Netlify Functions + Netlify Blobs)
-+- `netlify/functions/home-config-listar.js` — leitura pública da configuração da home
-+- `netlify/functions/home-config-salvar.js` — atualização da configuração da home (admin)
-+- `netlify/functions/home-cards-listar.js` — leitura pública dos cards da home
-+- `netlify/functions/home-cards-salvar.js` — criação/edição dos cards da home (admin)
-+- `netlify/functions/aulas-gravadas-listar.js` — leitura pública/administrativa das aulas gravadas
-+- `netlify/functions/aulas-gravadas-salvar.js` — criação/edição de aulas gravadas (admin)
- 
- ## Deploy
- 
--Hospedado no Netlify. Branch de produção: `principal`.
-+Hospedado no Netlify. Branch de produção: `main`.
- 
- Atualização 13/04/2026.
-+
-+## Corrigir branch padrão (GitHub)
-+
-+Se aparecer `principalmain` no GitHub, **não crie um repositório novo**.
-+
-+Faça assim:
-+
-+1. GitHub → `Settings` → `Branches` → defina `main` como padrão.
-+2. GitHub → `Code` → seletor de branches → `View all branches`.
-+3. Renomeie `principalmain` para `main` **ou** delete `principalmain` (se `main` já existir com os commits corretos).
-+4. No Netlify: `Site settings` → `Build & deploy` → `Production branch = main`.
-+5. Faça um novo deploy em `Deploys` → `Trigger deploy`.
-+
-+> Dica: criar “repositório de modelos” não resolve esse problema de branch; o correto é ajustar a branch padrão do repositório atual.
-+
-+## Upload manual (GitHub) — caminho correto
-+
-+Se você usar **Add file → Upload files** no GitHub, garanta que os arquivos sejam enviados nos caminhos exatos:
-+
-+- `admin.html` e `index.html` na **raiz** do repositório.
-+- Functions apenas em `netlify/functions/`.
-+
-+### Erros comuns que quebram o deploy
-+
-+1. Criar pastas repetidas tipo:
-+   - `netlify/functions/netlify/functions/...`
-+2. Subir `aulas-gravadas.html` dentro de `netlify/functions/` (o correto é na raiz).
-+3. Colar texto de patch/comando dentro do `admin.html` (quando a página abre e mostra texto enorme no topo).
-+
-+### Verificação rápida local
-+
-+Use este comando para validar se a estrutura está correta antes de subir:
-+
-+```bash
-+bash scripts/verificar-estrutura.sh
-+```
+# remo-barco-da-fe
+
+Sistema de gestão e formação de intercessores do projeto Barco da Fé — REMO (Rede Mundial de Orações).
+
+## Estrutura
+
+- `index.html` — página inicial
+- `pedido-oracao.html` — formulário público de pedido de oração
+- `candidatura.html` — inscrição na Escola Barco da Fé
+- `intercessor.html` — cadastro de intercessor
+- `relogio.html` — relógio de oração 24 horas
+- `admin.html` — painel administrativo
+- `logo-remo.png` — logotipo oficial
+- `netlify.toml` — configuração de deploy
+- `package.json` — dependências Node
+- `netlify/functions/` — backend (Netlify Functions + Netlify Blobs)
+
+## Deploy
+
+Hospedado no Netlify. Branch de produção: `principal`.
+
+Atualização 13/04/2026.
