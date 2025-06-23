// Lista de animais
let animals = [
  { name: 'Cavalo', color: '#FFC107' },
  { name: 'Pinguim', color: '#03A9F4' },
  { name: 'Tigre', color: '#E91E63' },
  { name: 'Elefante', color: '#9C27B0' },
  { name: 'Aranha', color: '#E03316' },
  { name: 'Formiga', color: '#5BB027' },
];

let topLikes = [];
let topDislikes = [];
let ended = false;

let current = 0;
let offsetX = 0;
let votos = [];
let userId;
let comparando = false;
let porcentagemSimilaridade = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
  rectMode(CENTER);

  // Gera ou carrega user_id
  userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('user_id', userId);
  }
}

function draw() {
  background(255);

  if (comparando) {
    fill(0);
    textSize(24);
    text(`Você votou igual a ${porcentagemSimilaridade.toFixed(0)}% das pessoas`, width / 2, height / 2);
    return;
  }

  if (current >= animals.length) {
if (current >= animals.length) {
    if (!ended) {
      ended = true;
      fetchTopVotes();
    }

    fill(0);
    textSize(24);
    text("Obrigada por votar!", width / 2, height / 2 - 50);

    // Mostra top 5
    textSize(18);
    let y = height / 2;

    text("Top 5 mais curtidos:", width / 2, y);
    topLikes.forEach((item, i) => {
      text(`${i + 1}. ${item.animal} (${item.total})`, width / 2, y + (i + 1) * 20);
    });

    y += 160;
    text("Top 5 mais rejeitados:", width / 2, y);
    topDislikes.forEach((item, i) => {
      text(`${i + 1}. ${item.animal} (${item.total})`, width / 2, y + (i + 1) * 20);
    });

    return;
  }

  // Card seguinte
  if (current + 1 < animals.length) {
    push();
    let next = animals[current + 1];
    translate(width / 2, height / 2 + 10);
    fill(next.color);
    rect(0, 0, 300, 400, 20);
    fill(0);
    text(next.name, 0, 0);
    pop();
  }

  // Card atual
  let animal = animals[current];
  push();
  translate(width / 2 + offsetX, height / 2);
  rotate(radians(offsetX * 0.05));
  fill(animal.color);
  rect(0, 0, 300, 400, 20);
  fill(0);
  text(animal.name, 0, 0);
  pop();

  // Emoji feedback
  let threshold = 50;
  if (abs(offsetX) > threshold) {
    push();
    let alpha = map(abs(offsetX), threshold, 200, 0, 255, true);
    let size = map(abs(offsetX), threshold, 200, 32, 96, true);
    textSize(size);
    fill(offsetX > 0 ? color(0, 200, 0, alpha) : color(255, 0, 0, alpha));
    text(offsetX > 0 ? '❤️' : '❌', width / 2, height / 2 - 250);
    pop();
  }
}

function mouseDragged() {
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
}

function vote(direction) {
  let animalName = animals[current].name;

  fetch('https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/likes_and_dislikes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheGxybm50eHRldHhxcHhkeXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODIwMjQsImV4cCI6MjA2NjI1ODAyNH0.wHG2BHds5mTHo9VLBsqshG5pMTBAFCUmdKJMBKDsHpU',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheGxybm50eHRldHhxcHhkeXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODIwMjQsImV4cCI6MjA2NjI1ODAyNH0.wHG2BHds5mTHo9VLBsqshG5pMTBAFCUmdKJMBKDsHpU'
    },
    body: JSON.stringify({
      user_id: userId,
      animal: animalName,
      vote: direction === 'right' ? 'like' : 'dislike',
      timestamp: new Date().toISOString()
    })
  })
  .then(res => res.text())
  .then(() => {
    offsetX = 0;
    current++;
  })
  .catch(err => {
    console.error("Erro ao enviar voto:", err);
  });
}

function compararComOutros() {
  fetch('https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/likes_and_dislikes', {
    method: 'GET',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheGxybm50eHRldHhxcHhkeXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODIwMjQsImV4cCI6MjA2NjI1ODAyNH0.wHG2BHds5mTHo9VLBsqshG5pMTBAFCUmdKJMBKDsHpU',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheGxybm50eHRldHhxcHhkeXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODIwMjQsImV4cCI6MjA2NjI1ODAyNH0.wHG2BHds5mTHo9VLBsqshG5pMTBAFCUmdKJMBKDsHpU'
  })
  .then(res => res.json())
  .then(data => {
    let meusVotos = data.filter(v => v.user_id === userId);
    let outros = data.filter(v => v.user_id !== userId);

    let iguais = 0;
    meusVotos.forEach(meu => {
      let votosAnimal = outros.filter(v => v.animal === meu.animal);
      if (votosAnimal.length === 0) return;

      let likes = votosAnimal.filter(v => v.vote === 'like').length;
      let dislikes = votosAnimal.filter(v => v.vote === 'dislike').length;
      let maioria = likes >= dislikes ? 'like' : 'dislike';

      if (meu.vote === maioria) iguais++;
    });

    porcentagemSimilaridade = (iguais / meusVotos.length) * 100;
    comparando = true;
  })
  .catch(err => console.error("Erro ao comparar votos:", err));
}


function fetchTopVotes() {
  // Likes
  fetch("https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/rpc/top_likes", {
    method: 'POST',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheGxybm50eHRldHhxcHhkeXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODIwMjQsImV4cCI6MjA2NjI1ODAyNH0.wHG2BHds5mTHo9VLBsqshG5pMTBAFCUmdKJMBKDsHpU',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheGxybm50eHRldHhxcHhkeXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODIwMjQsImV4cCI6MjA2NjI1ODAyNH0.wHG2BHds5mTHo9VLBsqshG5pMTBAFCUmdKJMBKDsHpU',    }
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  })
  .then(res => res.json())
  .then(data => {
    topLikes = data;
    console.log("Mais curtidos:", topLikes);
  });

  // Dislikes
  fetch("https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/rpc/top_dislikes", {
    method: 'POST',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheGxybm50eHRldHhxcHhkeXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODIwMjQsImV4cCI6MjA2NjI1ODAyNH0.wHG2BHds5mTHo9VLBsqshG5pMTBAFCUmdKJMBKDsHpU',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheGxybm50eHRldHhxcHhkeXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODIwMjQsImV4cCI6MjA2NjI1ODAyNH0.wHG2BHds5mTHo9VLBsqshG5pMTBAFCUmdKJMBKDsHpU',    }
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  })
  .then(res => res.json())
  .then(data => {
    topDislikes = data;
    console.log("Mais rejeitados:", topDislikes);
  });
}
