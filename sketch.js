let modoDev = false; // pular votação
let tela = "votacao"; // votacao, sugestao ou resultado

let coresGenially = [
  "#F8F4E8",
  "#EDE7CF",
  "#D2D4C9",
  "#A0B6C1",
  "#1A0D72",
  "#2E227C",
  "#51468D",
  "#C0B9ED",
];
let borderColor = "#1A0D72";
let backgroundColor = "#F8F4E8";
let textColor = "#1A0D72";

let gradienteFundo;

let videoLike, videoDislike;
let videoEmExibicao = false;

/*

*/

// Lista de animais
let animals = [
  {
    nameComum: "Cavalo",
    nameCientifico: "Equus caballus",
    foto: "Spirit.jpeg",
    curiosidade:
      "Um cavalo real foi levado para o estúdio da DreamWorks como modelo para o Spirit.",
    tags: ["Mamífero", "Herbívoro", "Savanas"],
  },
  {
    nameComum: "Pinguim",
    nameCientifico: "Aptenodytes forsteri",
    foto: "Pingu.jpg",
    curiosidade:
      "O stop motion de Pingu foi animado em claynimation e a linguagem dele é completamente inventada.",
    tags: ["Ave", "Carnívoro", "Antártida"],
  },
  {
    nameComum: "Tigre",
    nameCientifico: "Panthera tigris",
    foto: "Tigger.jpg",
    curiosidade:
      "A voz original de Tigrão foi feita por Paul Winchell, que também era ventríloquo e inventor.",
    tags: ["Mamífero", "Carnívoro", "Floresta"],
  },
  {
    nameComum: "Elefante",
    nameCientifico: "Loxodonta africana",
    foto: "Dumbo.jpg",
    curiosidade:
      "Dumbo quase não tem falas no filme – ele se expressa só com gestos e expressões faciais.",
    tags: ["Mamífero", "Herbívoro", "Savanas"],
  },
  {
    nameComum: "Aranha",
    nameCientifico: "Araneae",
    foto: "MissSpider.jpg",
    curiosidade:
      "Em 'James e o Pêssego Gigante', Miss Spider foi inspirada nas aranhas saltadoras, que enxergam muito bem.",
    tags: ["Aracnídeo", "Carnívoro", "Floresta"],
  },
  {
    nameComum: "Formiga",
    nameCientifico: "Formicidae",
    foto: "Flik.jpg",
    curiosidade:
      "A equipe de 'Vida de Inseto' estudou o comportamento de formigas de verdade para deixar o filme mais realista.",
    tags: ["Inseto", "Onívoro", "Floresta"],
  },
];

let col1 = 2; // o y de cada coluna

const KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheGxybm50eHRldHhxcHhkeXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODIwMjQsImV4cCI6MjA2NjI1ODAyNH0.wHG2BHds5mTHo9VLBsqshG5pMTBAFCUmdKJMBKDsHpU";
const KEY_BEARER = "Bearer " + KEY;

let topLikes = [];
let topDislikes = [];
let ended = false;

let paises = [];
let bandeiras = {};

let current = 0;
let offsetX = 0;
let votos = [];
let userId;
let comparando = false;
let porcentagemSimilaridade = 0;

let countryCode = null; // começa como null para evitar "unknown"

let superLikeActive = false; // controla se a caixa de texto está aberta para super like
let superDislikeActive = false; // mesma coisa para super dislike
let justificativaTexto = ""; // texto digitado na justificativa
let superLikesCount = 0;
let superDislikesCount = 0;

let caixaInput;
let botaoEnviar;
let tipoSuper = null;
let caixaJustificativaVisivel = false;

let topSuperLikes = [];
let topSuperDislikes = [];

let sugestaoInicializada = false;

let inputFavorito, inputOdiado;
let botaoPular;
let mensagemSucesso = false;
let tempoMensagemSucesso = 0;

let enviadoFavorito = false;
let enviadoOdiado = false;

