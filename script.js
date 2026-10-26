/* =========================================================
   Vértice Pisos & Revestimentos - script.js
   Tudo o que você pode querer trocar está no bloco CONFIG
   e no bloco IMAGENS, logo abaixo.
   ========================================================= */
"use strict";

/* ---------- 1. CONFIGURAÇÕES (altere aqui) ---------- */
const CONFIG = {
  nomeLoja: "Vértice Pisos & Revestimentos",

  // NÚMERO DO WHATSAPP: único lugar para trocar.
  // Formato: só números, com código do país (55) + DDD + número.
  // Exemplo: "5511999999999". Enquanto estiver vazio, os botões
  // mostram um aviso em vez de abrir uma conversa inválida.
  whatsappNumero: "",

  endereco: "Avenida dos Autonomistas, 2500, Centro, Osasco - SP",
  mensagemGeral: "Olá! Gostaria de falar com um especialista da Vértice Pisos & Revestimentos."
};

/* ---------- 2. IMAGENS (URLs externas em um só lugar) ----------
   São fotos do Unsplash usadas apenas para demonstração.
   A licença e a disponibilidade de cada foto NÃO foram verificadas:
   confira antes de usar em um cliente real e troque por fotos próprias.
   Para usar arquivos locais, crie uma pasta "imagens" ao lado do index.html
   e use caminhos como "imagens/hero.jpg".
   Se uma imagem não carregar, o site mostra um fundo alternativo. */
const IMAGENS = {
  hero: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=70",
  porcelanatos: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=70",
  ceramicas: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=70",
  revestimentos: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=70",
  externos: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=70"
};

/* ---------- 3. DADOS: categorias e produtos fictícios ---------- */
const CATEGORIAS = [
  { id: "todos", nome: "Todos" },
  { id: "porcelanatos", nome: "Porcelanatos" },
  { id: "ceramicas", nome: "Cerâmicas" },
  { id: "revestimentos", nome: "Revestimentos de parede" },
  { id: "externos", nome: "Pisos para áreas externas" }
];

// "amostra" liga cada produto a uma textura feita em CSS (classe amostra--...)
const PRODUTOS = [
  { nome: "Calacatta Elegance", categoria: "porcelanatos", formato: "90 x 90 cm", acabamento: "Polido", estilo: "Mármore claro", amostra: "marmore-claro", descricao: "Ideal para ambientes sofisticados e contemporâneos." },
  { nome: "Concrete Urban", categoria: "porcelanatos", formato: "84 x 84 cm", acabamento: "Acetinado", estilo: "Concreto", amostra: "concreto", descricao: "Ideal para projetos modernos e minimalistas." },
  { nome: "Sand Natural", categoria: "porcelanatos", formato: "90 x 90 cm", acabamento: "Acetinado", estilo: "Pedra bege", amostra: "pedra-bege", descricao: "Combina com ambientes acolhedores e naturais." },

  { nome: "Urban Grey", categoria: "ceramicas", formato: "60 x 60 cm", acabamento: "Acetinado", estilo: "Cinza contemporâneo", amostra: "cinza", descricao: "Versátil para diferentes ambientes." },
  { nome: "Madeira Carvalho", categoria: "ceramicas", formato: "20 x 120 cm", acabamento: "Texturizado", estilo: "Madeira", amostra: "madeira", descricao: "Aparência amadeirada para ambientes aconchegantes." },
  { nome: "Off White", categoria: "ceramicas", formato: "60 x 60 cm", acabamento: "Acetinado", estilo: "Claro e neutro", amostra: "claro", descricao: "Ideal para ambientes iluminados e atemporais." },

  { nome: "Marble White", categoria: "revestimentos", formato: "32 x 60 cm", acabamento: "Brilhante", estilo: "Mármore branco", amostra: "marmore-branco", descricao: "Indicado para paredes com visual sofisticado." },
  { nome: "Brick Terracota", categoria: "revestimentos", formato: "7 x 24 cm", acabamento: "Texturizado", estilo: "Tijolinho terracota", amostra: "tijolo", descricao: "Ideal para paredes decorativas." },
  { nome: "Wave White", categoria: "revestimentos", formato: "30 x 90 cm", acabamento: "Relevo", estilo: "Branco contemporâneo", amostra: "relevo", descricao: "Indicado para paredes com destaque visual." },

  { nome: "Stone Grip", categoria: "externos", formato: "60 x 60 cm", acabamento: "Antiderrapante (especificação fictícia)", estilo: "Pedra natural", amostra: "pedra-natural", descricao: "Pensado para áreas externas." },
  { nome: "Deck Carvalho", categoria: "externos", formato: "26 x 106 cm", acabamento: "Texturizado", estilo: "Madeira", amostra: "madeira", descricao: "Visual amadeirado para espaços de lazer." },
  { nome: "Porcelanato Externo Grafite", categoria: "externos", formato: "80 x 80 cm", acabamento: "Texturizado", estilo: "Grafite", amostra: "grafite", descricao: "Indicado para projetos externos contemporâneos." }
];

