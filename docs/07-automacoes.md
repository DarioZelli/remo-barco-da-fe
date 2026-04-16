# Automações — Barco da Fé / REMO

## Automação 1 — Boas-vindas ao Intercessor

**Trigger:** Intercessor aprovado pelo admin (`status` atualizado para `'aprovado'`)
**Canal:** E-mail
**Destinatário:** Intercessor cadastrado (`email`)
**Mensagem-modelo:**

> **Assunto:** Bem-vindo(a) à Rede de Clamor REMO, {{nomeCompleto}}!
>
> Olá, {{nomeCompleto}}! 🙏
>
> Sua inscrição na Rede de Clamor foi aprovada! Você agora faz parte de uma rede de intercessores comprometidos com a oração pelo Brasil e pelas nações.
>
> **Próximos passos:**
> - Acesse seu painel de intercessor em: {{linkPainel}}
> - Escolha seu horário no Relógio de Oração
> - Fique atento às convocações de oração
>
> Que o Senhor honre cada oração sua. Juntos, cobrimos o Brasil!
>
> Ministério REMO

---

## Automação 2 — Lembrete de Reunião

**Trigger:** 24 horas antes de uma reunião com `status: 'agendado'`
**Canal:** E-mail e/ou WhatsApp
**Destinatário:** Todos os intercessores aprovados (ou público-alvo da reunião)
**Mensagem-modelo:**

> **Assunto:** Lembrete: {{titulo}} amanhã às {{horario}}
>
> Não se esqueça! Amanhã temos nossa reunião de oração:
>
> 📅 **{{titulo}}**
> 🕐 {{dataHora}}
> 🔗 {{linkVideo}}
>
> **Pauta:** {{pauta}}
>
> Confirme sua presença e nos vemos lá!
>
> Equipe REMO

---

## Automação 3 — Lembrete de Compromisso do Relógio

**Trigger:** 30 minutos antes do horário assumido no Relógio de Oração
**Canal:** WhatsApp e/ou E-mail
**Destinatário:** Intercessor com compromisso ativo naquele horário
**Mensagem-modelo:**

> Olá, {{nome}}! ⏰
>
> Em 30 minutos é o seu horário de oração no Relógio de Clamor REMO: **{{horario}}**.
>
> A rede está contando com você. Que o Espírito Santo guie cada intercessão!
>
> Ministério REMO

---

## Automação 4 — Convocação Extraordinária

**Trigger:** Admin cria convocação com `canal: 'WhatsApp'` ou `'Ambos'` e `dataDisparo` atingida
**Canal:** WhatsApp
**Destinatário:** Todos os intercessores aprovados (ou público-alvo especificado)
**Mensagem-modelo:**

> 🚨 *CONVOCAÇÃO EXTRAORDINÁRIA — REMO*
>
> **{{titulo}}**
>
> {{mensagem}}
>
> 📅 Início: {{dataDisparo}}
> 👥 Para: {{publicoAlvo}}
>
> Responda a este chamado. Sua oração faz diferença!
>
> Ministério REMO 🚢

---

## Automação 5 — Atualização de Pauta Semanal

**Trigger:** Todo domingo às 18h (agendamento semanal)
**Canal:** E-mail
**Destinatário:** Todos os intercessores aprovados
**Mensagem-modelo:**

> **Assunto:** Pauta de Oração da Semana — {{semana}}
>
> Olá, intercessor(a)!
>
> Confira os temas prioritários de oração para esta semana:
>
> {{listaTemas}}
>
> **Reuniões desta semana:**
> {{listaReunioes}}
>
> Mantenha-se firme na intercessão!
>
> Equipe REMO

---

## Automação 6 — Aviso ao Coordenador de Novo Grupo/Igreja

**Trigger:** Novo cadastro de grupo salvo (`status: 'pendente'`)
**Canal:** E-mail
**Destinatário:** Coordenadores gerais (emails cadastrados no sistema)
**Mensagem-modelo:**

> **Assunto:** Novo grupo aguarda aprovação: {{nomeGrupo}}
>
> Um novo grupo se cadastrou na Rede de Clamor e aguarda sua análise:
>
> 🏛️ **{{nomeGrupo}}** ({{tipo}})
> 👤 Responsável: {{responsavel}}
> 📍 {{cidade}} / {{estado}}
> 📱 {{telefone}}
>
> Acesse o painel de coordenação para aprovar ou rejeitar:
> {{linkPainel}}
>
> Equipe REMO

---

## Automação 7 — Confirmação após Pedido de Oração

**Trigger:** Pedido de oração salvo com sucesso
**Canal:** E-mail (se email fornecido)
**Destinatário:** Solicitante do pedido
**Mensagem-modelo:**

> **Assunto:** Seu pedido de oração foi recebido — REMO
>
> {{nomeSolicitante}}, recebemos seu pedido! 🙏
>
> Nossa rede de intercessores vai orar por você.
>
> **Seu número de acompanhamento:** `{{id}}`
>
> Guarde este número para consultar o andamento do seu pedido.
>
> **Tema:** {{tema}}
>
> "Ora sem cessar." — 1 Tessalonicenses 5:17
>
> Ministério REMO

---

## Automação 8 — Follow-up do Pedido

**Trigger:** 30 dias após pedido com `status: 'ativo'` sem atualização
**Canal:** E-mail (se email fornecido)
**Destinatário:** Solicitante do pedido
**Mensagem-modelo:**

> **Assunto:** Continuamos orando por você — REMO
>
> Olá, {{nomeSolicitante}}!
>
> Faz 30 dias que recebemos seu pedido de oração sobre **{{causa}}**.
>
> Nossa rede continua intercedendo por você!
>
> Deus tem respondido? Compartilhe um testemunho conosco: {{linkTestemunho}}
>
> Caso precise atualizar seu pedido ou encerrar a oração, responda este e-mail.
>
> Deus é fiel!
>
> Ministério REMO

---

## Automação 9 — Aviso ao Candidato BF após Inscrição

**Trigger:** Candidatura ao Barco da Fé salva com sucesso
**Canal:** E-mail
**Destinatário:** Candidato (`email`)
**Mensagem-modelo:**

> **Assunto:** Inscrição recebida — Barco da Fé / REMO
>
> Olá, {{nomeCompleto}}! ⛵
>
> Recebemos sua inscrição no **Programa Barco da Fé**!
>
> Sua candidatura está sendo analisada pela equipe. Em breve entraremos em contato para informar o resultado.
>
> **Número da sua inscrição:** `{{id}}`
>
> **O que acontece agora:**
> 1. Nossa equipe analisa sua candidatura
> 2. Você recebe um e-mail com o resultado
> 3. Se aprovado(a), criamos sua matrícula e liberamos o acesso às aulas
>
> Enquanto aguarda, continue em oração! 🙏
>
> Equipe REMO — Barco da Fé