function preload() {
  fetchPaises();
  animals.forEach((animal) => {
    animal.img = loadImage(animal.foto);
  });

  videoLike = createVideo(
    "https://cdn.pixabay.com/video/2018/03/28/15240-262569955_large.mp4"
  );
  videoLike.hide();
  videoLike.elt.style.zIndex = "99999";

  videoDislike = createVideo(
    "https://cdn.pixabay.com/video/2023/07/02/169797-841740222_large.mp4"
  );
  videoDislike.hide();
  videoDislike.elt.style.zIndex = "99999";
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
  rectMode(CENTER);

  userId = localStorage.getItem("user_id");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("user_id", userId);
  }

  // Pega o país e só aí atribui o countryCode
  fetch("https://ipapi.co/json/")
    .then((res) => res.json())
    .then((data) => {
      if (data && data.country_code) {
        countryCode = data.country_code;
      } else {
        countryCode = null; // fallback
      }
    })
    .catch(() => {
      countryCode = null; // fallback em caso de erro
    });

  if (modoDev) {
    tela = "resultado";
    ended = true;
    fetchTopVotes();
    fetchPaises();
    fetchTopSuperVotes();
  }

  //gradienteFundo = createGraphics(windowWidth, windowHeight);
  //gerarGradiente(gradienteFundo);

  caixaInput = createInput();
  caixaInput.class("input-caixa");
  caixaInput.size(400, 100);
  caixaInput.position(width / 2 - caixaInput.width / 2, height / 2 - 40);
  caixaInput.hide();

  botaoEnviar = createButton("Enviar");
  botaoEnviar.class("botao-enviar");
  botaoEnviar.position(width / 2 + 120, height / 2 + 100);
  botaoEnviar.mousePressed(enviarJustificativa);
  botaoEnviar.hide();

  botaoCancelar = createButton("Cancelar");
  botaoCancelar.class("botao-cancelar");
  botaoCancelar.position(width / 2 - 180, height / 2 + 100);
  botaoCancelar.mousePressed(cancelarJustificativa);
  botaoCancelar.hide();
  
  console.log('Canvas size:', width, height);
console.log('Window size:', windowWidth, windowHeight);

}

function draw() {
  //image(gradienteFundo, 0, 0, width, height);
  drawGradientBackground()

  if (videoEmExibicao) {
    imageMode(CORNER);
    image(videoEmExibicao, 0, 0, width, height);
    return; // pausa o resto do draw enquanto o vídeo passa
  }

  //drawGrid();

  if (tela === "votacao") {
    rectMode(CENTER);
    desenharVotacao();
  } else if (tela === "sugestao") {
    rectMode(CENTER);
    desenharSugestaoFinal();
  } else if (tela === "resultado") {
    rectMode(CORNER);
    compararComOutros();
    desenharResultados();
  }

  if (caixaJustificativaVisivel) {
    let cardWidth = 600;
    let cardHeight = 350;
    let tituloAltura = 60;
    let tituloLargura = cardWidth * 0.7;

    let cx = width / 2;
    let cy = height / 2;

    push();
    translate(cx, cy);

    // Fundo do card (bege claro)
    fill("#F8F4E8");
    stroke("#1A0D72");
    strokeWeight(2);
    rect(0, 0, cardWidth, cardHeight);

    // Faixa azul escura no topo
    fill("#1A0D72");

    let tituloOffsetY = -cardHeight / 2 - 20 + tituloAltura / 3.5;
    rect(0, tituloOffsetY, tituloLargura, tituloAltura);

    // Texto do título
    noStroke();
    fill("#C0B9ED");
    textStyle(BOLD);
    textSize(45);
    textAlign(CENTER, CENTER);
    text(
      tipoSuper === "like" ? "Super Like 💖" : "Super Dislike 💔",
      0,
      tituloOffsetY
    );

    //texto de confirmação
    textStyle(NORMAL);
    textSize(20);
    fill("#1A0D72");
    textAlign(CENTER, TOP);
    textWrap(WORD);

    let restantes =
      tipoSuper === "like" ? 3 - superLikesCount : 3 - superDislikesCount;

    let textoConfirmacao =
      (tipoSuper === "like"
        ? "Conta mais sobre o que você ✨Super Like✨ nesse animal!"
        : "Conta mais sobre o que você ⚡Super Dislike⚡ nesse animal!") +
      `\nMas pense bem antes de confirmar, você só tem mais \n ${restantes}` +
      (tipoSuper === "like" ? " Super Likes" : " Super Dislikes") +
      " disponíveis!";

    let textoY = tituloOffsetY + 30;
    text(textoConfirmacao, -cardWidth / 2 + 300, textoY + 20, cardWidth - 20);

    pop();
  }
}

