//Define HTML elements 
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

//Define game variables
const gridSize = 20;
let direction = 'right';
let snake = [{x: 10, y: 10}];
let food = generateFood();
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;

//Draw game map, snake, food
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

//Draw Snake
function drawSnake() {
  snake.forEach(segment => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement)
  });
}

//Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

//Set the position of snake or food
function setPosition(element, position){
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

//Draw food
function drawFood() {
  if(gameStarted) {
    const foodElement = createGameElement('div', 'food');
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}
}

//Generate food position
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return {x,y};
}

//Moving the snake
function move() {
 const head = {...snake[0]};
 switch (direction) {
  case 'right':
    head.x++;
   break;
   case 'up':
    head.y--;
   break;
   case 'left':
    head.x--;
   break;
   case 'down':
    head.y++;
   break;
 }

 snake.unshift(head);
 //snake.pop()

 if(head.x === food.x && head.y === food.y){
  food = generateFood();
  increaseSpeed();
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    move();
   checkCollision();
    draw();
  }, gameSpeedDelay);
 }else {
  snake.pop();
 }
}

//Start game function 
function startGame() {
  gameStarted = true;
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
  saveHighScore()
}

function handleKeyPress(event) {
  console.log(event.key)
  if(!gameStarted && event.key === ' '){
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
      direction = 'up';
      break;
      case 'ArrowDown':
      direction = 'down';
      break;
      case 'ArrowRight':
      direction = 'right';
      break;
      case 'ArrowLeft':
        direction = 'left';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress)
function increaseSpeed() {
  if(gameSpeedDelay > 150){
    gameSpeedDelay -= 5
  }else if(gameSpeedDelay > 100){
    gameSpeedDelay -= 3
  }else if(gameSpeedDelay > 50){
    gameSpeedDelay -= 2
  }else if(gameSpeedDelay > 25){
    gameSpeedDelay -= 1
  }
}

//reset game if snake hits the wall or bite itself
function checkCollision() {
  const head = snake[0];

  if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
    resetGame();
  };

  for(let i = 1; i < snake.length; i++){
    if(head.x === snake[i].x && head.y === snake[i].y){
      resetGame()
    }
  }
}

//reset game 
function resetGame() {
  updateHighScore();
  stopGame();
  direction = 'right';
  snake = [{x: 10, y: 10}];
  food = generateFood();
  gameSpeedDelay = 200;
  updateScore();
}

//Update Score
function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

//Stop game
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

//Update high score
function updateHighScore() {
  const currentScore = snake.length - 1;
  if(currentScore > highScore){
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}

// Save high score 
function saveHighScore() {
  localStorage.setItem('highScore', JSON.stringify(highScore.toString().padStart(3, '0')));
}

function displayHighScore() {
 highScore.textContent = localStorage.getItem('highScore');
}
displayHighScore()