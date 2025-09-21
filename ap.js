// DOM Elementleri
const startScreen = document.getElementById('startScreen');
const customScreen = document.getElementById('customScreen');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');

const startGameBtn = document.getElementById('startGameBtn');
const customBtn = document.getElementById('customBtn');
const backBtn = document.getElementById('backBtn');
const customStartBtn = document.getElementById('customStartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

// duraklatma
const pauseBtn = document.getElementById('pauseBtn');
const exitBtn = document.getElementById('exitBtn');
const pauseScreen = document.getElementById('pauseScreen');
const resumeBtn = document.getElementById('resumeBtn');
const restartBtn = document.getElementById('restartBtn');
const mainMenuBtn = document.getElementById('mainMenuBtn');
const pauseTimeDisplay = document.getElementById('pauseTimeDisplay');
const pauseScoreDisplay = document.getElementById('pauseScoreDisplay');

const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const gameArea = document.getElementById('gameArea');
const aim = document.getElementById('aim');
const timeDisplay = document.getElementById('timeDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const finalScore = document.getElementById('finalScore');
const highScoreAchievement = document.getElementById('highScoreAchievement');

// özelleştirme
const timeSlider = document.getElementById('timeSlider');
const timeValue = document.getElementById('timeValue');
const movementToggle = document.getElementById('movementToggle');
const movementValue = document.getElementById('movementValue');
const sizeSlider = document.getElementById('sizeSlider');
const sizeValue = document.getElementById('sizeValue');


let gameConfig = {
  time: 60,
  movement: false,
  size: 30
};

let gameState = {
  score: 0,
  timeLeft: 60,
  isPlaying: false,
  isPaused: false,
  selectedDifficulty: null,
  isCustom: false,
  movementInterval: null,
  gameTimer: null
};

let highScore = localStorage.getItem('aimGameHighScore') || 0;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
  highScoreDisplay.textContent = highScore;
  updateSliderValues();
  setupEventListeners();
});

//listenerlar
function setupEventListeners() {

  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => selectDifficulty(btn.dataset.level));
  });

  customBtn.addEventListener('click', showCustomScreen);
  
  backBtn.addEventListener('click', showStartScreen);
  
  startGameBtn.addEventListener('click', startGame);
  customStartBtn.addEventListener('click', startCustomGame);
  
  playAgainBtn.addEventListener('click', resetGame);
  
  pauseBtn.addEventListener('click', pauseGame);
  exitBtn.addEventListener('click', exitGame);
  resumeBtn.addEventListener('click', resumeGame);
  restartBtn.addEventListener('click', restartGame);
  mainMenuBtn.addEventListener('click', goToMainMenu);
  
  aim.addEventListener('click', hitTarget);
  
  timeSlider.addEventListener('input', updateTimeValue);
  sizeSlider.addEventListener('input', updateSizeValue);
  movementToggle.addEventListener('change', updateMovementValue);
}


function selectDifficulty(level) {

  difficultyBtns.forEach(btn => btn.classList.remove('selected'));
  document.querySelector(`[data-level="${level}"]`).classList.add('selected');
  
  switch(level) {
    case 'easy':
      gameConfig = { time: 60, movement: false, size: 35 };
      break;
    case 'medium':
      gameConfig = { time: 50, movement: false, size: 30 };
      break;
    case 'hard':
      gameConfig = { time: 40, movement: true, size: 25 };
      break;
  }
  
  gameState.selectedDifficulty = level;
  gameState.isCustom = false;
  startGameBtn.disabled = false;
}

//
function showCustomScreen() {
  startScreen.style.display = 'none';
  customScreen.style.display = 'flex';
  
  timeSlider.value = gameConfig.time;
  sizeSlider.value = gameConfig.size;
  movementToggle.checked = gameConfig.movement;
  
  updateSliderValues();
}

function showStartScreen() {
  customScreen.style.display = 'none';
  startScreen.style.display = 'flex';
}

function updateTimeValue() {
  gameConfig.time = parseInt(timeSlider.value);
  timeValue.textContent = `${gameConfig.time} saniye`;
}

function updateSizeValue() {
  gameConfig.size = parseInt(sizeSlider.value);
  sizeValue.textContent = `${gameConfig.size}px`;
}

function updateMovementValue() {
  gameConfig.movement = movementToggle.checked;
  movementValue.textContent = gameConfig.movement ? 'Hareketli' : 'Sabit';
}

function updateSliderValues() {
  updateTimeValue();
  updateSizeValue();
  updateMovementValue();
}

//oyun başlat butonu(hazır seviyede)
function startGame() {
  if (!gameState.selectedDifficulty) return;
  
  startScreen.style.display = 'none';
  gameScreen.style.display = 'flex';
  
  initializeGame();
}

// özel seviyeoyun başlat butonu
function startCustomGame() {
  gameState.isCustom = true;
  startScreen.style.display = 'none';
  customScreen.style.display = 'none';
  gameScreen.style.display = 'flex';
  
  initializeGame();
}

