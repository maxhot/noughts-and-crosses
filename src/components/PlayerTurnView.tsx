import { motion } from "framer-motion"
import styled, { css } from "styled-components"

/** 
 * Display the players and indicate whose turn it is
 */

const Wrapper = styled.div`
   display:flex;
   align-items: center;
   margin: 1rem;
`
const StyledTurnIndicator = styled.div`
   position: absolute;
   padding: .25rem .75rem;
   border-radius: .5rem;
   border: 1px solid grey;
   background-color: white;
   bottom: -.5rem;
   
`
const PlayerCard = styled.div<{ isTurn?: boolean }>`
   width: 5rem;
   height: 7rem;
   border: 1px solid lightgrey;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   color: hsl(0deg, 0%, 50%);
   border-radius: .5rem;
   background-color: white;

   position: relative;
   filter: drop-shadow(3px 3px 8px hsl(0deg, 0%, 50%, .5));

   ${props => props.isTurn ? css`outline: 2px solid goldenrod` : null}
`
const Versus = styled.span`
   font-style: italic;
   font-size: xx-large;
   margin: 0 .5rem;
`
const PlayerLabel = styled.span`
   font-size: xx-large;
   font-weight: 700;
   text-shadow: 2px 4px 8px hsl(0deg 0% 0% / 0.25);
   
`

export default function PlayerTurnView({ gameState }) {
   return (
      <Wrapper>
         <PlayerCard isTurn={gameState === 'O'}>
            <PlayerLabel>O</PlayerLabel>
            {gameState === 'O' && <TurnIndicator />}
         </PlayerCard>
         <Versus>vs</Versus>
         <PlayerCard isTurn={gameState === 'X'} >
            <PlayerLabel  >X</PlayerLabel>
            {gameState === 'X' && <TurnIndicator />}
         </PlayerCard >
      </Wrapper>
   )
}

function TurnIndicator() {
   return (
      <StyledTurnIndicator as={motion.div} layoutId="turnIndicator">
         turn
      </StyledTurnIndicator>
   )
}