function mouseDragged() {
  if (caixaJustificativaVisivel) return;
  offsetX += mouseX - pmouseX;
}

function mouseReleased() {
  if (offsetX > 150) {
    vote("right");
  } else if (offsetX < -150) {
    vote("left");
  } else {
    offsetX = 0;
  }

  if (tela !== "votacao") return;

  let btnSize = 80;
  let btnY = height / 2 + 600 / 2 - 20; // match com desenharCard (cardHeight / 2 - 20)
  let btnOffsetX = 320;

  // Verifica clique Super Like
  if (
    mouseX >= width / 2 - btnOffsetX - btnSize / 2 &&
    mouseX <= width / 2 - btnOffsetX + btnSize / 2 &&
    mouseY >= btnY - btnSize / 2 &&
    mouseY <= btnY + btnSize / 2 &&
    superLikesCount < 3
  ) {
    superLikeActive = true;
    mostrarCaixaJustificativa("like");

    return;
  }

  // Verifica clique Super Dislike
  if (
    mouseX >= width / 2 + btnOffsetX - btnSize / 2 &&
    mouseX <= width / 2 + btnOffsetX + btnSize / 2 &&
    mouseY >= btnY - btnSize / 2 &&
    mouseY <= btnY + btnSize / 2 &&
    superDislikesCount < 3
  ) {
    superDislikeActive = true;
    mostrarCaixaJustificativa("dislike");
    return;
  }
}

/*function gerarGradiente(pg) {
  pg.loadPixels();

  let c1 = color("#F8F4E8");
  let c2 = color("#5B7C8C");

  for (let y = 0; y < pg.height; y++) {
    for (let x = 0; x < pg.width; x++) {
      let d = (x + (pg.height - y)) / (pg.width + pg.height);

      let cutoff = 0.3;
      let n = d < cutoff ? 0 : pow(map(d, cutoff, 1, 0, 1), 1.5);

      let col = lerpColor(c1, c2, n);

      let index = (x + y * pg.width) * 4;
      pg.pixels[index + 0] = red(col);
      pg.pixels[index + 1] = green(col);
      pg.pixels[index + 2] = blue(col);
      pg.pixels[index + 3] = 255;
    }
  }

  pg.updatePixels();
}*/

