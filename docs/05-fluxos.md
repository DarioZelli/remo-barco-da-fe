# Fluxos — Barco da Fé / REMO

## Fluxo 1 — Pedido de Oração

**Ator:** Qualquer visitante (não requer login)

**Passos:**

1. Visitante acessa `/pedir-oracao`.
2. Preenche o formulário: nome, telefone, tema, causa, descrição.
3. Escolhe opções: compartilhar publicamente, oração contínua, campanha coletiva.
4. Envia o formulário → `POST /api/salvar-pedido`.
5. Sistema gera id único (`pedido_timestamp_random`), salva no store `pedidos-oracao` com `status: 'ativo'`.
6. Tela exibe confirmação com o id de acompanhamento.
7. Se `compartilhar: true`, pedido aparece na listagem pública (`/pedidos`).
8. Admin ou coordenador visualiza pedidos no painel, ora e atualiza status via `POST /api/pedido-atualizar`.
9. Quando status muda para `respondido`, intercessor pode registrar testemunho relacionado.

**Privacidade:** telefone e email nunca aparecem na listagem pública.

---

## Fluxo 2 — Entrada de Intercessor

**Ator:** Pessoa interessada em se cadastrar na rede de oração

**Passos:**

1. Acessa `/rede/intercessor`.
2. Preenche formulário: nome, email, telefone, cidade, disponibilidade, áreas de interesse.
3. Envia → `POST /api/salvar-intercessor`.
4. Sistema salva no store `intercessores` com `status: 'pendente'`.
5. Admin recebe indicação de novo cadastro no painel.
6. Admin revisa e aprova/rejeita via painel.
7. Ao aprovar: `status` atualizado para `'aprovado'`, `aprovado: true`.
8. Intercessor aprovado pode assumir horário no Relógio de Oração.
9. Intercessor recebe acesso ao painel do intercessor (futuro: e-mail de boas-vindas).
10. No painel, intercessor vê pedidos em oração, seu compromisso no relógio e diário de oração.

---

## Fluxo 3 — Entrada de Grupo/Igreja/Ministério

**Ator:** Líder de grupo, pastor ou representante de ministério

**Passos:**

1. Acessa `/rede/grupo`.
2. Preenche formulário: tipo, nome do grupo, responsável, contato, cidade, formato, disponibilidade.
3. Marca se autoriza divulgação pública.
4. Envia → `POST /api/grupos-salvar`.
5. Sistema salva no store `grupos` com `status: 'pendente'`.
6. Coordenador geral recebe notificação de novo grupo no painel de coordenação.
7. Coordenador revisa e aprova/rejeita.
8. Ao aprovar: grupo aparece no mapa/lista da Rede de Clamor (se `autorizaDivulgacao: true`).
9. Líder do grupo pode ser convidado a acessar o painel de líder para gerenciar seu núcleo.

---

## Fluxo 4 — Barco da Fé (Inscrição → Formação → Certificado)

**Ator:** Candidato e depois Aluno

**Passos:**

1. Candidato acessa `/barco-da-fe/inscricao`.
2. Preenche formulário de inscrição: nome, contato, motivação, disponibilidade.
3. Envia → `POST /api/salvar-candidatura`.
4. Sistema salva no store `candidaturas-bf` com `status: 'pendente'`.
5. Admin analisa candidatura no painel, aprova e cria matrícula via `POST /api/bf-matricula-criar`.
6. Matrícula salva no store `matriculas-bf` com turma e professor atribuídos.
7. Aluno acessa painel do aluno (`/painel/formacao`), vê as aulas disponíveis.
8. Aluno assiste aulas (marcadas como concluídas), entrega atividades via `POST /api/aluno-enviar-atividade`.
9. Professor corrige atividades via painel do professor, envia feedback.
10. Ao completar todos os módulos e atividades aprovadas: certificado gerado via `POST /api/bf-certificado-gerar`.
11. Aluno baixa certificado no painel.

---

## Fluxo 5 — Reunião Online

**Ator:** Admin (cria), Intercessores/Alunos (participam)

**Passos:**

1. Admin acessa painel, aba "Reuniões".
2. Preenche formulário: título, tipo, data/hora, link de vídeo, pauta, público-alvo.
3. Salva → `POST /api/reunioes-salvar`.
4. Sistema cria registro no store `reunioes` com `status: 'agendado'`.
5. Admin cria convocação relacionada → `POST /api/convocacoes-salvar`.
6. Convocação aparece em `/barco-da-fe/reunioes` e na tela de Convocações.
7. Participantes acessam a página, veem a pauta e o link.
8. Na data da reunião, acessam o link do vídeo diretamente.
9. Após a reunião, admin atualiza status para `'realizado'`.
10. Pauta e registro ficam acessíveis para consulta posterior.

---

## Fluxo 6 — WhatsApp de Mobilização

**Ator:** Admin (dispara), Intercessores (recebem)

**Passos:**

1. Admin identifica necessidade urgente (crise nacional, pedido especial, convocação de jejum).
2. Acessa painel, aba "Convocações", cria nova convocação: título, mensagem, público-alvo, canal (WhatsApp/Email/Ambos), data de disparo.
3. Salva → `POST /api/convocacoes-salvar`.
4. Sistema registra convocação com `status: 'ativo'`.
5. *(Futuro)* Integração com WhatsApp API dispara mensagem no horário programado para todos os intercessores do público-alvo.
6. Convocação aparece no portal em `/convocacoes` para acesso manual.
7. Intercessores respondem/confirmam participação (futuro).
8. Admin acompanha engajamento no painel de coordenação.
9. Ao encerrar o período, admin atualiza status para `'encerrado'`.
