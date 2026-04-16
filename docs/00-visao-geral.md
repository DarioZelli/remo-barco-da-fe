# Visão Geral — Barco da Fé (REMO)

## Sobre o Projeto

**Barco da Fé** é a plataforma digital do ministério **REMO** (Rede de Mobilização e Oração), com o propósito de conectar intercessores, mobilizar igrejas e estruturar uma rede de oração contínua ao redor de causas específicas — nações, famílias, saúde, missões e avivamento.

O nome "Barco da Fé" evoca a missão: navegar contra a corrente, em fé, intercedendo pelo Brasil e pelas nações.

---

## Os 3 Pilares

### 1. Formação
Capacitar intercessores por meio de ensino estruturado. O **Barco da Fé** é o programa de formação principal: um curso com módulos, aulas gravadas, atividades, acompanhamento de professores e emissão de certificados.

### 2. Mobilização
Convocar, organizar e enviar intercessores para oração. Inclui o Relógio de Oração (cobertura 24/7), convocações extraordinárias, campanhas coletivas e reuniões online de clamor.

### 3. Rede
Conectar grupos domésticos, igrejas locais, ministérios parceiros e núcleos regionais em uma rede colaborativa de oração. Inclui cadastro de parceiros, grupos e intercessores individuais.

---

## Os 10 Públicos

| # | Público | Papel na Plataforma |
|---|---------|---------------------|
| 1 | **Visitante** | Acessa home, faz pedido de oração, vê testemunhos e parceiros |
| 2 | **Solicitante de Oração** | Envia pedidos, acompanha status |
| 3 | **Intercessor** | Cadastra-se, acessa painel, assume horários no relógio |
| 4 | **Candidato BF** | Se inscreve no Barco da Fé |
| 5 | **Aluno BF** | Assiste aulas, envia atividades, recebe certificado |
| 6 | **Professor/Formador** | Publica aulas, corrige atividades, envia mensagens |
| 7 | **Líder de Núcleo** | Gerencia grupo local, aprova intercessores |
| 8 | **Coordenador Geral** | Supervisiona rede, aprova grupos, gerencia reuniões |
| 9 | **Parceiro (Igreja/Ministério)** | Cadastra-se como parceiro da rede |
| 10 | **Admin** | Acesso total à plataforma |

---

## Arquitetura

```
HTML Puro (sem framework)
  ├── index.html          — Home
  ├── pedido-oracao.html  — Formulário de pedido
  ├── aluno.html          — Painel do aluno BF
  ├── professor.html      — Painel do professor
  ├── admin.html          — Painel administrativo
  ├── candidatura.html    — Inscrição Barco da Fé
  ├── relogio.html        — Relógio de Oração
  ├── intercessor.html    — Cadastro de intercessor
  └── status-inscricao.html

Netlify Functions (Node.js serverless)
  └── netlify/functions/
        ├── _lib/admin-auth.js   — autenticação, abrirStore, json helper
        ├── salvar-pedido.js
        ├── salvar-intercessor.js
        ├── salvar-candidatura.js
        ├── ... (40+ funções)

Netlify Blobs (storage key-value)
  └── Stores: pedidos-oracao, intercessores, candidaturas-bf,
             relogio-oracao, aulas-gravadas, blog-posts,
             testemunhos, parceiros, grupos, reunioes,
             convocacoes, campanhas-doacoes, doacoes, temas-oracao
```

**Stack:** HTML + CSS + JavaScript vanilla, Netlify Hosting, Netlify Functions (Node.js), Netlify Blobs (persistência), sem banco de dados externo.

**Design System:** Fontes Cinzel (títulos) + Lato (corpo). Paleta: `--vinho:#2C0F0F`, `--ouro:#C9952A`, `--creme:#F5ECD7` e variantes.