function drawGradientBackground() {
  let ctx = drawingContext; // contexto 2D do canvas p5.js
  let grad = ctx.createLinearGradient(0, 0, width, height);

  grad.addColorStop(0, '#F8F4E8'); // cor clara
  grad.addColorStop(1, '#5B7C8C'); // cor escura

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

function desenharCaixaComFaixaTitulo(x, y, w, h, titulo) {
  // Caixa principal
  fill(backgroundColor);
  stroke(borderColor);
  strokeWeight(2);
  rect(x, y, w, h); // rectMode padrão (CORNER)

  // Faixa azul do título
  let faixaAltura = 40;
  let faixaLargura = textWidth(titulo) + 40;
  let faixaX = x + (w - faixaLargura) / 2;
  let faixaY = y - faixaAltura / 2; // corrigido: baseado em canto superior da caixa

  fill(borderColor);
  noStroke();
  rect(faixaX, faixaY, faixaLargura, faixaAltura);

  // Texto do título
  fill("#C0B9ED");
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(titulo, x + w / 2, faixaY + faixaAltura / 2);
  textStyle(NORMAL);
}

// ------ VOTAÇÃO ----- //

function desenharVotacao() {
  if (comparando) {
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(
      `Você votou igual a ${porcentagemSimilaridade.toFixed(0)}% das pessoas`,
      width / 2,
      height / 2
    );
    return;
  }

  if (current >= animals.length) {
    tela = "resultado";
    fetchTopVotes();
    fetchPaises();
    fetchTopSuperVotes();
    return;
  }

  if (current + 1 < animals.length) {
    push();
    let next = animals[current + 1];
    translate(width / 2, height / 2);
    desenharCard(next);
    pop();
  }

  let animal = animals[current];
  push();
  translate(width / 2 + offsetX, height / 2);
  rotate(radians(offsetX * 0.05));
  desenharCard(animal);
  pop();

  let threshold = 50;
  if (abs(offsetX) > threshold) {
    push();
    let alpha = map(abs(offsetX), threshold, 200, 0, 255, true);
    let size = map(abs(offsetX), threshold, 200, 32, 96, true);
    textSize(size);
    fill(offsetX > 0 ? color(0, 200, 0, alpha) : color(255, 0, 0, alpha));
    textAlign(CENTER, CENTER);
    text(offsetX > 0 ? "❤️" : "❌", width / 2, height / 2 - 380);
    pop();
  }
}

function desenharCard(animal) {
  let cardWidth = width * 0.4;
  let cardHeight = height * 0.6;
  let tituloAltura = cardHeight * 0.13;
  let tituloLargura = cardWidth * 0.7;

  push();
  rectMode(CORNER);
  fill("#F8F4E8");
  stroke("#1A0D72");
  strokeWeight(2);

  let extraAltura = cardHeight * 0.13;
  rect(
    -cardWidth / 2,
    -cardHeight / 2 + tituloAltura / 2,
    cardWidth,
    cardHeight + extraAltura
  );
  pop();

  // Título
  fill("#1A0D72");
  stroke("#1A0D72");
  strokeWeight(2);
  rect(0, -cardHeight / 2 + tituloAltura / 2, tituloLargura, tituloAltura);

  noStroke();
  fill("#C0B9ED");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(tituloAltura * 0.5);
  text(animal.nameComum, 0, -cardHeight / 2 + tituloAltura / 2);

  // Imagem
  if (animal.img) {imageMode(CENTER);
    let imagemAltura = cardHeight * 0.6;
    let imagemY = (-cardHeight * 0.05) / 2; // um pequeno ajuste para centralizar melhor
    image(animal.img, 0, imagemY, cardWidth * 0.85, imagemAltura);
  }

  // Nome científico
  textStyle(ITALIC);
  textSize(cardHeight * 0.04);
  text(animal.nameCientifico, 0, cardHeight / 2 - cardHeight * 0.15);

  // Fun fact
  textStyle(NORMAL);
  textAlign(CENTER, TOP);
  textWrap(WORD);
  fill("#1A0D72");

  let curiosidadeY = cardHeight / 2 - cardHeight * 0.11;
  let curiosidadeWidth = cardWidth * 0.88;
  textSize(cardHeight * 0.035);
  text(animal.curiosidade || "", 0, curiosidadeY, curiosidadeWidth);

  // Botões
  let btnSize = min(width, height) * 0.08;
  let btnY = cardHeight / 2 - btnSize / 2;
  let btnOffsetX = cardWidth * 0.6;

  stroke("#1A0D72");
  strokeWeight(2);

  if (superDislikesCount < 3) {
    fill(superDislikeActive ? "#E97474" : "#F1A3A3");
    rect(-btnOffsetX, btnY, btnSize, btnSize);
    noStroke();
    fill("#1A0D72");
    textSize(btnSize * 0.25);
    textAlign(CENTER, TOP);
    text(`x ${3 - superDislikesCount}`, -btnOffsetX, btnY + btnSize / 2 + 5);
  }

  if (superLikesCount < 3) {
    stroke("#1A0D72");
    fill(superLikeActive ? "#A0D468" : "#D0E6A5");
    rect(btnOffsetX, btnY, btnSize, btnSize);
    noStroke();
    fill("#1A0D72");
    textSize(btnSize * 0.25);
    textAlign(CENTER, TOP);
    text(`x ${3 - superLikesCount}`, btnOffsetX, btnY + btnSize / 2 + 5);
  }

  // Tags
if (animal.tags && animal.tags.length > 0) {
  let tagBoxW = cardWidth * 0.2;
  let tagBoxH = cardHeight * 0.07;
  let tagSpacing = tagBoxW + cardWidth * 0.05;
  let tagsY = cardHeight / 2 + tagBoxH;

  let startX = -((animal.tags.length - 1) * tagSpacing) / 2;

  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(cardHeight * 0.03);
  fill("#1A0D72");
  noStroke();

  animal.tags.forEach((tag, i) => {
    let tagX = startX + i * tagSpacing;
    fill("#1A0D72");
    rect(tagX, tagsY, tagBoxW, tagBoxH, tagBoxH * 0.25); // borda arredondada proporcional
    fill("#C0B9ED");
    text(tag, tagX, tagsY);
  });
}

}



function vote(direction) {
  let animalName = animals[current].nameComum;

  // Só envia o voto se countryCode já estiver definido e válido
  if (!countryCode) {
    console.warn("País desconhecido - voto não enviado.");
    offsetX = 0;
    current++;
    return;
  }

  fetch("https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/likes_and_dislikes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: KEY,
      Authorization: KEY_BEARER,
    },
    body: JSON.stringify({
      user_id: userId,
      animal: animalName,
      vote: direction === "right" ? "like" : "dislike",
      country: countryCode,
      timestamp: new Date().toISOString(),
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao enviar voto");
      offsetX = 0;
      current++;
    })
    .catch((err) => {
      console.error("Erro ao enviar voto:", err);
      // Mesmo se erro, avança para próximo animal para não travar
      offsetX = 0;
      current++;
    });
}

function mostrarCaixaJustificativa(tipo) {
  tipoSuper = tipo;

  caixaInput.value("");

  caixaInput.show();
  botaoEnviar.show();
  botaoCancelar.show();
  caixaJustificativaVisivel = true;
}

function enviarJustificativa() {
  let texto = caixaInput.value().trim();
  if (texto.length === 0) return;

  let currentAnimal = animals[current];
  if (!currentAnimal) return;

  const tipoAtual = tipoSuper; // salva antes de resetar
  const videoAtual = tipoAtual === "like" ? videoLike : videoDislike;

  fetch("https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/super_votes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: KEY,
      Authorization: KEY_BEARER,
    },
    body: JSON.stringify({
      user_id: userId,
      animal: currentAnimal.nameComum,
      tipo: tipoAtual,
      motivo: texto,
      country: countryCode,
      timestamp: new Date().toISOString(),
    }),
  }).then(() => {
    // Atualiza contadores
    if (tipoAtual === "like") {
      superLikesCount++;
      superLikeActive = false;
    } else {
      superDislikesCount++;
      superDislikeActive = false;
    }

    // Limpa interface
    tipoSuper = null;
    caixaInput.hide();
    botaoEnviar.hide();
    botaoCancelar.hide();
    caixaJustificativaVisivel = false;

    // Mostra animação
    videoAtual.show();
    videoAtual.loop();
    videoEmExibicao = videoAtual;

    // Depois de 2.5s, esconde e avança
    setTimeout(() => {
      videoAtual.stop();
      videoAtual.hide();
      videoEmExibicao = false;
      offsetX = 0;
      current++;
    }, 2500);
  });
}

