import assert from "tiny-invariant";
import { DEFAULT_BOARD_SIZE, GameOverState } from "../App";

export type TileLabel = "X" | "O" | null;

/**
 * An immutable Tic Tac Toe board
 * 
 * - Doesn't include game state like whose turn it is or player score
 */
export default class TicTacToeBoard {
   // Immutable state: a 2D array of tiles
   private readonly _tiles: TileLabel[][]

   // Lazily computed properties
   private _gameOverState: GameOverState = null;
   private _winningTilesCoords: [number, number][] | null = null;

   constructor(
      size: number = DEFAULT_BOARD_SIZE,
      tiles = TicTacToeBoard.createEmptyTiles(size),
   ) {
      this._tiles = tiles
   }
   private static createEmptyTiles(size: number, tileLabel: TileLabel = null) {
      return Array(size)
         .fill(null)
         .map((_) => Array(size).fill(tileLabel));
   }

   // flatten 2D array into 1D array (useful for rendering)
   public getTilesAsFlatRow(): TileLabel[] {
      const ret: TileLabel[] = []
      for (let row = 0; row < this.size; row++) {
         for (let col = 0; col < this.size; col++) {
            ret.push(this._tiles[col][row])
         }
      }
      return ret;
   }
   isFilledBoard(): boolean {
      const isFullBoard = !this._tiles.some(
         (row) => row.some(
            (tile) => tile === null
         )
      );
      return isFullBoard;
   }

   // Reduce this.gameOverState() to a boolean 
   isGameOver(): boolean {
      const gameOverState = this.gameOverState()
      switch (gameOverState) {
         case 'winnerO': return true;
         case 'winnerX': return true;
         case 'draw': return true;
         default: return false;
      }
   }

   // Computes and caches game over state: winner, draw, or not yet
   gameOverState(): GameOverState {
      // Return if already computed
      if (this._gameOverState) return this._gameOverState

      const board = this._tiles
      const size = board.length;

      /** Check all possible win states:
       * 1. All rows
       * 2. All columns
       * 3. Both diagonals
       * 4. Filled board (draw)
       */

      // 1. Check all horizontal win conditions
      const isHorizontalWin = (() => {
         for (let row = 0; row < size; row++) {
            let mismatch = false;
            for (let col = 0; col < size - 1; col++) {
               if (board[col][row] === null || board[col][row] !== board[col + 1][row]) {
                  mismatch = true
                  break;
               }
            }
            if (mismatch) continue
            // found row of the same tiles
            this._winningTilesCoords = Array(size).fill(null).map((_, i) => [i, row])
            console.log({ row, winningTiles: this._winningTilesCoords, board })
            return true;
         }
         return false;
      })()
      if (isHorizontalWin) {
         assert(this._winningTilesCoords instanceof Array)
         const row = this._winningTilesCoords[0][1]
         this._gameOverState = board[0][row] === 'O' ? 'winnerO' : 'winnerX'
         return this._gameOverState
      }

      // 2. Check all vertical win conditions
      const isVerticalWin = (() => {
         for (let col = 0; col < size; col++) {
            let mismatch = false
            for (let row = 0; row < size - 1; row++) {
               if (board[col][row] === null || board[col][row] !== board[col][row + 1]) {
                  mismatch = true
                  break;
               }
            }
            if (mismatch) continue // no mismatch means we found a winning column

            // found col of same tiles
            this._winningTilesCoords = Array(size).fill(null).map((_, i) => [col, i])
            console.log({ winningTiles: this._winningTilesCoords })
            return true
         }
         return false;
      })()
      if (isVerticalWin) {
         assert(this._winningTilesCoords instanceof Array)
         const col = this._winningTilesCoords[0][0]
         this._gameOverState = board[col][0] === 'O' ? 'winnerO' : 'winnerX'
         return this._gameOverState
      }

      // 3. Check both diagonal win conditions

      // Check diagonal 1 (downward slope)
      const isDiagonal1Win = (() => {
         for (let i = 0; i < size - 1; i++) {
            if (board[i][i] === null || board[i][i] !== board[i + 1][i + 1]) {
               // NO diagonal 1 win
               return false;
            }
         }
         // no mismatch means winning diagonal
         this._winningTilesCoords = Array(size).fill(null).map((_, i) => [i, i])
         console.log({ winningTiles: this._winningTilesCoords })
         return true;
      })();
      if (isDiagonal1Win) {
         this._gameOverState = board[0][0] === 'O' ? 'winnerO' : 'winnerX';
         return this._gameOverState
      }

      // check upward slope diagonal
      const isDiagonal2Win = (() => {
         for (let i = 0; i < size - 1; i++) {
            const currTile = board[i][size - 1 - i]
            const nextTile = board[i + 1][size - 1 - i - 1]
            if (currTile === null || currTile !== nextTile) return false
         }
         this._winningTilesCoords = Array(size).fill(null).map((_, i) => [i, size - 1 - i])
         console.log({ winningTiles: this._winningTilesCoords })
         return true // Diagonal 2 tiles all match
      })()
      if (isDiagonal2Win) {
         this._gameOverState = board[0][size - 1] === 'O' ? 'winnerO' : 'winnerX'
         return this._gameOverState
      }

      // Check for draw (full board)
      if (this.isFilledBoard()) {
         this._gameOverState = 'draw'
         return this._gameOverState
      }

      return this._gameOverState  // should be null
   }

   // Check whether tile is filled at given coordinates
   isTileEmpty(x: number, y: number) {
      return this._tiles[x][y] === null;
   }

   // returns new board with tile at [ x, y ] filled (with given label)
   setTile(x: number, y: number, label: TileLabel): TicTacToeBoard {
      if (!this.isTileEmpty(x, y)) throw Error("Tile already set!")

      const newTiles = [...this._tiles];
      newTiles[x] = [...newTiles[x]];
      newTiles[x][y] = label;

      return new TicTacToeBoard(undefined, newTiles)
   }

   // create new board of given sizse with the same tiles (minus those that won't fit on the new board)
   duplicateBoard(newSize: number) {
      const newTiles = TicTacToeBoard.createEmptyTiles(newSize)
      const board = this._tiles
      for (let i = 0; i < newTiles.length; i++) {
         if (i >= board.length) continue;
         for (let j = 0; j < newTiles[i].length; j++) {
            if (j >= board[i].length) continue;
            newTiles[i][j] = board[i][j] ?? null;
         }
      }
      return new TicTacToeBoard(newSize, newTiles);
   }

   // JSON serialization for local storage
   static toJSON(board: TicTacToeBoard): string {
      return JSON.stringify(board._tiles)
   }
   static parseJSON(json: string): TicTacToeBoard {
      const tiles: TileLabel[][] = JSON.parse(json)
      assert(tiles instanceof Array)
      assert(tiles.length >= 2)   // we don't support sizes smaller than this
      return new TicTacToeBoard(tiles.length, tiles)
   }

   // Accessors
   get size(): number {
      return this._tiles.length
   }
}