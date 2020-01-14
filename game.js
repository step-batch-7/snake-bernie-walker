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

  get food() {
    return this.#food.location;
  }

  get prevFoodLocation() {
    return this.#prevFood;
  }

  get scores() {
    return this.#points;
  }

  getSnakeSchematics() {
    return [this.#snake.location, this.#snake.species, this.#snake.pastTail];
  }

  navigateSnake(action) {
    this.#snake.turn(action);
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