function cancelarJustificativa() {
  tipoSuper = null;
  superLikeActive = false;
  superDislikeActive = false;

  caixaInput.hide();
  botaoEnviar.hide();
  botaoCancelar.hide();

  caixaJustificativaVisivel = false;
}

// ---- INPUT ANIMAIS ---- //

let botaoSim = null;
let botaoNao = null;

function desenharSugestaoFinal() {
  if (!sugestaoInicializada) {
    // Criar inputs e botões
    inputFavorito = createInput("");
    //inputFavorito.attribute("placeholder", "Qual é o seu animal favorito?");
    inputFavorito.position(width / 2 - 425, height / 2 + 60);
    inputFavorito.size(300, 50);
    inputFavorito.class("input-padrao");

    inputOdiado = createInput("");
    //inputOdiado.attribute("placeholder", "Qual é o animal que você menos gosta?");
    inputOdiado.position(width / 2 + 130, height / 2 + 60);
    inputOdiado.size(300, 50);
    inputOdiado.class("input-padrao");

    botaoEnviarFavorito = createButton("Enviar favorito");
    botaoEnviarFavorito.position(width / 2 - 360, height / 2 + 150);
    botaoEnviarFavorito.class("botao-padrao");
    botaoEnviarFavorito.mousePressed(enviarFavorito);

    botaoEnviarOdiado = createButton("Enviar odiado");
    botaoEnviarOdiado.position(width / 2 + 210, height / 2 + 150);
    botaoEnviarOdiado.class("botao-padrao");
    botaoEnviarOdiado.mousePressed(enviarOdiado);

    botaoPular = createButton("Não quero escrever, pular para os resultados");
    botaoPular.position(width / 2 - 200, height / 2 + 300);
    botaoPular.class("botao-padrao");
    botaoPular.mousePressed(() => {
      pularSugestaoFinal();
    });

    sugestaoInicializada = true;
    mensagemSucesso = false;
  }

  push();

  const caixaW = 360;
  const caixaH = 360;
  const espacamentoX = 100;

  // Favorito
  const x1 = width / 2 - caixaW / 2 - espacamentoX;
  const y1 = height / 2 + 40;

  stroke("#1A0D72");
  strokeWeight(2);
  fill("#F8F4E8");
  rect(x1, y1, caixaW, caixaH);

  // Título favorito
  fill("#1A0D72");
  noStroke();
  rect(x1, y1 - caixaH / 2, 300, 50);

  fill("#C0B9ED");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(22);
  text("Animal que Mais Gosta", x1, y1 - caixaH / 2);

  // Texto explicativo
  textStyle(NORMAL);
  fill("#1A0D72");
  textAlign(CENTER, TOP);
  textSize(20);
  text(
    "Para terminar, quer falar o animal que você mais gosta? Pode ser algum que não estava na lista!",
    x1,
    y1 - 120,
    300
  );

  // Odiado
  const x2 = width / 2 + caixaW / 2 + espacamentoX;
  const y2 = height / 2 + 40;

  stroke("#1A0D72");
  strokeWeight(2);
  fill("#F8F4E8");
  rect(x2, y2, caixaW, caixaH);

  fill("#1A0D72");
  noStroke();
  rect(x2, y2 - caixaH / 2, 300, 50);

  fill("#C0B9ED");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(22);
  text("Animal que Menos Gosta", x2, y2 - caixaH / 2);

  textStyle(NORMAL);
  fill("#1A0D72");
  textAlign(CENTER, TOP);
  textSize(20);
  text(
    "Para terminar, quer falar o animal que você menos gosta?\nPode ser algum que não estava na lista!",
    x2,
    y2 - 120,
    300
  );

  pop();

  desenharMensagemSucesso();
}

