import styled from "styled-components"
import { GameState } from "../App"

/**
 * Display the state of the game
 */
const GameStateContainer = styled.div`
   
   margin: 1rem;

   & h2 {
      text-align: center;
   }

   @media (max-width: 25rem) {
      width: auto;
   }
`
export default function GameStateView({ gameState }) {
   return (
      <GameStateContainer>
         <h2>{gameStateMessage(gameState)}</h2>
      </GameStateContainer>
   )
}

// A user friendly message indicating the game state
function gameStateMessage(gameState: GameState) {
   switch (gameState) {
      case "X": return "X's turn"
      case "O": return "O's turn"
      case "draw": return "Draw!"
      case "winnerX": return "X wins!"
      case "winnerO": return "O wins!"
      default:
         throw Error("Invalid game state: " + gameState)
   }
}
