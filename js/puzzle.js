class SlidingPuzzle {
  constructor(numRows, numCols) {
    this.board = [];
    this.rows = numRows;
    this.columns = numCols;
    this.tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    this.shuffledTiles = [...this.tiles];
    this.moves = 0;
    this.intervalId = null;
    this.time = 0;
  }

  createBoard(x, y) {
    let i = 0;
    for (let row = 0; row < x; row++) {
      this.board[row] = [];
      for (let column = 0; column < y; column++) {
        if (i < this.tiles.length) {
          this.board[row][column] = this.shuffledTiles[i];
          i++;
        } else {
          this.board[row][column] = "empty";
        }
      }
    }
  }

  //Fisher-Yates Shuffle
  shuffleTiles() {
    const shuffledTiles = this.shuffledTiles;
    let m = shuffledTiles.length,
      t,
      i;
    // While there remain elements to shuffle
    while (m) {
      // Pick a remaining element
      i = Math.floor(Math.random() * m--);

      // Swap it with the current element
      t = shuffledTiles[m];
      shuffledTiles[m] = shuffledTiles[i];
      shuffledTiles[i] = t;
    }
    this.createBoard(this.rows, this.columns);
    return shuffledTiles;
  }

  moveTile(tile, emptyCell) {
    this.board[emptyCell.row][emptyCell.col] = this.board[tile.row][tile.col];
    this.board[tile.row][tile.col] = "empty";
    this.moves++;
  }

  checkFinish() {
    // Flatten multidimensional board to one-dimensional array
    // Remove last element
    // Compare the board array with original tiles-array
    let boardArr = [].concat(...this.board);
    boardArr.pop();

    let tilesArr = this.tiles;

    // Check if the arrays are the same length
    if (boardArr.length !== tilesArr.length) return false;

    // Check if all items exist and are in the same order
    for (let i = 0; i < boardArr.length; i++) {
      if (boardArr[i] !== tilesArr[i]) return false;
    }

    // Otherwise, return true
    return true;
  }

  startTimer() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.time++;
        printTime(this.time);
      }, 1000);
    }
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }
}
