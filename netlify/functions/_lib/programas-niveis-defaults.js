const PROGRAMAS_PADRAO = [
  {
    id: 'N1',
    nivel: 'N1',
    titulo: 'N1 — Fundamentação',
    icone: '⚓',
    subtitulo: 'Fundamentos espirituais da intercessão',
    resumo: 'Base bíblica, vida devocional, identidade do intercessor e princípios essenciais para servir com entendimento e reverência.',
    objetivos: [
      'Firmar o aluno nas bases bíblicas da oração e da intercessão.',
      'Desenvolver disciplina devocional e vida de consagração.',
      'Compreender o papel do intercessor na missão da REMO.'
    ],
    conteudos: [
      'Oração como relacionamento com Deus',
      'Fundamentos bíblicos da intercessão',
      'Vida de santidade, consagração e perseverança',
      'Postura espiritual do intercessor'
    ],
    publico: 'Alunos iniciantes e candidatos encaminhados para formação.',
    ativo: true,
    ordem: 1
  },
  {
    id: 'N2',
    nivel: 'N2',
    titulo: 'N2 — Aprofundamento',
    icone: '🌊',
    subtitulo: 'Intercessão mais madura e sensível ao Espírito Santo',
    resumo: 'Aprofunda a prática da oração, jejum, discernimento espiritual e cobertura de temas mais complexos.',
    objetivos: [
      'Amadurecer a escuta espiritual e o discernimento bíblico.',
      'Capacitar o aluno para intercessão mais consistente e estratégica.',
      'Trabalhar temas de batalha espiritual com equilíbrio bíblico.'
    ],
    conteudos: [
      'Jejum e oração',
      'Discernimento espiritual',
      'Intercessão por famílias, cidades e nações',
      'Princípios de batalha espiritual com base bíblica'
    ],
    publico: 'Alunos que concluíram o nível N1.',
    ativo: true,
    ordem: 2
  },
  {
    id: 'N3',
    nivel: 'N3',
    titulo: 'N3 — Prática',
    icone: '🧭',
    subtitulo: 'Aplicação ministerial supervisionada',
    resumo: 'Transforma conhecimento em prática guiada, com participação em atividades, relatórios e acompanhamento de casos.',
    objetivos: [
      'Levar o aluno a praticar o conteúdo aprendido em ambiente supervisionado.',
      'Desenvolver responsabilidade espiritual e constância.',
      'Integrar teoria, prática e serviço real na REMO.'
    ],
    conteudos: [
      'Plantões e escalas de oração',
      'Acompanhamento de pedidos e atualizações',
      'Relatórios de intercessão',
      'Práticas orientadas de cobertura espiritual'
    ],
    publico: 'Alunos aprovados nos níveis anteriores.',
    ativo: true,
    ordem: 3
  },
  {
    id: 'N4',
    nivel: 'N4',
    titulo: 'N4 — Liderança',
    icone: '⛵',
    subtitulo: 'Formação de líderes de intercessão',
    resumo: 'Prepara intercessores maduros para orientar grupos, equipes, escalas e ações de coordenação na rede.',
    objetivos: [
      'Capacitar líderes para conduzir grupos e horários de oração.',
      'Trabalhar cuidado pastoral, equilíbrio e prestação de contas.',
      'Fortalecer liderança serva e gestão espiritual saudável.'
    ],
    conteudos: [
      'Liderança serva',
      'Condução de grupos e reuniões',
      'Organização de escalas e acompanhamento de equipe',
      'Ética, zelo e responsabilidade ministerial'
    ],
    publico: 'Intercessores experientes aprovados para liderança.',
    ativo: true,
    ordem: 4
  },
  {
    id: 'N5',
    nivel: 'N5',
    titulo: 'N5 — Missão',
    icone: '🌐',
    subtitulo: 'Intercessão missionária e expansão da rede',
    resumo: 'Último nível da trilha, voltado à expansão, mobilização, visão missionária e implantação de novas frentes.',
    objetivos: [
      'Conectar intercessão e missão de forma madura.',
      'Preparar multiplicadores e articuladores da rede.',
      'Expandir a visão da REMO para cidades, igrejas e nações.'
    ],
    conteudos: [
      'Missão e intercessão',
      'Cobertura espiritual de projetos e equipes',
      'Mobilização e expansão da rede',
      'Formação de novas frentes e multiplicação'
    ],
    publico: 'Líderes e intercessores enviados para expansão.',
    ativo: true,
    ordem: 5
  }
];

function cloneProgramasPadrao() {
  return JSON.parse(JSON.stringify(PROGRAMAS_PADRAO));
}

module.exports = { PROGRAMAS_PADRAO, cloneProgramasPadrao };
