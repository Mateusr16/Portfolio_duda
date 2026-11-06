document.documentElement.classList.add("js");

const poucoMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (seletor, base = document) => base.querySelector(seletor);
const $$ = (seletor, base = document) => [...base.querySelectorAll(seletor)];

function criar(tag, propriedades = {}, ...filhos) {
  const elemento = Object.assign(document.createElement(tag), propriedades);
  elemento.append(...filhos);
  return elemento;
}

function criarBarras(alvo, quantidade) {
  alvo.replaceChildren(
    ...Array.from({ length: quantidade }, () => criar("span", {}, criar("i")))
  );
  return $$("i", alvo);
}

function calcularIdade(nascimento, hoje = new Date()) {
  const [ano, mes, dia] = nascimento.split("-").map(Number);
  const jaFezAniversario =
    hoje.getMonth() + 1 > mes || (hoje.getMonth() + 1 === mes && hoje.getDate() >= dia);
  return hoje.getFullYear() - ano - (jaFezAniversario ? 0 : 1);
}

/* Perfil e contato */
function preencherPerfil() {
  const { contato } = PERFIL;
  const idade = calcularIdade(PERFIL.nascimento);
  $$("[data-idade]").forEach((el) => (el.textContent = idade));
  $$("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));

  const retrato = $("[data-retrato]");
  retrato.src = PERFIL.retrato;
  retrato.alt = PERFIL.retratoDescricao;

  const email = $("[data-email]");
  email.href = `mailto:${contato.email}`;
  email.textContent = contato.email;

  const instagram = $("[data-instagram]");
  instagram.href = contato.instagram.link;
  instagram.textContent = `Instagram ${contato.instagram.usuario}`;

  const whatsapp = $("[data-whatsapp]");
  whatsapp.href = contato.whatsapp.link;
  whatsapp.textContent = `WhatsApp ${contato.whatsapp.numero}`;
}

/* Story da abertura */
function iniciarAbertura() {
  const raiz = $("[data-story-abertura]");
  const duracao = 3500;
  const imagens = QUADROS_ABERTURA.map((quadro) =>
    criar("img", { src: quadro.foto, alt: quadro.descricao })
  );
  $(".story__quadros", raiz).append(...imagens);
  const barras = criarBarras($(".story__barras", raiz), imagens.length);
  const tempo = $("[data-tempo]", raiz);

  if (poucoMovimento) {
    imagens[0].classList.add("ativo");
    barras[0].style.transform = "scaleX(1)";
    return;
  }

  const inicio = performance.now();
  function animar(agora) {
    const decorrido = (agora - inicio) % (duracao * imagens.length);
    const atual = Math.floor(decorrido / duracao);
    imagens.forEach((img, i) => img.classList.toggle("ativo", i === atual));
    barras.forEach((barra, i) => {
      const progresso = i < atual ? 1 : i > atual ? 0 : (decorrido % duracao) / duracao;
      barra.style.transform = `scaleX(${progresso})`;
    });
    tempo.textContent = String(Math.floor(decorrido / 1000)).padStart(2, "0");
    requestAnimationFrame(animar);
  }
  requestAnimationFrame(animar);
}

/* Grade e filtros */
function montarTrabalhos() {
  const grade = $("[data-grade]");
  const filtros = $("[data-filtros]");

  const itens = PROJETOS.map((projeto) => {
    const capa = criar(
      "span",
      { className: "cartao__capa" },
      criar("img", { src: projeto.capa, alt: "", loading: "lazy" }),
      criar("span", { className: "cartao__selo", textContent: projeto.categoria })
    );
    const play = criar("span", { className: "cartao__play" });
    play.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
    capa.append(play);

    const botao = criar(
      "button",
      { type: "button", className: "cartao" },
      capa,
      criar("span", { className: "cartao__titulo", textContent: projeto.titulo }),
      criar("span", {
        className: "cartao__info",
        textContent: `${projeto.cliente} · ${projeto.formato}`,
      })
    );
    botao.addEventListener("click", () => abrirVisor(projeto, botao));
    return criar("li", { className: "surgir" }, botao);
  });
  grade.append(...itens);

  const categorias = ["Todos", ...new Set(PROJETOS.map((p) => p.categoria))];
  const botoes = categorias.map((categoria) => {
    const botao = criar("button", { type: "button", textContent: categoria });
    botao.setAttribute("aria-pressed", String(categoria === "Todos"));
    botao.addEventListener("click", () => {
      botoes.forEach((b) => b.setAttribute("aria-pressed", String(b === botao)));
      itens.forEach((item, i) => {
        item.hidden = categoria !== "Todos" && PROJETOS[i].categoria !== categoria;
        item.classList.add("visivel");
      });
    });
    return botao;
  });
  filtros.append(...botoes);
}

/* Visualizador de stories */
const visor = {
  raiz: $("[data-visor]"),
  midia: $("[data-visor-midia]"),
  legenda: $("[data-visor-legenda]"),
  barras: [],
  projeto: null,
  atual: 0,
  progresso: 0,
  ultimoTempo: 0,
  pausado: false,
  quadroAnimacao: 0,
  origem: null,
};
const DURACAO_QUADRO = 5000;

function atualizarBarras() {
  visor.barras.forEach((barra, i) => {
    const valor = i < visor.atual ? 1 : i > visor.atual ? 0 : visor.progresso;
    barra.style.transform = `scaleX(${valor})`;
  });
}

function mostrarQuadro(indice) {
  const quadro = visor.projeto.quadros[indice];
  visor.atual = indice;
  visor.progresso = 0;
  visor.legenda.textContent = quadro.texto;

  const elemento = quadro.video
    ? criar("video", { src: quadro.video, autoplay: true, muted: true, playsInline: true })
    : criar("img", { src: quadro.foto, alt: "" });
  if (quadro.video) {
    elemento.addEventListener("ended", avancar);
  }
  visor.midia.replaceChildren(elemento);
  atualizarBarras();
}

function avancar() {
  if (visor.atual < visor.projeto.quadros.length - 1) mostrarQuadro(visor.atual + 1);
  else visor.raiz.close();
}

function voltar() {
  mostrarQuadro(Math.max(visor.atual - 1, 0));
}

function definirPausa(pausado) {
  visor.pausado = pausado;
  const botao = $("[data-visor-pausar]");
  botao.setAttribute("aria-label", pausado ? "Continuar" : "Pausar");
  $("path", botao).setAttribute("d", pausado ? "M8 5v14l11-7z" : "M7 5h4v14H7zM13 5h4v14h-4z");
  const video = $("video", visor.midia);
  if (video) pausado ? video.pause() : video.play();
  const imagem = $("img", visor.midia);
  if (imagem) imagem.style.animationPlayState = pausado ? "paused" : "running";
}

function animarVisor(agora) {
  if (!visor.raiz.open) return;
  const passo = agora - visor.ultimoTempo;
  visor.ultimoTempo = agora;
  if (!visor.pausado) {
    const video = $("video", visor.midia);
    if (video) {
      visor.progresso = video.duration ? video.currentTime / video.duration : 0;
    } else {
      visor.progresso += passo / DURACAO_QUADRO;
      if (visor.progresso >= 1) avancar();
    }
    atualizarBarras();
  }
  visor.quadroAnimacao = requestAnimationFrame(animarVisor);
}

function abrirVisor(projeto, origem) {
  visor.projeto = projeto;
  visor.origem = origem;
  $("[data-visor-titulo]").textContent = projeto.titulo;
  $("[data-visor-cliente]").textContent = `${projeto.cliente} · ${projeto.formato}`;
  visor.barras = criarBarras($("[data-visor-barras]"), projeto.quadros.length);
  mostrarQuadro(0);
  visor.raiz.showModal();
  definirPausa(poucoMovimento);
  visor.ultimoTempo = performance.now();
  visor.quadroAnimacao = requestAnimationFrame(animarVisor);
}

function iniciarVisor() {
  $("[data-visor-fechar]").addEventListener("click", () => visor.raiz.close());
  $("[data-visor-pausar]").addEventListener("click", () => definirPausa(!visor.pausado));
  $("[data-visor-anterior]").addEventListener("click", voltar);
  $("[data-visor-proximo]").addEventListener("click", avancar);

  visor.raiz.addEventListener("click", (evento) => {
    if (evento.target === visor.raiz) visor.raiz.close();
  });
  visor.raiz.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowRight") avancar();
    if (evento.key === "ArrowLeft") voltar();
  });
  visor.raiz.addEventListener("close", () => {
    cancelAnimationFrame(visor.quadroAnimacao);
    visor.midia.replaceChildren();
    visor.origem?.focus();
  });
}

/* Entrada ao rolar */
function iniciarSurgimento() {
  const alvos = [
    ...$$(".surgir"),
    ...$$(".sobre__foto, .sobre__texto, .servicos__lista > li, .processo__passos > li"),
  ];
  alvos.forEach((alvo) => alvo.classList.add("surgir"));

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  alvos.forEach((alvo) => observador.observe(alvo));
}

preencherPerfil();
iniciarAbertura();
montarTrabalhos();
iniciarVisor();
iniciarSurgimento();
