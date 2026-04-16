# Mapa Técnico — Barco da Fé / REMO

## Estrutura do Repositório

```
remo-barco-da-fe/
├── index.html                  — Home pública
├── pedido-oracao.html          — Formulário de pedido de oração
├── aluno.html                  — Painel do aluno BF
├── professor.html              — Painel do professor/formador
├── admin.html                  — Painel administrativo
├── candidatura.html            — Inscrição no Barco da Fé
├── relogio.html                — Relógio de Oração
├── intercessor.html            — Cadastro de intercessor
├── status-inscricao.html       — Consulta de status de inscrição
├── aulas-gravadas.html         — Aulas gravadas (acesso aluno)
├── logo-remo.png               — Logo do ministério
├── netlify.toml                — Configuração Netlify (redirects, headers)
├── package.json
├── .env.example                — Variáveis de ambiente necessárias
├── docs/                       — Documentação técnica e de produto
└── netlify/
    └── functions/
        ├── _lib/
        │   ├── admin-auth.js   — abrirStore, json, requireAdmin, validarSessao
        │   └── data-utils.js   — utilitários de dados
        └── *.js                — Funções serverless (40+)
```

---

## Rotas Públicas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `index.html` | Home: cards, destaques, pedidos recentes, testemunhos |
| `/pedir-oracao` | `pedido-oracao.html` | Formulário de pedido de oração |
| `/pedidos` | *(a criar)* | Lista pública de pedidos ativos (com compartilhar=true) |
| `/pedidos/tema/:slug` | *(a criar)* | Pedidos filtrados por tema |
| `/testemunhos` | *(a criar)* | Testemunhos aprovados |
| `/parceiros` | *(a criar)* | Parceiros divulgáveis |
| `/campanhas` | *(a criar)* | Campanhas e doações ativas |
| `/blog` | *(a criar)* | Posts publicados |
| `/agenda` | *(a criar)* | Reuniões e eventos |
| `/barco-da-fe` | *(a criar)* | Landing page do programa |
| `/barco-da-fe/inscricao` | `candidatura.html` | Formulário de inscrição BF |
| `/barco-da-fe/relogio-de-oracao` | `relogio.html` | Relógio de oração 24/7 |
| `/barco-da-fe/reunioes` | *(a criar)* | Reuniões online agendadas |
| `/rede` | *(a criar)* | Apresentação da Rede de Clamor |
| `/rede/intercessor` | `intercessor.html` | Cadastro de intercessor |
| `/rede/grupo` | *(a criar)* | Cadastro de grupo/igreja/ministério |

---

## Rotas Privadas (Painéis)

| Rota | Arquivo | Perfis com Acesso |
|------|---------|-------------------|
| `/painel/login` | *(a criar)* | Todos |
| `/painel/admin` | `admin.html` | ADMIN |
| `/painel/coordenacao` | *(a criar)* | ADMIN, COORDENACAO_GERAL |
| `/painel/intercessor` | `intercessor.html` | INTERCESSOR |
| `/painel/lider` | *(a criar)* | ADMIN, COORDENACAO_GERAL, LIDER_DE_NUCLEO |
| `/painel/formacao` | `aluno.html` / `professor.html` | ALUNO_BARCO_DA_FE, PROFESSOR_FORMADOR |

---

## Módulos (1–13)

| # | Módulo | Funções Netlify Relacionadas |
|---|--------|------------------------------|
| 1 | **Pedidos de Oração** | `salvar-pedido`, `pedidos-publicos-listar`, `pedido-atualizar`, `temas-listar` |
| 2 | **Relógio de Oração** | `salvar-relogio`, `agendamentos-listar`, `agendamentos-salvar`, `agendamentos-atualizar-status` |
| 3 | **Intercessores** | `salvar-intercessor`, `usuarios-listar`, `usuarios-salvar` |
| 4 | **Grupos e Igrejas** | `grupos-salvar`, `grupos-listar` |
| 5 | **Barco da Fé — Inscrição** | `salvar-candidatura`, `candidaturas-buscar`, `candidaturas-atualizar` |
| 6 | **Barco da Fé — Formação** | `aulas-gravadas-listar`, `aulas-gravadas-salvar`, `bf-atividades-listar`, `bf-atividades-salvar`, `bf-matricula-criar`, `bf-certificado-gerar` |
| 7 | **Painel do Aluno** | `aluno-dashboard`, `aluno-aulas-listar`, `aluno-atividades-listar`, `aluno-enviar-atividade`, `aluno-mensagens-listar`, `aluno-enviar-mensagem`, `aluno-certificados-listar`, `aluno-dossie` |
| 8 | **Painel do Professor** | `professor-dashboard`, `professor-alunos-listar`, `professor-atividades-pendentes`, `professor-corrigir-atividade`, `professor-mensagens-listar`, `professor-enviar-mensagem`, `bf-relatorio-professor` |
| 9 | **Reuniões e Agenda** | `reunioes-listar`, `reunioes-salvar` |
| 10 | **Convocações** | `convocacoes-listar`, `convocacoes-salvar` |
| 11 | **Testemunhos** | `testemunhos-salvar`, `testemunhos-listar` |
| 12 | **Parceiros e Campanhas** | `parceiros-salvar`, `parceiros-listar`, `campanhas-listar`, `campanhas-salvar`, `doacoes-salvar` |
| 13 | **Blog e Conteúdo** | `blog-listar`, `blog-salvar`, `home-cards-listar`, `home-cards-salvar`, `home-config-listar`, `home-config-salvar` |

---

## Stores Netlify Blobs

| Store | Conteúdo |
|-------|----------|
| `pedidos-oracao` | Pedidos de oração |
| `temas-oracao` | Temas de oração (fallback hardcoded) |
| `intercessores` | Cadastros de intercessores |
| `relogio-oracao` | Horários do relógio de oração |
| `candidaturas-bf` | Inscrições no Barco da Fé |
| `matriculas-bf` | Matrículas ativas |
| `aulas-gravadas` | Aulas do programa |
| `bf-atividades` | Atividades e entregas |
| `grupos` | Grupos, igrejas e ministérios |
| `reunioes` | Reuniões agendadas |
| `convocacoes` | Convocações de mobilização |
| `testemunhos` | Testemunhos enviados |
| `parceiros` | Parceiros cadastrados |
| `campanhas-doacoes` | Campanhas de doação |
| `doacoes` | Registros de doação |
| `blog-posts` | Posts do blog |
| `home-cards` | Cards da home |
| `admin-sessoes` | Sessões autenticadas |

---

## Integrações

| Integração | Status | Uso Previsto |
|------------|--------|--------------|
| **Netlify Blobs** | ✅ Ativo | Persistência de todos os dados |
| **Netlify Functions** | ✅ Ativo | API serverless |
| **SendGrid** | 🔜 Futuro | E-mails transacionais (boas-vindas, lembretes) |
| **WhatsApp API** | 🔜 Futuro | Convocações e lembretes por WhatsApp |
| **Zoom / Google Meet** | 🔜 Futuro | Links automáticos de reuniões |

---

## Decisão Técnica

**Por que HTML puro + Netlify Functions sem framework?**

- Equipe pequena, sem engenheiros de frontend dedicados.
- Necessidade de páginas leves e rápidas em dispositivos móveis com conexão limitada.
- Manutenção simples: qualquer desenvolvedor pode ler e editar os arquivos.
- Netlify Blobs elimina a necessidade de banco de dados externo para o volume atual.
- A complexidade extra de React/Vue/Angular não se justifica para o escopo do projeto.
- Deploy automático via Git push no Netlify.
