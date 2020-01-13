class Snake {
  #positions;
  #direction;
  #type;
  #previousTail;

  constructor(positions, direction, type) {
    this.#positions = positions.slice();
    this.#direction = direction;
    this.#type = type;
    this.#previousTail = [0, 0];
  }

  get location() {
    return this.#positions.slice();
  }

  get species() {
    return this.#type;
  }

  get pastTail() {
    return this.#previousTail;
  }
  get head() {
    return this.#positions[this.#positions.length - 1];
  }

  turn(key) {
    this.#direction.change(key);
  }

  move() {
    const [headX, headY] = this.#positions[this.#positions.length - 1];
    this.#previousTail = this.#positions.shift();

    const [deltaX, deltaY] = this.#direction.delta;

    this.#positions.push([headX + deltaX, headY + deltaY]);
  }

  retainTail() {
    this.#positions.unshift(this.#previousTail);
  }
}

class Food {
  #position;
  constructor(position) {
    this.#position = position;
  }

  get location() {
    return this.#position;
  }

  set location(newCoords) {
    this.#position = newCoords;
  }
}

const areCoordinatesEqual = (coordinate1, coordinate2) => {
  return coordinate1[0] === coordinate2[0] && coordinate1[1] === coordinate2[1];
};

class Game {
  #snake;
  #food;
  #height;
  #breadth;
  #prevFood;
  #points;

  constructor([breadth, height], snake, food) {
    this.#snake = snake;
    this.#breadth = breadth;
    this.#height = height;
    this.#food = food;
    this.#prevFood = [];
    this.#points = 0;
  }
  get snakeSchematics() {
    return [this.#snake.location, this.#snake.species, this.#snake.pastTail];
  }

  get food() {
    return this.#food.location;
  }

  get prevFoodLocation() {
    return this.#prevFood;
  }

  get scores() {
    return this.#points;
  }

  navigateSnake(key) {
    this.#snake.turn(key);
  }

  isFoodConsumed() {
    return areCoordinatesEqual(this.#snake.head, this.#food.location);
  }

  progressGame() {
    this.#snake.move();
    if (this.isFoodConsumed()) {
      this.#snake.retainTail();
    }
  }

  hasSnakeTouchedBody() {
    return this.#snake.location
      .slice(0, -1)
      .some(bodyParts => areCoordinatesEqual(bodyParts, this.#snake.head));
  }

  hasSnakeCrossedBoundary() {
    return (
      this.#snake.head[0] < 0 ||
      this.#snake.head[0] >= this.#breadth ||
      this.#snake.head[1] < 0 ||
      this.#snake.head[1] >= this.#height
    );
  }

  generateFood() {
    this.#prevFood = this.#food.location;
    const column = Math.floor(Math.random() * this.#breadth);
    const row = Math.floor(Math.random() * this.#height);
    this.#food.location = [column, row];
  }

  updateScore() {
    this.#points += 3;
  }
}

const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + '_' + rowId;

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const drawFood = function([colId, rowId]) {
  const cell = getCell(colId, rowId);
  cell.classList.add('food');
};

const drawSnake = function(snakeBody, snakeType) {
  snakeBody.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snakeType);
  });
};

const printScores = function(scores) {
  const scoreBoard = document.getElementById('scores');
  scoreBoard.innerText = scores;
};

const eraseTail = function(snakePastTail, snakeType) {
  const [colId, rowId] = snakePastTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snakeType);
};

const eraseFood = function([colId, rowId]) {
  const cell = getCell(colId, rowId);
  cell.classList.remove('food');
};

const drawBoard = function(game) {
  const [snakeBody, snakeType, snakeTail] = game.snakeSchematics;

  if (game.isFoodConsumed()) {
    game.generateFood();
    game.updateScore();
    eraseFood(game.prevFoodLocation);
  } else {
    eraseTail(snakeTail, snakeType);
  }

  drawSnake(snakeBody, snakeType);
  drawFood(game.food);
  printScores(game.scores);
};

const startTheGame = function(game) {
  let interval;

  interval = setInterval(
    game => {
      game.progressGame();

      if (game.hasSnakeTouchedBody() || game.hasSnakeCrossedBoundary()) {
        clearInterval(interval);
        alert('Game Over');
        return;
      }

      drawBoard(game);
    },
    200,
    game
  );
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const initBoard = function(game) {
  createGrids();
  drawBoard(game);
};

const handleKeyPress = game => {
  game.navigateSnake(event.key);
};

const attachEventListeners = game => {
  document.body.onkeydown = handleKeyPress.bind(null, game);
};

const main = function() {
  const snake = new Snake(
    [
      [40, 25],
      [41, 25],
      [42, 25]
    ],
    new Direction(EAST),
    'snake'
  );

  const food = new Food([9, 9]);

  const game = new Game([NUM_OF_COLS, NUM_OF_ROWS], snake, food);

  attachEventListeners(game);

  initBoard(game);

  startTheGame(game);
};

window.onload = main;
