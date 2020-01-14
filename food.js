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
