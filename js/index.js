const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const brickImg = new Image();
const spongeImage = new Image();
const winningsound = new Audio("sounds/scream.mp3");
winningsound.preload = "auto";
winningsound.volume = 0.9;
brickImg.src = "images/brick.png";
spongeImage.src = "images/sponge.png";

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;

let paddleHeight = 20;
let paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;
let score = 0;
let interval = 0;

// bricks ===============

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function playwinningsound() {
  winningsound.currentTime = 0;
  winningsound.play().catch(() => {});
}
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.drawImage(brickImg, brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

// ========================

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawPaddle() {
  ctx.drawImage(
    spongeImage,
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight,
  );
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  collisionDetection();
  x += dx;
  y += dy;

  if (y + dy < ballRadius - paddleHeight) {
    dy = -dy;
  } else if (y + dy + paddleHeight > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval);
    }
  }
  if (x + dx < ballRadius + 30 || x + dx > canvas.width - ballRadius) dx = -dx;

  if (rightPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  }

  if (leftPressed) {
    paddleX = Math.max(paddleX - 7, 0);
  }
}

function startGame() {
  interval = setInterval(draw, 10);
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickColumnCount * brickRowCount) {
            alert("YOU WON!");

            clearInterval(interval);
          }
          if (score === 3) playwinningsound();
        }
      }
    }
  }
}

canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = t.clientX - rect.left;

    // convert touch position to paddle position
    paddleX = x - paddleWidth / 2;

    // clamp
    paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, paddleX));
  },
  { passive: false },
);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
const runButton = document.getElementById("runButton");

runButton.addEventListener("click", () => {
  startGame();
  runButton.disabled = true;
});
