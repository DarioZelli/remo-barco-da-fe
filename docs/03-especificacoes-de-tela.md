# Especificações de Tela — Barco da Fé / REMO

## Tela 01 — Home

**Objetivo:** Apresentar o ministério, oferecer acesso rápido ao pedido de oração e mostrar o que está acontecendo na rede.

**Blocos:**
- Hero: logo REMO, frase chamada, botão "Fazer Pedido de Oração"
- Cards de acesso rápido: Rede de Clamor, Barco da Fé, Relógio de Oração
- Pedidos recentes públicos (compartilharPublicamente=true)
- Testemunhos aprovados em carrossel
- Parceiros da rede
- Rodapé com links e contato

**Ações:** Navegar para pedido de oração, inscrição BF, intercessor, parceiro.

---

## Tela 02 — Pedido de Oração

**Objetivo:** Permitir que qualquer pessoa envie um pedido de oração.

**Campos:**
- `nomeSolicitante` (obrigatório)
- `telefone` (obrigatório)
- `paraQuem` (opcional: para si ou para outro)
- `tema` (select: lista de temas)
- `causa` (texto curto — palavra-chave)
- `descricao` (textarea — detalhes do pedido)
- `compartilhar` (checkbox — autoriza exibição pública)
- `oracaoContinua` (checkbox — pede oração contínua)
- `campanhaColetiva` (checkbox — deseja campanha coletiva)

**Ações:** Enviar pedido → confirmação com id de acompanhamento.

---

## Tela 03 — Pedidos Ativos

**Objetivo:** Exibir publicamente os pedidos que autorizam compartilhamento.

**Blocos:**
- Filtro por tema (tabs ou select)
- Cards de pedidos (nome, tema, causa, data — sem telefone/email)
- Paginação (12 por página)

**Ações:** Filtrar por tema, navegar páginas.

---

## Tela 04 — Pedidos por Tema

**Objetivo:** Exibir pedidos filtrados por um tema específico (URL: /pedidos/tema/:slug).

**Blocos:**
- Cabeçalho com nome e ícone do tema
- Cards de pedidos do tema
- Link voltar para todos os temas

---

## Tela 05 — Barco da Fé Landing

**Objetivo:** Apresentar o programa de formação e converter visitantes em candidatos.

**Blocos:**
- Hero: o que é o Barco da Fé
- Os 3 pilares do programa
- Grade de módulos do curso
- Depoimentos de ex-alunos
- CTA: botão de inscrição
- Perguntas frequentes

**Ações:** Navegar para formulário de inscrição.

---

## Tela 06 — Inscrição Barco da Fé

**Objetivo:** Capturar a candidatura ao programa Barco da Fé.

**Campos:**
- `nomeCompleto` (obrigatório)
- `email` (obrigatório)
- `telefone` (obrigatório)
- `cidade`, `estado`
- `igreja`, `pastor`
- `motivacao` (textarea — por que quer participar)
- `disponibilidade` (checkboxes de dias/horários)
- `comoSoube` (select — como ficou sabendo)

**Ações:** Enviar inscrição → confirmação por tela/e-mail.

---

## Tela 07 — Rede de Clamor

**Objetivo:** Apresentar a rede e convidar grupos e intercessores a se cadastrarem.

**Blocos:**
- O que é a Rede de Clamor
- Mapa/lista de grupos cadastrados e aprovados
- Estatísticas: intercessores ativos, grupos, pedidos atendidos
- CTAs: "Sou Intercessor" / "Represento uma Igreja/Grupo"

---

## Tela 08 — Cadastro Intercessor

**Objetivo:** Registrar novo intercessor na rede.

**Campos:**
- `nomeCompleto` (obrigatório)
- `email` (obrigatório)
- `telefone` (obrigatório)
- `cidade`, `estado`
- `igreja`
- `disponibilidade` (dias e horários disponíveis)
- `areasDeOracao` (temas de interesse)
- `experiencia` (texto livre)

**Ações:** Enviar cadastro → pendente de aprovação.

---

## Tela 09 — Cadastro Grupo/Igreja/Ministério

**Objetivo:** Registrar grupo, igreja local ou ministério parceiro na rede.

**Campos:**
- `tipo` (Grupo Doméstico, Igreja Local, Ministério Parceiro, Núcleo Regional)
- `nomeGrupo` (obrigatório)
- `responsavel` (obrigatório)
- `telefone` (obrigatório)
- `email` (obrigatório)
- `cidade`, `estado` (obrigatório)
- `quantidadeAproximada`
- `formato` (Presencial/Online/Híbrido)
- `diasDisponiveis`
- `autorizaDivulgacao` (checkbox)

