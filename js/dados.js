/*
  TUDO O QUE MUDA COM FREQUÊNCIA ESTÁ AQUI.

  Para trocar uma foto: coloque o arquivo na pasta "fotos" e use o caminho
  dele no lugar do link. Exemplo: foto: "fotos/retrato.jpg"

  Para mostrar um vídeo em um projeto: use { video: "videos/reels.mp4", texto: "..." }
  no lugar de { foto: "...", texto: "..." }.

  Prefira fotos e vídeos verticais (9:16). Todo projeto abaixo é um EXEMPLO
  e deve ser substituído por um trabalho real antes de publicar o site.
*/

const unsplash = (id, largura = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${largura}&q=75&auto=format&fit=crop`;

const FOTOS = {
  retrato: "fotos/Eu.jpg",
  camera: unsplash("1516035069371-29a1b244cc32"),
  edicao: unsplash("1574717024653-61fd2cf4d44d"),
  celular: unsplash("1600096194534-95cf5ece04cf"),
  redes: unsplash("1516321318423-f06f85e504b3"),
  moda: unsplash("1523381210434-271e8be1f52b"),
  loja: unsplash("1441986300917-64674bd600d8"),
  cafe: unsplash("1495474472287-4d71bcdd2085"),
  restaurante: unsplash("1414235077428-338989a2e8c0"),
  beleza: unsplash("1596462502278-27bfdc403348"),
  salao: unsplash("1522337360788-8b13dee7a37e"),
  academia: unsplash("1517836357463-d25dfeac3438"),
};

const PERFIL = {
  nome: "Maria Eduarda Cruz",
  nascimento: "2006-12-24", // a idade no site é calculada a partir desta data
  retrato: FOTOS.retrato,
  retratoDescricao: "Retrato de Maria Eduarda Cruz",
  contato: {
    email: "contato@exemplo.com",
    instagram: { usuario: "@seuusuario", link: "#contato" },
    whatsapp: { numero: "(00) 00000-0000", link: "#contato" },
  },
};

// Abertura do site: os quadros passam sozinhos, como em um story.
const QUADROS_ABERTURA = [
  { foto: FOTOS.camera, descricao: "Câmera fotográfica profissional" },
  { foto: FOTOS.edicao, descricao: "Linha do tempo de um programa de edição de vídeo" },
  { foto: FOTOS.celular, descricao: "Mão segurando um celular abaixo de uma notificação de curtida" },
];

const PROJETOS = [
  {
    titulo: "Lançamento de coleção",
    cliente: "Marca de moda (exemplo)",
    categoria: "Storymaker",
    formato: "Sequência de stories",
    capa: FOTOS.moda,
    quadros: [
      { foto: FOTOS.moda, texto: "Contagem regressiva: três dias de bastidores antes da nova coleção." },
      { foto: FOTOS.loja, texto: "Dia do lançamento na loja, com cobertura em tempo real." },
      { foto: FOTOS.celular, texto: "Enquetes e caixinhas para a audiência escolher os looks favoritos." },
    ],
  },
  {
    titulo: "Cardápio de outono",
    cliente: "Cafeteria (exemplo)",
    categoria: "Videomaker",
    formato: "Reels · 30 segundos",
    capa: FOTOS.cafe,
    quadros: [
      { foto: FOTOS.cafe, texto: "Captação vertical do preparo, do grão à xícara." },
      { foto: FOTOS.restaurante, texto: "Clima da casa em planos curtos, editados no ritmo da música." },
    ],
  },
  {
    titulo: "Um mês de conteúdo",
    cliente: "Marca de beleza (exemplo)",
    categoria: "Social Media",
    formato: "Planejamento e gestão",
    capa: FOTOS.beleza,
    quadros: [
      { foto: FOTOS.beleza, texto: "Calendário editorial com temas fixos para cada dia da semana." },
      { foto: FOTOS.redes, texto: "Legendas, roteiros e publicação organizados em um só fluxo." },
    ],
  },
  {
    titulo: "Dia de salão",
    cliente: "Salão de beleza (exemplo)",
    categoria: "Storymaker",
    formato: "Cobertura de stories",
    capa: FOTOS.salao,
    quadros: [
      { foto: FOTOS.salao, texto: "Um dia inteiro de atendimento contado do ponto de vista da cliente." },
      { foto: FOTOS.beleza, texto: "Antes e depois em quadros simples e fáceis de salvar." },
    ],
  },
  {
    titulo: "Treino em movimento",
    cliente: "Academia (exemplo)",
    categoria: "Videomaker",
    formato: "Vídeo institucional vertical",
    capa: FOTOS.academia,
    quadros: [
      { foto: FOTOS.academia, texto: "Cortes rápidos e som ambiente para passar a energia do treino." },
      { foto: FOTOS.edicao, texto: "Roteiro enxuto, gravado em uma única diária." },
    ],
  },
  {
    titulo: "Perfil do zero",
    cliente: "Loja local (exemplo)",
    categoria: "Social Media",
    formato: "Identidade do feed e rotina",
    capa: FOTOS.loja,
    quadros: [
      { foto: FOTOS.loja, texto: "Reorganização do perfil: bio, destaques e linha visual do feed." },
      { foto: FOTOS.celular, texto: "Rotina semanal simples, que a própria equipe consegue manter." },
    ],
  },
];