function enviarFavorito() {
  let texto = inputFavorito.value().trim();
  if (texto.length === 0) return;

  fetch("https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/sugestoes_animais", {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: KEY_BEARER,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      tipo: "favorito",
      sugestao: texto,
      timestamp: new Date().toISOString(),
    }),
  })
    .then(() => {
      enviadoFavorito = true;
      mensagemSucesso = "favorito";
      tempoMensagemSucesso = millis();
    })
    .catch((err) => {
      console.error("Erro ao enviar favorito:", err);
    });
}

function enviarOdiado() {
  let texto = inputOdiado.value().trim();
  if (texto.length === 0) return;

  fetch("https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/sugestoes_animais", {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: KEY_BEARER,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      tipo: "odiado",
      sugestao: texto,
      timestamp: new Date().toISOString(),
    }),
  })
    .then(() => {
      enviadoOdiado = true;
      mensagemSucesso = "odiado";
      tempoMensagemSucesso = millis();
    })
    .catch((err) => {
      console.error("Erro ao enviar odiado:", err);
    });
}

function desenharMensagemSucesso() {
  if (!mensagemSucesso) {
    if (botaoSim) botaoSim.hide();
    if (botaoNao) botaoNao.hide();
    return;
  }

  const caixaW = 500;
  const caixaH = 200;
  const x = width / 2;
  const y = height / 2 - caixaH / 2;

  // Caixa principal (retângulo bege)
  fill("#F8F4E8");
  stroke("#1A0D72");
  strokeWeight(2);
  rect(x, y, caixaW, caixaH);

  // Faixa azul do título no topo da caixa
  const faixaAltura = 40;
  fill("#1A0D72");
  noStroke();
  rect(x, y - faixaAltura * 2.5, caixaW - 100, faixaAltura);

  // Texto do título
  fill("#C0B9ED");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(20);
  text("Enviado com sucesso!", x, y - faixaAltura * 2.5, caixaW, faixaAltura);

  // Texto explicativo dentro da caixa
  textStyle(NORMAL);
  fill("#1A0D72");
  textAlign(CENTER, TOP);
  textSize(18);

  let textoExplicativo = "";
  if (mensagemSucesso === "favorito" && !enviadoOdiado) {
    textoExplicativo = "Quer nos contar também o animal que você menos gosta?";
  } else if (mensagemSucesso === "odiado" && !enviadoFavorito) {
    textoExplicativo = "Quer nos contar também o animal que você mais gosta?";
  } else {
    textoExplicativo = "Muito obrigado por compartilhar!";
  }

  text(textoExplicativo, x, y - 40, caixaW - 40);

  // Criar os botões Sim e Não se ainda não existirem
  if (!botaoSim) {
    botaoSim = createButton("Sim");
    botaoSim.class("botao-padrao");
    botaoSim.style("z-index", "10");
    botaoSim.mousePressed(() => {
      mensagemSucesso = null;
      botaoSim.hide();
      botaoNao.hide();
    });
  }
  if (!botaoNao) {
    botaoNao = createButton("Não");
    botaoNao.class("botao-padrao");
    botaoNao.style("z-index", "10");
    botaoNao.mousePressed(() => {
      mensagemSucesso = null;
      sugestaoInicializada = false;
      inputFavorito.remove();
      inputOdiado.remove();
      botaoEnviarFavorito.remove();
      botaoEnviarOdiado.remove();
      botaoPular.remove();
      botaoSim.hide();
      botaoNao.hide();
      tela = "resultado";
      fetchTopVotes();
      fetchPaises();
      fetchTopSuperVotes();
    });
  }

  // Posicionar e mostrar botões somente se pergunta for necessária
  if (
    (mensagemSucesso === "favorito" && !enviadoOdiado) ||
    (mensagemSucesso === "odiado" && !enviadoFavorito)
  ) {
    botaoSim.position(x - 180, y + 20);
    botaoNao.position(x + 100, y + 20);
    botaoSim.show();
    botaoNao.show();
  } else {
    botaoSim.hide();
    botaoNao.hide();

    // Se não há pergunta, fecha automaticamente após 2 segundos
    if (millis() - tempoMensagemSucesso > 2000) {
      mensagemSucesso = null;
      sugestaoInicializada = false;
      inputFavorito.remove();
      inputOdiado.remove();
      botaoEnviarFavorito.remove();
      botaoEnviarOdiado.remove();
      botaoPular.remove();
      if (botaoSim) botaoSim.remove();
      if (botaoNao) botaoNao.remove();
      tela = "resultado";
      fetchTopVotes();
      fetchPaises();
      fetchTopSuperVotes();
    }
  }
}