**Ações:** Enviar cadastro → pendente de aprovação.

---

## Tela 10 — Relógio de Oração

**Objetivo:** Exibir os horários de oração e permitir que intercessores assumam compromissos.

**Blocos:**
- Grade de 24 horas × 7 dias
- Indicação de horários cobertos e disponíveis
- Formulário para assumir horário (nome, email, horário, compromisso)
- Estatísticas de cobertura

**Ações:** Assumir horário de oração.

---

## Tela 11 — Agenda / Reuniões

**Objetivo:** Exibir reuniões online e eventos futuros.

**Blocos:**
- Lista de reuniões agendadas (não canceladas)
- Card por reunião: título, tipo, data/hora, link de acesso, pauta resumida
- Filtro por tipo

**Ações:** Acessar link de reunião, ver pauta.

---

## Tela 12 — Convocações

**Objetivo:** Exibir convocações ativas para oração extraordinária.

**Blocos:**
- Lista de convocações ativas
- Card: título, mensagem, canal, data de disparo
- CTA por convocação (entrar no grupo WhatsApp, confirmar participação)

---

## Tela 13 — Blog

**Objetivo:** Publicar conteúdo sobre oração, intercessão, missões e avivamento.

**Blocos:**
- Lista de posts publicados (paginação de 9)
- Filtro por categoria
- Card: imagem de capa, título, resumo, data, categoria
- Post destaque no topo

**Ações:** Acessar post, filtrar categoria, navegar páginas.

---

## Tela 14 — Testemunhos

**Objetivo:** Exibir testemunhos aprovados de pedidos de oração respondidos.

**Blocos:**
- Grid de testemunhos aprovados
- Card: nome, cidade, texto, data
- Filtro por tema (opcional)
- Botão: enviar meu testemunho (formulário inline)

**Ações:** Enviar testemunho, filtrar por tema.

---

## Tela 15 — Parceiros

**Objetivo:** Exibir organizações parceiras e convidar novas.

**Blocos:**
- Grid de parceiros com divulgarPublicamente=true
- Card: nome, tipo, cidade
- CTA: "Quero ser parceiro" → formulário

**Ações:** Acessar formulário de parceria.

---

## Tela 16 — Campanhas e Doações

**Objetivo:** Apresentar campanhas ativas e registrar promessas de doação.

**Blocos:**
- Lista de campanhas ativas
- Card: título, descrição, meta, progresso
- Formulário de doação por campanha: nome, valor prometido, comprovante

**Ações:** Registrar doação, ver progresso da campanha.

---

## Tela 17 — Painel Admin

**Objetivo:** Gestão completa da plataforma.

**Blocos:**
- Dashboard: totais de pedidos, candidaturas, grupos, intercessores
- Tabelas com filtros e ações: pedidos, candidaturas, intercessores, grupos, usuários
- Gestão de aulas, atividades, turmas
- Gestão de blog, testemunhos, parceiros, campanhas
- Configurações da home

**Ações:** Aprovar/rejeitar registros, criar/editar conteúdo, gerar relatórios, gerenciar sessões.

---

## Tela 18 — Painel Coordenação

**Objetivo:** Visão operacional da rede para coordenadores gerais.

**Blocos:**
- Dashboard: próximas reuniões, convocações ativas, grupos pendentes, candidaturas BF pendentes
- Lista de grupos e intercessores com filtros
- Ferramentas de convocação e agendamento de reuniões

**Ações:** Aprovar grupos, agendar reuniões, criar convocações.

---

## Tela 19 — Painel Líder

**Objetivo:** Gestão do núcleo regional pelo líder local.

**Blocos:**
- Intercessores do seu grupo
- Pedidos de oração do grupo
- Reuniões do núcleo
- Mensagens

**Ações:** Ver intercessores, registrar atas, comunicar com o grupo.

---

## Tela 20 — Painel Intercessor

**Objetivo:** Espaço pessoal do intercessor.

**Blocos:**
- Meu compromisso no relógio de oração
- Pedidos em oração (assumidos)
- Diário de oração
- Avisos e convocações
- Mensagens

**Ações:** Registrar entrada no diário, ver pedidos, confirmar compromisso.

---

## Tela 21 — Painel Aluno BF

**Objetivo:** Acompanhamento do progresso no programa Barco da Fé.

**Blocos:**
- Progresso geral (módulos concluídos, atividades entregues)
- Lista de aulas (com marcação de assistida)
- Atividades pendentes e entregues
- Mensagens com o professor
- Certificado (quando disponível)

**Ações:** Marcar aula como assistida, entregar atividade, enviar mensagem ao professor, baixar certificado.
