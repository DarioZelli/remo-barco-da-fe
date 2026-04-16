# Modelo de Dados — Barco da Fé / REMO

Todos os dados são armazenados no **Netlify Blobs** como JSON, com chave igual ao `id` do registro.

---

## `prayer_requests` (store: `pedidos-oracao`)

```json
{
  "id": "pedido_1700000000000_abc123",
  "nomeSolicitante": "João da Silva",
  "telefone": "11999990000",
  "paraQuem": "para minha mãe",
  "tema": "Saúde e Cura",
  "causa": "câncer",
  "descricao": "Minha mãe está com diagnóstico de câncer...",
  "compartilhar": true,
  "oracaoContinua": false,
  "campanhaColetiva": false,
  "dataEnvio": "2025-01-15T10:30:00.000Z",
  "criadoEm": "2025-01-15T10:30:00.000Z",
  "status": "ativo",
  "observacao": "",
  "ultimaAtualizacao": "2025-01-15T10:30:00.000Z"
}
```

**Status possíveis:** `ativo`, `em-oracao`, `respondido`, `encerrado`

---

## `prayer_topics` (store: `temas-oracao`)

```json
{
  "id": "t1",
  "nome": "Saúde e Cura",
  "slug": "saude-cura",
  "icone": "🏥",
  "ativo": true,
  "criadoEm": "2025-01-01T00:00:00.000Z"
}
```

**Temas padrão (fallback):** Saúde e Cura, Família, Finanças, Salvação, Libertação, Saúde Mental, Nações, Missões, Casamento, Filhos, Milagres, Avivamento.

---

## `intercessors` (store: `intercessores`)

```json
{
  "id": "intercessor_1700000000000_abc123",
  "nomeCompleto": "Maria Souza",
  "email": "maria@email.com",
  "telefone": "11988880000",
  "cidade": "São Paulo",
  "estado": "SP",
  "igreja": "Igreja Comunidade da Graça",
  "disponibilidade": ["segunda-manhã", "quarta-tarde"],
  "areasDeOracao": ["Saúde e Cura", "Família"],
  "experiencia": "5 anos em grupo de intercessão",
  "status": "pendente",
  "aprovado": false,
  "criadoEm": "2025-01-15T10:00:00.000Z"
}
```

**Status possíveis:** `pendente`, `aprovado`, `rejeitado`, `inativo`

---

## `prayer_clock_slots` (store: `relogio-oracao`)

```json
{
  "id": "relogio_1700000000000_abc123",
  "nome": "Carlos Lima",
  "email": "carlos@email.com",
  "telefone": "11977770000",
  "diaSemana": "segunda",
  "horario": "06:00",
  "compromisso": "semanal",
  "ativo": true,
  "criadoEm": "2025-01-15T08:00:00.000Z"
}
```

---

## `partners` (store: `parceiros`)

```json
{
  "id": "parceiro_1700000000000_abc123",
  "nomePublico": "Igreja Vida Nova",
  "responsavel": "Pastor Roberto",
  "telefone": "11966660000",
  "email": "contato@vidanova.com",
  "cidade": "Campinas",
  "estado": "SP",
  "tipo": "Igreja",
  "autorizaDivulgacao": true,
  "divulgarPublicamente": true,
  "aprovado": false,
  "status": "pendente",
  "criadoEm": "2025-01-15T09:00:00.000Z"
}
```

**Tipos:** `Igreja`, `Ministério`, `Organização`, `Empresa`, `Pessoa`

---

## `groups` (store: `grupos`)

```json
{
  "id": "grupo_1700000000000_abc123",
  "tipo": "Igreja Local",
  "nomeGrupo": "Grupo de Oração Esperança",
  "responsavel": "Ana Paula",
  "telefone": "11955550000",
  "email": "ana@email.com",
  "cidade": "Belo Horizonte",
  "estado": "MG",
  "quantidadeAproximada": 15,
  "formato": "Híbrido",
  "diasDisponiveis": ["terça", "quinta"],
  "autorizaDivulgacao": true,
  "status": "pendente",
  "criadoEm": "2025-01-15T11:00:00.000Z"
}
```

**Tipos:** `Grupo Doméstico`, `Igreja Local`, `Ministério Parceiro`, `Núcleo Regional`
**Status:** `pendente`, `aprovado`, `rejeitado`, `inativo`

---

## `meetings` (store: `reunioes`)

```json
{
  "id": "reuniao_1700000000000_abc123",
  "titulo": "Culto de Clamor — Janeiro 2025",
  "tipo": "Culto de Clamor",
  "dataHora": "2025-01-20T20:00:00.000Z",
  "linkVideo": "https://meet.google.com/xxx-yyy-zzz",
  "pauta": "Oração pelas nações, testemunhos, palavra",
  "publicoAlvo": "Todos os intercessores",
  "status": "agendado",
  "criadoEm": "2025-01-15T12:00:00.000Z"
}
```

