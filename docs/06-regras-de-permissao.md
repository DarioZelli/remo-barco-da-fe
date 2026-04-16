# Regras de Permissão — Barco da Fé / REMO

## Perfis de Acesso

| Perfil | Identificador | Descrição |
|--------|---------------|-----------|
| Administrador | `ADMIN` | Acesso total à plataforma |
| Coordenação Geral | `COORDENACAO_GERAL` | Supervisão da rede e mobilização |
| Líder de Núcleo | `LIDER_DE_NUCLEO` | Gestão do seu grupo/núcleo regional |
| Intercessor | `INTERCESSOR` | Participação na rede de oração |
| Aluno Barco da Fé | `ALUNO_BARCO_DA_FE` | Acesso ao programa de formação |
| Professor/Formador | `PROFESSOR_FORMADOR` | Ensino e acompanhamento de alunos |

---

## `ADMIN`

**Acesso total — sem restrições.**

### Pode LER:
- Todos os registros de todas as coleções, incluindo campos privados (telefone, email, etc.)
- Sessões ativas e logs
- Relatórios completos

### Pode ESCREVER:
- Criar, editar e excluir registros em qualquer coleção
- Aprovar/rejeitar candidaturas, intercessores, grupos, parceiros, testemunhos
- Criar e publicar aulas, atividades, blog posts
- Criar reuniões e convocações
- Emitir certificados
- Gerenciar usuários e perfis
- Alterar configurações da home e do sistema

---

## `COORDENACAO_GERAL`

**Supervisão operacional da rede.**

### Pode LER:
- `grupos` — todos os registros (incluindo pendentes)
- `intercessores` — todos os registros
- `reunioes` — todos os registros
- `convocacoes` — todos os registros
- `pedidos-oracao` — todos (sem campos privados de terceiros)
- `candidaturas-bf` — somente contagem e status
- `parceiros` — todos

### Pode ESCREVER:
- `grupos` — aprovar, rejeitar, atualizar status
- `intercessores` — aprovar, rejeitar
- `reunioes` — criar, editar, cancelar
- `convocacoes` — criar, editar, encerrar
- `parceiros` — aprovar, rejeitar

### NÃO pode:
- Criar ou editar aulas, atividades, conteúdo de formação
- Alterar configurações globais do sistema
- Acessar dados financeiros detalhados
- Gerenciar usuários administradores

---

## `LIDER_DE_NUCLEO`

**Gestão restrita ao próprio núcleo/grupo.**

### Pode LER:
- `intercessores` — apenas do seu grupo (`grupoId === seuGrupoId`)
- `pedidos-oracao` — pedidos associados ao seu núcleo
- `reunioes` — reuniões públicas e do seu núcleo
- `convocacoes` — convocações ativas

### Pode ESCREVER:
- `pedidos-oracao` — atualizar status de pedidos do seu grupo
- `intercessores` — registrar novos intercessores no seu grupo
- Registrar atas de reuniões do núcleo

### NÃO pode:
- Aprovar grupos ou intercessores de outros núcleos
- Criar reuniões gerais ou convocações
- Acessar formação (Barco da Fé)
- Ver dados de outros núcleos

---

## `INTERCESSOR`

**Participação ativa na rede de oração.**

### Pode LER:
- `pedidos-oracao` — pedidos com `compartilhar: true` (listagem pública)
- `relogio-oracao` — todos os horários (para ver disponibilidade)
- `reunioes` — reuniões públicas agendadas
- `convocacoes` — convocações ativas
- Próprio perfil (`intercessores/{seuId}`)

### Pode ESCREVER:
- `relogio-oracao` — criar/atualizar próprio compromisso de horário
- `diario-oracao` — registros pessoais de oração
- `testemunhos` — enviar próprio testemunho (status: 'pendente')
- Próprio perfil — atualizar dados de contato e disponibilidade

### NÃO pode:
- Ver campos privados (telefone/email) de outros usuários
- Aprovar ou rejeitar registros
- Acessar painéis de formação ou administração
- Ver candidaturas ou matrículas

---

## `ALUNO_BARCO_DA_FE`

**Participação no programa de formação.**

### Pode LER:
- `aulas-gravadas` — aulas da sua turma/módulo (publicado: true)
- `bf-atividades` — atividades da sua matrícula
- `matriculas-bf` — própria matrícula (`matriculaId === suaMatricula`)
- `mensagens` — mensagens trocadas com seu professor

### Pode ESCREVER:
- `envios-atividades` — enviar atividades
- `progresso-aulas` — marcar aulas como assistidas
- `mensagens` — enviar mensagens ao professor
- `testemunhos` — enviar próprio testemunho

### NÃO pode:
- Ver matrículas ou atividades de outros alunos
- Acessar conteúdo de outros módulos antes da liberação
- Ver notas/correções antes da publicação pelo professor
- Acessar qualquer painel administrativo

---

## `PROFESSOR_FORMADOR`

**Ensino e acompanhamento dos alunos.**

### Pode LER:
- `aulas-gravadas` — todas as aulas (incluindo não publicadas)
- `matriculas-bf` — matrículas da sua turma
- `bf-atividades` — atividades da sua turma
- `envios-atividades` — entregas dos seus alunos
- `mensagens` — mensagens com seus alunos
- `aluno-dossie` — dossiê completo de cada aluno da sua turma

### Pode ESCREVER:
- `aulas-gravadas` — criar e editar aulas
- `bf-atividades` — criar e editar atividades
- `professor-corrigir-atividade` — corrigir e dar nota/feedback
- `mensagens` — enviar mensagens aos alunos
- `bf-certificado-gerar` — emitir certificado (quando aluno conclui)
- Relatórios de progresso da turma

### NÃO pode:
- Aprovar candidaturas ao Barco da Fé (apenas admin)
- Criar matrículas
- Acessar dados de intercessores, grupos ou pedidos de oração
- Aprovar testemunhos ou parceiros
- Alterar configurações da plataforma

---

## Resumo de Permissões por Coleção

| Coleção | ADMIN | COORD | LIDER | INTERCESSOR | ALUNO_BF | PROF |
|---------|-------|-------|-------|-------------|----------|------|
| `pedidos-oracao` | R/W | R | R (grupo) | R (público) | — | — |
| `intercessores` | R/W | R/W | R/W (grupo) | R (próprio) | — | — |
| `grupos` | R/W | R/W | R (próprio) | — | — | — |
| `relogio-oracao` | R/W | R | R | R/W | — | — |
| `candidaturas-bf` | R/W | R (count) | — | — | — | — |
| `matriculas-bf` | R/W | — | — | — | R (própria) | R (turma) |
| `aulas-gravadas` | R/W | — | — | — | R | R/W |
| `bf-atividades` | R/W | — | — | — | R | R/W |
| `reunioes` | R/W | R/W | R | R | — | — |
| `convocacoes` | R/W | R/W | R | R | — | — |
| `testemunhos` | R/W | R | — | W | W | — |
| `parceiros` | R/W | R/W | — | — | — | — |
| `campanhas-doacoes` | R/W | R | R | R | — | — |
| `blog-posts` | R/W | R | R | R | R | R |

**Legenda:** R = leitura, W = escrita, R/W = leitura e escrita, — = sem acesso
