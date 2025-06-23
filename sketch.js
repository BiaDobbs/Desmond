let animals = [
  { name: 'Cavalo', color: '#FFC107' },
  { name: 'Pinguim', color: '#03A9F4' },
  { name: 'Tigre', color: '#E91E63' },
  { name: 'Elefante', color: '#9C27B0' },
  { name: 'Aranha', color: '#E03316' },
  { name: 'Formiga', color: '#5BB027' },
];
let current = 0;
let offsetX = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
  rectMode(CENTER);
}

function draw() {
  background(255);

  if (current >= animals.length) {
    fill(0);
    textSize(24);
    text("Obrigada por votar!", width / 2, height / 2);
    return;
  }

// Draw next card
  if (current + 1 < animals.length) {
    push();
    let next = animals[current + 1];
    translate(width / 2, height / 2 + 10);
    //scale(0.95);
    fill(next.color);
    rect(0, 0, 300, 400, 20);
    fill(0);
    text(next.name, 0, 0);
    pop();
  }

  // Draw current card
  let animal = animals[current];
  push();
  translate(width / 2 + offsetX, height / 2);
  rotate(radians(offsetX * 0.05));
  fill(animal.color);
  rect(0, 0, 300, 400, 20);
  fill(0);
  text(animal.name, 0, 0);
  pop();

  // Draw swipe feedback emoji
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
  console.log(`Você votou ${direction} em ${animalName}`);

  // Envia para Supabase
  fetch('https://baxlrnntxtetxqpxdyyx.supabase.co/rest/v1/likes_and_dislikes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheGxybm50eHRldHhxcHhkeXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODIwMjQsImV4cCI6MjA2NjI1ODAyNH0.wHG2BHds5mTHo9VLBsqshG5pMTBAFCUmdKJMBKDsHpU',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheGxybm50eHRldHhxcHhkeXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODIwMjQsImV4cCI6MjA2NjI1ODAyNH0.wHG2BHds5mTHo9VLBsqshG5pMTBAFCUmdKJMBKDsHpU'
    },
    body: JSON.stringify({
      animal: animalName,
      vote: direction === 'right' ? 'like' : 'dislike',
      timestamp: new Date().toISOString()
    })
  })
  .then(res => {
    if (!res.ok) throw new Error('Erro ao enviar voto');
    return res.json();
  })
  .then(data => {
    console.log("Voto salvo com sucesso:", data);
  })
  .catch(err => {
    console.error("Erro ao enviar voto:", err);
  });

  offsetX = 0;
  current++;
}