/* ---------- 4. Referências aos elementos da página ---------- */
const el = {
  menuBotao: document.getElementById("menu-botao"),
  menu: document.getElementById("menu"),
  filtros: document.getElementById("filtros"),
  buscaForm: document.getElementById("busca-form"),
  buscaCampo: document.getElementById("busca-campo"),
  buscaLimpar: document.getElementById("busca-limpar"),
  contador: document.getElementById("contador"),
  lista: document.getElementById("produtos-lista"),
  vazia: document.getElementById("mensagem-vazia"),
  mostrarTodos: document.getElementById("mostrar-todos"),
  aviso: document.getElementById("aviso"),
  avisoWhatsapp: document.getElementById("aviso-whatsapp"),
  linkMapa: document.getElementById("link-mapa"),
  ano: document.getElementById("ano")
};

// Estado atual do catálogo
const estado = { categoria: "todos", busca: "" };

/* ---------- 5. Funções auxiliares ---------- */

// Remove acentos e deixa em minúsculas (assim "ceramica" encontra "Cerâmica")
function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function nomeDaCategoria(id) {
  const achada = CATEGORIAS.find(function (c) { return c.id === id; });
  return achada ? achada.nome : "";
}

// Cria um elemento com texto seguro (textContent nunca interpreta HTML)
function criar(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

/* ---------- 6. WhatsApp ---------- */
function whatsappConfigurado() {
  return /^\d{12,13}$/.test(CONFIG.whatsappNumero);
}

let temporizadorAviso = null;
function mostrarAviso(mensagem) {
  el.aviso.textContent = mensagem;
  el.aviso.hidden = false;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(function () { el.aviso.hidden = true; }, 7000);
}

function abrirWhatsApp(mensagem) {
  if (!whatsappConfigurado()) {
    mostrarAviso("Este é um site de demonstração: o número de WhatsApp ainda não foi configurado. Abra o arquivo script.js e preencha whatsappNumero no bloco CONFIG.");
    return;
  }
  const url = "https://wa.me/" + CONFIG.whatsappNumero + "?text=" + encodeURIComponent(mensagem);
  window.open(url, "_blank", "noopener");
}

// Todos os links com data-whatsapp="geral" usam a mensagem geral
function ligarBotoesWhatsApp() {
  document.querySelectorAll("[data-whatsapp]").forEach(function (botao) {
    botao.addEventListener("click", function (evento) {
      evento.preventDefault();
      fecharMenu();
      abrirWhatsApp(CONFIG.mensagemGeral);
    });
  });

  if (!whatsappConfigurado()) {
    el.avisoWhatsapp.textContent = "Aviso: número de WhatsApp de demonstração ainda não configurado. Para ativar os botões, preencha whatsappNumero no arquivo script.js.";
    el.avisoWhatsapp.hidden = false;
  }
}

/* ---------- 7. Google Maps ---------- */
function configurarMapa() {
  el.linkMapa.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.endereco);
}

/* ---------- 8. Menu móvel ---------- */
function fecharMenu() {
  el.menu.classList.remove("is-aberto");
  el.menuBotao.setAttribute("aria-expanded", "false");
  el.menuBotao.setAttribute("aria-label", "Abrir menu");
}

function alternarMenu() {
  const abrir = !el.menu.classList.contains("is-aberto");
  el.menu.classList.toggle("is-aberto", abrir);
  el.menuBotao.setAttribute("aria-expanded", String(abrir));
  el.menuBotao.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
}

function configurarMenu() {
  el.menuBotao.addEventListener("click", alternarMenu);
  el.menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", fecharMenu);
  });
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") fecharMenu();
  });
  // Se a janela ficar larga (computador), garante o menu em estado normal
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 960) fecharMenu();
  });
}

/* ---------- 9. Catálogo: filtros, busca e renderização ---------- */
function criarBotoesDeFiltro() {
  CATEGORIAS.forEach(function (cat) {
    const botao = criar("button", "filtro", cat.nome);
    botao.type = "button";
    botao.dataset.categoria = cat.id;
    botao.setAttribute("aria-pressed", String(cat.id === estado.categoria));
    botao.addEventListener("click", function () {
      definirCategoria(cat.id);
    });
    el.filtros.appendChild(botao);
  });
}

