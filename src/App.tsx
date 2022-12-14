import React from 'react';
import styled from 'styled-components';

import SaveState from './hooks/useSaveState';
import TicTacToeBoard from './game/TicTacToeBoard';
import BoardView from './components/BoardView';
import GameControls from './components/GameControls';
import GameStateView from './components/GameStateView';
import PlayerTurnView from './components/PlayerTurnView';
import { GlobalStyles } from './styles/GlobalStyles';

// Local storage keys should be unique
const APP_NAME = 'noughts-and-crosses'
const VERSION = "0.0.1"
const PREFIX = `${APP_NAME}--${VERSION}`
const SAVEKEY_BOARD = `${PREFIX}--BOARD`
const SAVEKEY_GAME_STATE = `${PREFIX}--GAME_STATE`

export type GameOverState = "winnerX" | "winnerO" | "draw" | null; // null means game not over
export type Turn = "X" | "O";

// All possible game states--either it's game over or it's someone's turn:
export type GameState = GameOverState | Turn

// Supported board sizes: '3x3' | '4x4' | '5x5' | '6x6'
export type BoardSize = 3 | 4 | 5 | 6;
export const MIN_BOARD_SIZE = 3
export const MAX_BOARD_SIZE = 6
export const DEFAULT_BOARD_SIZE: BoardSize = 3

export function isGameOver(gameState: GameState) {
   return gameState === 'draw' || gameState === 'winnerO' || gameState === 'winnerX'
}

const Wrapper = styled.main`
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;

   padding: 1rem;
   background-color: white;

   border-radius: .5rem;
   border: 4px solid grey;

   @media (max-width: 25rem) {
      max-width: unset;
      width: 100%;
      height: 100%;
      border-radius: 0;
   }

   --shadow-elevation-medium:
   0.3px 0.9px 1.1px hsl(var(--shadow-color) / 0.35),
    0.9px 2.8px 3.3px -0.8px hsl(var(--shadow-color) / 0.36),
    2.3px 7px 8.3px -1.6px hsl(var(--shadow-color) / 0.36),
    5.5px 17.1px 20.3px -2.4px hsl(var(--shadow-color) / 0.36);

   box-shadow: var(--shadow-elevation-medium);

    /* Source: Josh Comeau shadow generator: https://www.joshwcomeau.com/shadow-palette/ */
`
const Title = styled.h1`
   padding: 0 1rem;
`

function App() {
   const [gameState, setGameState] = SaveState.useSaveState<GameState>(SAVEKEY_GAME_STATE, "O")

   const [board, setBoard] = SaveState.useSaveState<TicTacToeBoard>(
      SAVEKEY_BOARD,
      // initialize to empty board
      () => (new TicTacToeBoard(DEFAULT_BOARD_SIZE)),
      { // serializer for local storage
         toJSON: TicTacToeBoard.toJSON,
         parseJSON: TicTacToeBoard.parseJSON
      }
   );

   function resetEverything() {
      setGameState("O")
      setBoard(new TicTacToeBoard())    // resets board size too
   }

   function newGame() {
      setGameState("O")
      // clear board but retain current board size
      setBoard(new TicTacToeBoard(board.size))
   }

   function forfeitGame() {
      // declare winner but don't start new game yet
      if (gameState !== 'X' && gameState !== 'O') return;
      setGameState(gameState => {
         switch (gameState) {
            case "X": return "winnerO";
            case "O": return "winnerX";
            default: throw Error("Invalid time to forfeit")
         }
      })
   }

   // check given board for game over state and update our internal state accordingly
   const checkAndHandleGameOver = React.useCallback((board: TicTacToeBoard) => {
      if (board.isGameOver()) {
         const gameOverState = board.gameOverState()
         switch (gameOverState) {
            case "draw": setGameState("draw"); break;
            case "winnerO": setGameState("winnerO"); break;
            case "winnerX": setGameState("winnerX"); break;
            default: throw Error("Unexpected game over state: " + gameOverState)
         }
      }
   }, [setGameState])

   const clickTile = React.useCallback((x: number, y: number) => {
      if (isGameOver(gameState)) return // no plays allowed after game over
      if (!board.isTileEmpty(x, y)) return; // play not allowed if tile at x,y is already set

      // Play the tile
      const newBoard = board.setTile(x, y, gameState as Turn)
      console.log({ newBoard })
      setBoard(newBoard);

      checkAndHandleGameOver(newBoard)
      if (!newBoard.isGameOver()) {
         // finish turn
         setGameState((gameState) => (gameState === 'X' ? 'O' : 'X'))
      }
   }, [board, gameState, checkAndHandleGameOver, setBoard, setGameState])

   // Allow user to resize the board
   function expandBoard() {
      const newSize = Math.min(MAX_BOARD_SIZE, board.size + 1) as BoardSize
      setBoard(board.duplicateBoard(newSize))
      // No need to check game over on expanding board because the new tiles
      // will all be empty
   }
   function shrinkBoard() {
      const newSize = Math.max(MIN_BOARD_SIZE, board.size - 1) as BoardSize
      const newBoard = board.duplicateBoard(newSize)
      setBoard(newBoard)
      checkAndHandleGameOver(newBoard)
   }

   return (
      <Wrapper>
         <Title>Noughts & Crosses</Title>
         <PlayerTurnView {...{ gameState }} />
         <GameStateView {...{ gameState }} />
         <GameControls {...{
            gameState, resetEverything,
            forfeitGame, newGame,
            expandBoard, shrinkBoard
         }} />
         {<BoardView {...{ board, clickTile }} />}
         <GlobalStyles />
      </Wrapper>
   );
}

export default App;