**Tipos:** `Encontro Online`, `Retiro`, `Culto de Clamor`, `Reunião de Líderes`, `Outro`
**Status:** `agendado`, `realizado`, `cancelado`

---

## `calls_to_prayer` (store: `convocacoes`)

```json
{
  "id": "convocacao_1700000000000_abc123",
  "titulo": "Jejum e Oração — Urgente",
  "tipo": "Extraordinária",
  "mensagem": "Convocamos todos os intercessores para 3 dias de jejum...",
  "publicoAlvo": "Todos",
  "canal": "WhatsApp",
  "dataDisparo": "2025-01-16T08:00:00.000Z",
  "status": "ativo",
  "criadoEm": "2025-01-15T14:00:00.000Z"
}
```

**Canal:** `WhatsApp`, `Email`, `Ambos`
**Status:** `ativo`, `encerrado`, `cancelado`

---

## `testimonies` (store: `testemunhos`)

```json
{
  "id": "testemunho_1700000000000_abc123",
  "nome": "Fernanda Oliveira",
  "cidade": "Fortaleza",
  "texto": "Após 3 meses de oração da rede, meu esposo foi curado...",
  "tema": "Saúde e Cura",
  "autorizacaoPublicacao": true,
  "status": "pendente",
  "criadoEm": "2025-01-15T15:00:00.000Z"
}
```

**Status:** `pendente`, `aprovado`, `rejeitado`

---

## `barco_candidates` (store: `candidaturas-bf`)

```json
{
  "id": "candidatura_1700000000000_abc123",
  "nomeCompleto": "Lucas Pereira",
  "email": "lucas@email.com",
  "telefone": "11944440000",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "igreja": "Igreja Batista Central",
  "pastor": "Pastor José",
  "motivacao": "Quero aprofundar minha vida de oração...",
  "disponibilidade": ["segunda-noite", "sábado-manhã"],
  "comoSoube": "Instagram",
  "status": "pendente",
  "criadoEm": "2025-01-15T16:00:00.000Z"
}
```

**Status:** `pendente`, `aprovado`, `matriculado`, `rejeitado`

---

## `barco_students` (store: `matriculas-bf`)

```json
{
  "id": "matricula_1700000000000_abc123",
  "candidaturaId": "candidatura_1700000000000_abc123",
  "nomeCompleto": "Lucas Pereira",
  "email": "lucas@email.com",
  "turma": "Turma Janeiro 2025",
  "professorId": "usuario_xyz",
  "moduloAtual": 2,
  "aulasConcluidas": ["aula_1", "aula_2", "aula_3"],
  "atividadesEntregues": 3,
  "atividadesAprovadas": 2,
  "status": "ativo",
  "certificadoEmitido": false,
  "criadoEm": "2025-01-20T10:00:00.000Z"
}
```

---

## `donation_campaigns` (store: `campanhas-doacoes`)

```json
{
  "id": "campanha_1700000000000_abc123",
  "titulo": "Campanha de Missões 2025",
  "descricao": "Apoio a missionários no Norte do Brasil",
  "local": "Região Norte",
  "data": "2025-03-01",
  "metaValor": 50000,
  "totalArrecadado": 12500,
  "status": "ativo",
  "criadoEm": "2025-01-15T17:00:00.000Z"
}
```

**Status:** `ativo`, `encerrado`, `cancelado`

---

## `donation_receipts` (store: `doacoes`)

```json
{
  "id": "doacao_1700000000000_abc123",
  "campanhaId": "campanha_1700000000000_abc123",
  "nome": "Paulo Rodrigues",
  "valorPrometido": 500,
  "valorEnviado": 500,
  "comprovanteUrl": "https://...",
  "exibirPublicamente": false,
  "observacoes": "",
  "status": "pendente",
  "criadoEm": "2025-01-15T18:00:00.000Z"
}
```

**Status:** `pendente`, `confirmado`, `cancelado`

---

## `blog_posts` (store: `blog-posts`)

```json
{
  "id": "post_1700000000000_abc123",
  "titulo": "Como interceder pelas nações",
  "slug": "como-interceder-pelas-nacoes",
  "categoria": "Ensino",
  "resumo": "Princípios bíblicos para a intercessão intercultural...",
  "conteudo": "# Como interceder pelas nações\n\n...",
  "destaque": true,
  "publicado": true,
  "criadoEm": "2025-01-15T19:00:00.000Z"
}
```

**Categorias sugeridas:** `Ensino`, `Testemunho`, `Missões`, `Avivamento`, `Formação`, `Notícias`
