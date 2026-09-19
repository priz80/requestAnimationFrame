const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const toggleBtn = document.getElementById("toggleBtn");
const resetBtn = document.getElementById("resetBtn");

const RADIUS = 20;
const SPEED = 220; // пикселей в секунду

// начальное состояние — храним отдельно, чтобы можно было вернуться к нему при reset
const initialState = {
  x: RADIUS + 10,
  y: canvas.height / 2,
  vx: SPEED,
  vy: SPEED * 0.7,
};

// текущее состояние мяча (клонируем начальное, чтобы не мутировать оригинал)
let ball = { ...initialState };

let isRunning = false;
let rafId = null;
let lastTimestamp = null;

const drawBall = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "#e2932c";
  ctx.fill();
};

const updateBall = (deltaSeconds) => {
  ball.x += ball.vx * deltaSeconds;
  ball.y += ball.vy * deltaSeconds;

  // отскок от левой/правой стенки
  if (ball.x - RADIUS < 0) {
    ball.x = RADIUS;
    ball.vx *= -1;
  } else if (ball.x + RADIUS > canvas.width) {
    ball.x = canvas.width - RADIUS;
    ball.vx *= -1;
  }

  // отскок от верхней/нижней стенки
  if (ball.y - RADIUS < 0) {
    ball.y = RADIUS;
    ball.vy *= -1;
  } else if (ball.y + RADIUS > canvas.height) {
    ball.y = canvas.height - RADIUS;
    ball.vy *= -1;
  }
};

const animate = (timestamp) => {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp; // первый кадр после старта/резюма — просто фиксируем точку отсчёта
  }
  const deltaSeconds = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  updateBall(deltaSeconds);
  drawBall();

  rafId = requestAnimationFrame(animate);
};

const startAnimation = () => {
  isRunning = true;
  lastTimestamp = null; // сбрасываем точку отсчёта, чтобы не было скачка после паузы
  toggleBtn.textContent = "Пауза";
  rafId = requestAnimationFrame(animate);
};

const pauseAnimation = () => {
  isRunning = false;
  cancelAnimationFrame(rafId);
  toggleBtn.textContent = "Продолжить";
};

toggleBtn.addEventListener("click", () => {
  if (isRunning) {
    pauseAnimation();
  } else {
    startAnimation();
  }
});

resetBtn.addEventListener("click", () => {
  cancelAnimationFrame(rafId);
  isRunning = false;
  lastTimestamp = null;
  ball = { ...initialState };
  drawBall();
  toggleBtn.textContent = "Старт";
});

drawBall(); // отрисовать начальное состояние до первого запуска