function removerBotoesSimNao() {
  if (botaoSim) {
    botaoSim.remove();
    botaoSim = null;
  }
  if (botaoNao) {
    botaoNao.remove();
    botaoNao = null;
  }
}

function pularSugestaoFinal() {
  sugestaoInicializada = false;
  inputFavorito.remove();
  inputOdiado.remove();
  botaoEnviarFavorito.remove();
  botaoEnviarOdiado.remove();
  botaoPular.remove();
  removerBotoesSimNao();
  tela = "resultado";
  fetchTopVotes();
  fetchPaises();
  fetchTopSuperVotes();
}

// ---- RESULTADOS ---- //

function desenharResultados() {
  textAlign(CENTER, CENTER);
  textSize(50);
  fill("#1A0D72");
  text("Obrigada por votar!", (width * 3.9) / 8, (height * 1) / 8);

  if (porcentagemSimilaridade !== null && !isNaN(porcentagemSimilaridade)) {
    textSize(30);
    fill("#1A0D72");
    text(
      `Sua similaridade com os outros votos é de ${porcentagemSimilaridade.toFixed(
        1
      )}%`,
      (width * 3.9) / 8,
      (height * 1.4) / 8
    );
  }

  textSize(25);
  let boxPadding = 16;
  let boxWidth = (width * 2) / 8;
  let boxHeight = 200;

  // --- Caixa: Top Likes ---
  let box1X = (width * 0.5) / 8;
  let box1Y = (height * 2.2) / 8;
  desenharCaixaComFaixaTitulo(
    box1X,
    box1Y,
    boxWidth,
    boxHeight,
    "Top 5 mais curtidos:"
  );
  fill(textColor);
  noStroke();
  topLikes.forEach((item, i) => {
    text(
      item.animal + " (" + item.total + " votos )",
      box1X + boxWidth / 2,
      box1Y + boxPadding + 30 * (i + 1)
    );
  });

  // --- Caixa: Top Dislikes ---
  let box2X = (width * 3) / 8;
  let box2Y = box1Y;
  desenharCaixaComFaixaTitulo(
    box2X,
    box2Y,
    boxWidth,
    boxHeight,
    "Top 5 mais rejeitados:"
  );
  fill(textColor);
  noStroke();
  topDislikes.forEach((item, i) => {
    text(
      item.animal + " (" + item.total + " votos )",
      box2X + boxWidth / 2,
      box2Y + boxPadding + 30 * (i + 1)
    );
  });

  // --- Caixa: Votos por país ---
  let box3X = (width * 5.5) / 8;
  let box3Y = box1Y;
  let box3H = max(180, paises.length * 35 + 40);
  desenharCaixaComFaixaTitulo(box3X, box3Y, boxWidth, box3H, "Votos por país:");
  fill(textColor);
  noStroke();
  paises.forEach((p, i) => {
    let code = p.country ? p.country.toLowerCase() : "unknown";
    let flag = bandeiras[code] || bandeiras["unknown"];
    let linhaY = box3Y + boxPadding + 30 + i * 30;

    image(flag, box3X + boxWidth / 2 - 50, linhaY - 8, 32, 24);
    textAlign(LEFT, CENTER);
    text(`${p.country} (${p.total})`, box3X + boxWidth / 2 - 10, linhaY);
  });

  // --- Caixa: Super Votos ---
  let box4X = (width * 2) / 8;
  let box4Y = (height * 5.2) / 8;
  desenharCaixaComFaixaTitulo(
    box4X,
    box4Y,
    boxWidth * 1.5,
    boxHeight,
    "Top 5 Super Votados:"
  );

  fill(textColor);
  noStroke();
  textAlign(LEFT, CENTER);

  topSuperLikes.forEach((item, i) => {
    text(
      `💖 ${item.animal} (${item.total})`,
      box4X + 20,
      box4Y + boxPadding + 30 * (i + 1)
    );
  });

  topSuperDislikes.forEach((item, i) => {
    text(
      `💔 ${item.animal} (${item.total})`,
      box4X + boxWidth * 0.8,
      box4Y + boxPadding + 30 * (i + 1)
    );
  });

  textAlign(CENTER, CENTER); // restabelece alinhamento padrão
}

