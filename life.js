const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let currentGen = [];
let timer;
canvas.width = 600;
canvas.height = 600;
const width = canvas.width;
const height = canvas.height;
const cellSize = 20;
const gridSizeX = width / cellSize;
const gridSizeY = height / cellSize;
let speed = 300;

canvas.onclick = (event) => {
  let x = event.offsetX;
  let y = event.offsetY;
  x = Math.floor(x / 20); // 300 /10 = 30
  y = Math.floor(y / 20); // 300 /10 =
  currentGen[y][x] = 1;
  draw();
};
createCells();
grid();

$('#start').click(startGame);
$('#clear').click(() => {
  createCells();
  ctx.clearRect(0, 0, width, height);
  grid();
});
$('#stop').click(() => {
  clearTimeout(timer);
});

$('#close').click(() => {
  $('.modal').css({
    display: 'none',
  });
  createCells();
  ctx.clearRect(0, 0, width, height);
  grid();
});
$('#slower').click(() => {
  speed += 100;
});
$('#faster').click(() => {
  speed -= 100;
});

function createCells() {
  let gridSizeX = 30,
    gridSizeY = 30;
  for (let i = 0; i < gridSizeX; i++) {
    currentGen[i] = [];
    for (let j = 0; j < gridSizeY; j++) {
      currentGen[i][j] = 0;
    }
  }
}

function grid() {
  ctx.lineWidth = 3;
  for (let x = 0; x < gridSizeY; x++) {
    ctx.beginPath();
    const y = (height / gridSizeY) * x;
    const start = [0, y];
    ctx.moveTo(...start);
    ctx.lineTo(width, y);
    ctx.strokeStyle = 'grey';
    ctx.stroke();
  }
  for (let i = 0; i < gridSizeX; i++) {
    ctx.beginPath();
    const x = (width / gridSizeX) * i;
    const start = [x, 0];
    ctx.moveTo(...start);
    ctx.lineTo(x, height);
    ctx.strokeStyle = 'grey';
    ctx.stroke();
  }
}
function draw() {
  ctx.clearRect(0, 0, width, height);
  grid();
  for (let i = 0; i < gridSizeX; i++) {
    for (let j = 0; j < gridSizeY; j++) {
      if (currentGen[i][j] === 1) {
        ctx.fillStyle = '#353535';
        ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }
}

function startGame() {
  const nextGen = [];
  for (let i = 0; i < gridSizeX; i++) {
    nextGen[i] = [];
    for (let j = 0; j < gridSizeY; j++) {
      let neighbors = 0;
      if (currentGen[mirror1(i) - 1][j] === 1) neighbors++;
      if (currentGen[i][mirror2(j) + 1] === 1) neighbors++;
      if (currentGen[mirror2(i) + 1][j] === 1) neighbors++;
      if (currentGen[i][mirror1(j) - 1] === 1) neighbors++;
      if (currentGen[mirror1(i) - 1][mirror2(j) + 1] === 1) neighbors++;
      if (currentGen[mirror2(i) + 1][mirror2(j) + 1] === 1) neighbors++;
      if (currentGen[mirror2(i) + 1][mirror1(j) - 1] === 1) neighbors++;
      if (currentGen[mirror1(i) - 1][mirror1(j) - 1] === 1) neighbors++;
      if (currentGen[i][j]) {
        (neighbors === 2 || neighbors === 3) ? nextGen[i][j] = 1 : nextGen[i][j] = 0;
      }
      if (!currentGen[i][j]) {
        (neighbors === 3) ? nextGen[i][j] = 1 : nextGen[i][j] = 0;
      }
    }
  }
  if (_.isEqual(currentGen, nextGen)) {
    clearTimeout(timer);
    $('.modal').css({
      display: 'flex',
    });
    return;
  }
  currentGen = nextGen;
  draw();
  timer = setTimeout(startGame, speed);
}

function mirror1(i) {
  if (i === 0) return gridSizeX;
  return i;
}
function mirror2(i) {
  if (i === gridSizeX - 1) return -1;
  return i;
}
