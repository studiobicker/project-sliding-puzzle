const numRows = 4;
const numCols = 4;

let slidingPuzzle;

const modal = document.querySelector("#modal");
const modalOverlay = document.querySelector("#modal-overlay");
const closeButton = document.querySelector("#close-button");

document.addEventListener("DOMContentLoaded", function(event) {
  playGame();
});

const gameBoardHTML = () => {
  let html = "";
  let x = 0;

  html += `<div id="puzzle">`;
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (x < slidingPuzzle.tiles.length) {
        html += `<div class="tile tile-${slidingPuzzle.shuffledTiles[x]}" data-row=${i} data-col=${j}><span>${slidingPuzzle.shuffledTiles[x]}</span></div>`;
        x++;
      } else {
        html += `<div class="tile tile-empty" data-row=${i} data-col=${j}></div>`;
      }
    }
  }
  html += "</div>";
  return html;
};

const playGame = () => {
  // create a new instance of the game
  slidingPuzzle = new SlidingPuzzle(numRows, numCols);
  slidingPuzzle.shuffleTiles();

  // setup the gameboard
  document.querySelector("#game_board").innerHTML = gameBoardHTML();

  // bind the click event of each cell to a function
  document.querySelectorAll(".tile").forEach(function(tile) {
    tile.onclick = function() {
      const clickedTile = { row: this.dataset.row, col: this.dataset.col };

      // get the empty cell coordinates next to the clicked tile
      const emptyCell = getEmptyCell(clickedTile);

      // if there are no coordinates of the empty cell, stop moving the tile
      if (!emptyCell) return;

      // timer starts when first tile moves
      slidingPuzzle.startTimer();

      const tileEmpty = document.querySelector(".tile-empty");
      const tilelNo = this.firstChild.innerHTML;

      //move tile to emptyCell on visual board (DOM)
      this.classList.remove(`tile-${tilelNo}`);
      this.classList.add("tile-empty");
      this.innerHTML = "";

      tileEmpty.classList.remove("tile-empty");
      tileEmpty.classList.add(`tile-${tilelNo}`);
      tileEmpty.innerHTML = `<span>${tilelNo}</span>`;

      //move tile to emptyCell on game board
      slidingPuzzle.moveTile(clickedTile, emptyCell);
      document.getElementById("moves").innerHTML = slidingPuzzle.moves;

      if (slidingPuzzle.checkFinish()) {
        setTimeout(function() {
          // timer starts when game ove
          slidingPuzzle.stopTimer();

          document.getElementById("puzzle").classList.add("game-over");
          const element = document.querySelector("#game_over");
          element.style.visibility = "visible";
          element.style.opacity = "1";
        }, 500);
      }
    };
  });

  const newGame = document.getElementById("newgame");
  newGame.addEventListener("click", reload, false);
};

const getEmptyCell = cTile => {
  // get the empty cell next to the clicked tile.
  // return null if there is no empty cell next to the tile.

  let cellFromBoard;

  const row = parseInt(cTile.row);
  const col = parseInt(cTile.col);

  // check left tile is empty
  if (col > 0) {
    cellFromBoard = slidingPuzzle.board[row][col - 1];
    if (cellFromBoard == "empty") return { row: row, col: col - 1 };
  }

  // check right tile is empty
  if (col < numCols - 1) {
    cellFromBoard = slidingPuzzle.board[row][col + 1];
    if (cellFromBoard == "empty") return { row: row, col: col + 1 };
  }

  // check upper tile is empty
  if (row > 0) {
    cellFromBoard = slidingPuzzle.board[row - 1][col];
    if (cellFromBoard == "empty") return { row: row - 1, col: col };
  }

  // check lower tile is empty
  if (row < numRows - 1) {
    cellFromBoard = slidingPuzzle.board[row + 1][col];
    if (cellFromBoard == "empty") return { row: row + 1, col: col };
  }

  return null;
};

const printTime = seconds => {
  document.getElementById("timer").innerHTML = seconds;
};

const reload = () => {
  location.reload(true);
};
