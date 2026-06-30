const textDisplay = document.getElementById("textDisplay");
const textInput = document.getElementById("textInput");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const errorsEl = document.getElementById("errors");
const restartBtn = document.getElementById("restartBtn");
const timeButtons = document.querySelectorAll(".time-btn");
const resultCard = document.getElementById("resultCard");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalErrors = document.getElementById("finalErrors");
const bestScoreEl = document.getElementById("bestScore");
const resultMessage = document.getElementById("resultMessage");
let wordPool = [];
let visibleWords = [];

let correctWords = 0;
let wrongWords = 0;
let totalWords = 0;

let timeLeft = 60;
let selectedTime = 15;
let timer = null;
let isStarted = false;

const VISIBLE_COUNT = 24;

function shuffleWords(words) {
  return [...words].sort(() => Math.random() - 0.5);
}

function prepareWords() {
  wordPool = shuffleWords(kelimeler.map(word => word.toLowerCase()));
  visibleWords = wordPool.splice(0, VISIBLE_COUNT);
}

function renderWords() {
  textDisplay.innerHTML = "";

  visibleWords.forEach((word, index) => {
    const span = document.createElement("span");
    span.innerText = word;
    span.classList.add("word");

    if (index === 0) {
      span.classList.add("current");
    }

    textDisplay.appendChild(span);
  });
}

function startTimer() {
  if (isStarted) return;

  isStarted = true;

  timer = setInterval(() => {
    timeLeft--;
    timeEl.innerText = `${timeLeft}s`;

    updateStats();

    if (timeLeft <= 0) {
      finishTest();
    }
  }, 1000);
}

function checkWord() {
  const typedWord = textInput.value.trim().toLowerCase();
  const wordSpans = document.querySelectorAll(".word");
  const currentSpan = wordSpans[0];
  const currentWord = visibleWords[0];

  if (typedWord === "") {
    textInput.value = "";
    return;
  }

  totalWords++;

  currentSpan.classList.remove("current");

  if (typedWord === currentWord) {
    correctWords++;
    currentSpan.classList.add("correct");
  } else {
    wrongWords++;
    currentSpan.classList.add("wrong");
  }

  textInput.value = "";
  updateStats();

  setTimeout(() => {
    visibleWords.shift();

    if (wordPool.length > 0) {
      visibleWords.push(wordPool.shift());
    }

    renderWords();
  }, 180);
}

function updateStats() {
const elapsedTime = (selectedTime - timeLeft) / 60;

  const wpm = elapsedTime > 0 ? Math.round(correctWords / elapsedTime) : 0;

  const accuracy =
    totalWords > 0
      ? Math.round((correctWords / totalWords) * 100)
      : 100;

  wpmEl.innerText = wpm;
  accuracyEl.innerText = `${accuracy}%`;
  errorsEl.innerText = wrongWords;
}

function finishTest() {
  clearInterval(timer);
  timer = null;
  isStarted = false;
  textInput.disabled = true;

  updateStats();

  const finalScore = Number(wpmEl.innerText);
  const finalAcc = accuracyEl.innerText;

  let bestScore = Number(localStorage.getItem("bestScore")) || 0;

  if (finalScore > bestScore) {
    bestScore = finalScore;
    localStorage.setItem("bestScore", bestScore);
  }

  finalWpm.innerText = `${finalScore} WPM`;
  finalAccuracy.innerText = finalAcc;
  finalErrors.innerText = wrongWords;
  bestScoreEl.innerText = `${bestScore} WPM`;

  resultCard.style.display = "block";
  resultMessage.style.display = "block";
  resultMessage.scrollIntoView({
    behavior: "smooth",
    block: "center"
});
}

function resetTest() {
  clearInterval(timer);

  correctWords = 0;
  wrongWords = 0;
  totalWords = 0;

    timeLeft = selectedTime;
  timer = null;
  isStarted = false;

  textInput.value = "";
  textInput.disabled = false;

  timeEl.innerText = `${selectedTime}s`;
  wpmEl.innerText = "0";
  accuracyEl.innerText = "100%";
  errorsEl.innerText = "0";

  resultCard.style.display = "none";
  resultMessage.style.display = "none";
  prepareWords();
  renderWords();

  textInput.focus();
}

textInput.addEventListener("input", () => {
  startTimer();

  if (textInput.value.endsWith(" ")) {
    checkWord();
  }
});
timeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isStarted) return;

    timeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    selectedTime = Number(button.dataset.time);
    resetTest();
  });
});
restartBtn.addEventListener("click", resetTest);

window.addEventListener("load", () => {
  const bestScore = Number(localStorage.getItem("bestScore")) || 0;
  bestScoreEl.innerText = `${bestScore} WPM`;

  resetTest();
});
