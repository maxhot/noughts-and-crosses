import styled from "styled-components"
import { GameState } from "../App"

/**
 * Display the state of the game
 */
const GameStateContainer = styled.div`
   border: 1px solid hsl(0deg 0% 70%);
   border-radius: .5rem;
   width: 30rem;

   background: white;
   margin: 1rem;

   & h2 {
      text-align: center;
   }
`
export default function GameStateView({ gameState, children }) {
   return (
      <GameStateContainer>
         <h2>{gameStateMessage(gameState)}</h2>
         {children}
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