function definirCategoria(id) {
  estado.categoria = id;
  el.filtros.querySelectorAll(".filtro").forEach(function (botao) {
    botao.setAttribute("aria-pressed", String(botao.dataset.categoria === id));
  });
  atualizarCatalogo();
}

function criarCartaoDeProduto(produto) {
  const cartao = criar("article", "produto");

  const amostra = criar("div", "produto__amostra amostra--" + produto.amostra);
  amostra.setAttribute("role", "img");
  amostra.setAttribute("aria-label", "Amostra visual ilustrativa do estilo " + produto.estilo);
  amostra.appendChild(criar("span", "produto__selo", nomeDaCategoria(produto.categoria)));
  cartao.appendChild(amostra);

  const corpo = criar("div", "produto__corpo");
  corpo.appendChild(criar("h3", "produto__nome", produto.nome));

  const dados = criar("dl", "produto__dados");
  [
    ["Formato", produto.formato],
    ["Acabamento", produto.acabamento],
    ["Estilo", produto.estilo]
  ].forEach(function (par) {
    const linha = criar("div");
    linha.appendChild(criar("dt", "", par[0]));
    linha.appendChild(criar("dd", "", par[1]));
    dados.appendChild(linha);
  });
  corpo.appendChild(dados);

  corpo.appendChild(criar("p", "produto__descricao", produto.descricao));

  const botao = criar("button", "btn btn--secundario", "Solicitar informações");
  botao.type = "button";
  botao.setAttribute("aria-label", "Solicitar informações sobre " + produto.nome + " pelo WhatsApp");
  botao.addEventListener("click", function () {
    abrirWhatsApp("Olá! Gostaria de mais informações sobre o produto " + produto.nome + " (" + produto.formato + ", " + produto.acabamento.toLowerCase() + ").");
  });
  corpo.appendChild(botao);

  cartao.appendChild(corpo);
  return cartao;
}

// Aplica categoria + pesquisa ao mesmo tempo e redesenha a lista
function atualizarCatalogo() {
  const termo = normalizar(estado.busca);

  const visiveis = PRODUTOS.filter(function (p) {
    const categoriaOk = estado.categoria === "todos" || p.categoria === estado.categoria;
    const buscaOk = termo === "" || normalizar(p.nome).includes(termo);
    return categoriaOk && buscaOk;
  });

  el.lista.replaceChildren();
  visiveis.forEach(function (p) {
    el.lista.appendChild(criarCartaoDeProduto(p));
  });

  el.vazia.hidden = visiveis.length !== 0;
  el.contador.textContent = visiveis.length === 0
    ? ""
    : "Mostrando " + visiveis.length + " de " + PRODUTOS.length + " produtos";
}

function limparTudo() {
  estado.busca = "";
  el.buscaCampo.value = "";
  definirCategoria("todos");
}

function configurarCatalogo() {
  criarBotoesDeFiltro();

  el.buscaCampo.addEventListener("input", function () {
    estado.busca = el.buscaCampo.value;
    atualizarCatalogo();
  });

  // Enter no campo não deve recarregar a página
  el.buscaForm.addEventListener("submit", function (evento) {
    evento.preventDefault();
  });

  el.buscaLimpar.addEventListener("click", function () {
    limparTudo();
    el.buscaCampo.focus();
  });
  el.mostrarTodos.addEventListener("click", limparTudo);

  // Clicar em uma categoria da seção de cartões já filtra o catálogo
  document.querySelectorAll(".categoria[data-categoria]").forEach(function (link) {
    link.addEventListener("click", function () {
      estado.busca = "";
      el.buscaCampo.value = "";
      definirCategoria(link.dataset.categoria);
    });
  });

  atualizarCatalogo();
}

/* ---------- 10. Imagens com alternativa ---------- */
function carregarImagens() {
  document.querySelectorAll("img[data-img]").forEach(function (img) {
    const url = IMAGENS[img.dataset.img];
    // Se a imagem falhar, escondemos o ícone quebrado e o fundo alternativo (CSS) aparece
    img.addEventListener("error", function () {
      img.classList.add("imagem-falhou");
    });
    if (url) {
      img.src = url;
    } else {
      img.classList.add("imagem-falhou");
    }
  });
}

/* ---------- 11. Início ---------- */
function iniciar() {
  el.ano.textContent = new Date().getFullYear();
  configurarMenu();
  configurarMapa();
  ligarBotoesWhatsApp();
  configurarCatalogo();
  carregarImagens();
}

// O script usa "defer", então o HTML já está pronto; por segurança, conferimos.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}