//başlatma fonksiyonu
function initializeGame() {
  gameState.score = 0;
  gameState.timeLeft = gameConfig.time;
  gameState.isPlaying = true;
  gameState.isPaused = false;
  
  aim.style.width = `${gameConfig.size}px`;
  aim.style.height = `${gameConfig.size}px`;
  

  updateDisplay();
  
  aim.style.display = 'block';
  placeTarget();

  if (gameConfig.movement) {
    startTargetMovement();
  } else {
    stopTargetMovement();
  }
  

  startTimer();
}

//hedef konumu
function placeTarget() {
  const maxX = gameArea.offsetWidth - gameConfig.size;
  const maxY = gameArea.offsetHeight - gameConfig.size;
  
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  
  aim.style.left = `${x}px`;
  aim.style.top = `${y}px`;
}

//harejetli hedef 
function startTargetMovement() {
  if (gameState.movementInterval) {
    clearInterval(gameState.movementInterval);
  }
  
  gameState.movementInterval = setInterval(() => {
    if (gameState.isPlaying) {
      moveTarget();
    }
  }, 50);
}

function stopTargetMovement() {
  if (gameState.movementInterval) {
    clearInterval(gameState.movementInterval);
    gameState.movementInterval = null;
  }
}

// hareket
function moveTarget() {
  const currentTop = parseInt(aim.style.top) || 0;
  const newTop = currentTop - 2;
  
  //hedef ekranın üstüne geldiğinde tekrar oluşması için
  if (newTop < -gameConfig.size) {
    placeTarget();
  } else {
    aim.style.top = `${newTop}px`;
  }
}


function hitTarget() {
  if (!gameState.isPlaying || gameState.isPaused) return;
  
  gameState.score += 1;
  updateDisplay();
  
  aim.classList.add('hit');
  setTimeout(() => aim.classList.remove('hit'), 300);
  
  placeTarget();
}

//yazı ve süre akışı
function updateDisplay() {
  timeDisplay.textContent = gameState.timeLeft;
  scoreDisplay.textContent = gameState.score;
  
  scoreDisplay.classList.add('score-animation');
  setTimeout(() => scoreDisplay.classList.remove('score-animation'), 500);
}

//sayaç
function startTimer() {
  if (gameState.gameTimer) {
    clearInterval(gameState.gameTimer);
  }
  
  gameState.gameTimer = setInterval(() => {
    if (!gameState.isPlaying || gameState.isPaused) {
      return;
    }
    
    gameState.timeLeft--;
    updateDisplay();
    
    if (gameState.timeLeft <= 0) {
      clearInterval(gameState.gameTimer);
      endGame();
    }
  }, 1000);
}

//oyun bitiş
function endGame() {
  gameState.isPlaying = false;
  stopTargetMovement();
  
//skor kontrolü
  if (gameState.score > highScore) {
    highScore = gameState.score;
    localStorage.setItem('aimGameHighScore', highScore);
    highScoreAchievement.style.display = 'block';
  } else {
    highScoreAchievement.style.display = 'none';
  }
  
 
  finalScore.textContent = gameState.score;
  highScoreDisplay.textContent = highScore;
  gameScreen.style.display = 'none';
  endScreen.style.display = 'flex';
}

//oyun resetleme
function resetGame() {
  endScreen.style.display = 'none';
  startScreen.style.display = 'flex';
  difficultyBtns.forEach(btn => btn.classList.remove('selected'));
  startGameBtn.disabled = true;
  gameState.selectedDifficulty = null;
  gameState.isCustom = false;
}

//durklatma
function pauseGame() {
  if (!gameState.isPlaying || gameState.isPaused) return;
  
  gameState.isPaused = true;
  stopTargetMovement();

  pauseTimeDisplay.textContent = gameState.timeLeft;
  pauseScoreDisplay.textContent = gameState.score;
  pauseScreen.style.display = 'flex';
}

function resumeGame() {
  if (!gameState.isPlaying || !gameState.isPaused) return;
  
  gameState.isPaused = false;
  
  if (gameConfig.movement) {
    startTargetMovement();
  }

  pauseScreen.style.display = 'none';
}

function restartGame() {
  if (!gameState.isPlaying) return;
  pauseScreen.style.display = 'none';

  initializeGame();
}

function exitGame() {
  if (!gameState.isPlaying) return;

  gameState.isPlaying = false;
  gameState.isPaused = false;
  stopTargetMovement();
  
  if (gameState.gameTimer) {
    clearInterval(gameState.gameTimer);
  }
  
  //ana menü
  gameScreen.style.display = 'none';
  startScreen.style.display = 'flex';
  
  //seçim temizleme
  difficultyBtns.forEach(btn => btn.classList.remove('selected'));
  startGameBtn.disabled = true;
  gameState.selectedDifficulty = null;
  gameState.isCustom = false;
}

function goToMainMenu() {

  pauseScreen.style.display = 'none';
  
  gameState.isPlaying = false;
  gameState.isPaused = false;
  stopTargetMovement();
  
  if (gameState.gameTimer) {
    clearInterval(gameState.gameTimer);
  }
  
  gameScreen.style.display = 'none';
  startScreen.style.display = 'flex';
  
  difficultyBtns.forEach(btn => btn.classList.remove('selected'));
  startGameBtn.disabled = true;
  gameState.selectedDifficulty = null;
  gameState.isCustom = false;
}