function compararComOutros() {
  fetch("https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/likes_and_dislikes", {
    method: "GET",
    headers: {
      apikey: KEY,
      Authorization: KEY_BEARER,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      let meusVotos = data.filter((v) => v.user_id === userId);
      let outros = data.filter((v) => v.user_id !== userId);

      let iguais = 0;
      meusVotos.forEach((meu) => {
        let votosAnimal = outros.filter((v) => v.animal === meu.animal);
        if (votosAnimal.length === 0) return;

        let likes = votosAnimal.filter((v) => v.vote === "like").length;
        let dislikes = votosAnimal.filter((v) => v.vote === "dislike").length;
        let maioria = likes >= dislikes ? "like" : "dislike";

        if (meu.vote === maioria) iguais++;
      });

      porcentagemSimilaridade = (iguais / meusVotos.length) * 100;
      comparando = true;
    })
    .catch((err) => console.error("Erro ao comparar votos:", err));
}

function fetchTopVotes() {
  fetch("https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/rpc/top_likes", {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: KEY_BEARER,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      topLikes = data;
    });

  fetch("https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/rpc/top_dislikes", {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: KEY_BEARER,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      topDislikes = data;
    });
}

function fetchPaises() {
  fetch(
    "https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/rpc/unique_voters_by_country",
    {
      method: "POST",
      headers: {
        apikey: KEY,
        Authorization: KEY_BEARER,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      paises = data;

      // Agora sim, carrega as bandeiras
      paises.forEach((p) => {
        let code = p.country.toLowerCase();
        bandeiras[code] = loadImage(`https://flagcdn.com/32x24/${code}.png`);
      });
    })
    .catch((err) => console.error("Erro ao buscar países:", err));
}

function fetchTopSuperVotes() {
  fetch(
    "https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/rpc/top_super_likes",
    {
      method: "POST",
      headers: {
        apikey: KEY,
        Authorization: KEY_BEARER,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({}), // ← ESSENCIAL
    }
  )
    .then((res) => res.json())
    .then((data) => {
      topSuperLikes = data;
    });

  fetch(
    "https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/rpc/top_super_dislikes",
    {
      method: "POST",
      headers: {
        apikey: KEY,
        Authorization: KEY_BEARER,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({}), // ← ESSENCIAL
    }
  )
    .then((res) => res.json())
    .then((data) => {
      topSuperDislikes = data;
    });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  //gradienteFundo = createGraphics(windowWidth, windowHeight);
  //gerarGradiente(gradienteFundo);
}

