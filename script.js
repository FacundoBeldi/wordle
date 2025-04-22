const selectedCategory = localStorage.getItem('selectedCategory');
const categoryTitle = document.getElementById('category-title');
const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const messageDiv = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const historyDiv = document.getElementById('history');

let currentGuess = "";
let currentRow = 0;
let word = "";
let maxLength = 0;
let gameOver = false;

if (selectedCategory && words[selectedCategory]) {
  categoryTitle.textContent = `Categoría: ${selectedCategory.toUpperCase()}`;
  word = words[selectedCategory][Math.floor(Math.random() * words[selectedCategory].length)].toLowerCase();
  maxLength = word.length;
  createBoard();
  createKeyboard();
  updateHistory();
}

function createBoard() {
  board.innerHTML = "";
  board.style.gridTemplateRows = `repeat(6, 1fr)`;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.className = "row";
    row.dataset.index = i;
    row.style.gridTemplateColumns = `repeat(${maxLength}, 1fr)`;
    for (let j = 0; j < maxLength; j++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function createKeyboard() {
  keyboard.innerHTML = "";
  const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
  keys.forEach(k => {
    const btn = document.createElement("button");
    btn.textContent = k;
    btn.className = "key";
    btn.onclick = () => addLetter(k);
    keyboard.appendChild(btn);
  });

  const enter = document.createElement("button");
  enter.textContent = "Enter";
  enter.className = "key";
  enter.onclick = submitGuess;
  keyboard.appendChild(enter);

  const del = document.createElement("button");
  del.textContent = "←";
  del.className = "key";
  del.onclick = deleteLetter;
  keyboard.appendChild(del);
}

function addLetter(letter) {
  if (currentGuess.length < maxLength && !gameOver) {
    currentGuess += letter.toLowerCase();
    updateBoard();
  }
}

function deleteLetter() {
  if (currentGuess.length > 0 && !gameOver) {
    currentGuess = currentGuess.slice(0, -1);
    updateBoard();
  }
}

function updateBoard() {
  const row = board.children[currentRow];
  for (let i = 0; i < maxLength; i++) {
    row.children[i].textContent = currentGuess[i] || "";
  }
}

function submitGuess() {
  if (gameOver || currentGuess.length !== maxLength) return;

  const row = board.children[currentRow];
  const guessArray = currentGuess.split("");
  const wordArray = word.split("");

  guessArray.forEach((letter, i) => {
    const tile = row.children[i];
    tile.classList.add("animate");
    if (letter === word[i]) {
      tile.classList.add("correct");
    } else if (word.includes(letter)) {
      tile.classList.add("present");
    } else {
      tile.classList.add("absent");
    }
  });

  if (currentGuess === word) {
    messageDiv.textContent = "¡Correcto!";
    saveToHistory(true);
    gameOver = true;
    restartBtn.classList.remove("hidden");
  } else {
    currentRow++;
    currentGuess = "";
    if (currentRow === 6) {
      messageDiv.textContent = `Perdiste. La palabra era: ${word.toUpperCase()}`;
      saveToHistory(false);
      gameOver = true;
      restartBtn.classList.remove("hidden");
    }
  }
}

function saveToHistory(won) {
  const item = {
    category: selectedCategory,
    word: word,
    result: won ? "✔️" : "❌",
    date: new Date().toLocaleString()
  };
  const history = JSON.parse(localStorage.getItem("wordle-history") || "[]");
  history.unshift(item);
  localStorage.setItem("wordle-history", JSON.stringify(history));
  updateHistory();
}

function updateHistory() {
  const history = JSON.parse(localStorage.getItem("wordle-history") || "[]");
  historyDiv.innerHTML = `<h4>Historial</h4>` + history.slice(0, 5).map(h =>
    `<div>${h.date} - ${h.category.toUpperCase()} - ${h.result} (${h.word})</div>`
  ).join("");
}

// Soporte teclado físico
window.addEventListener("keydown", e => {
  if (gameOver) return;
  const key = e.key.toUpperCase();
  if (/^[A-ZÑ]$/.test(key)) {
    addLetter(key);
  } else if (key === "ENTER") {
    submitGuess();
  } else if (key === "BACKSPACE") {
    deleteLetter();
  }
});

// Reproduce música de fondo basada en la categoría
const bgMusic = document.getElementById('background-music');
let musicSrc = '';

switch (selectedCategory) {
  case 'lol':
    musicSrc = 'lol.mp3';
    break;
  case 'cs':
    musicSrc = 'cs.mp3';
    break;
  case 'aranjuez':
    musicSrc = 'aran.mp3';
    break;
  default:
    musicSrc = 'music.mp3'; // fallback si hace falta
}

bgMusic.src = musicSrc;
bgMusic.play().catch(() => {
  // Algunos navegadores bloquean autoplay si no hay interacción
  console.log("Autoplay bloqueado, esperando interacción del usuario.");
});

// Música que persiste entre reinicios
window.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('background-music');

  if (!window.musicStarted) {
    music.play();
    window.musicStarted = true;
  }
});

//Boton musica
const music = document.getElementById('background-music');
  const muteBtn = document.getElementById('mute-btn');
  music.volume = 0.2; // volumen bajo por defecto

  function toggleMute() {
    music.muted = !music.muted;
    muteBtn.textContent = music.muted ? '🔇' : '🔊';
  }

  //Boton hacia atras

  function goBack() {
    window.musicStarted = false; // para que se reinicie en nueva categoría
    window.location.href = 'index.html';
  }