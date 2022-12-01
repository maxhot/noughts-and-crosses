import { motion } from 'framer-motion';
import { Expand, Shrink } from 'lucide-react'
import styled from 'styled-components';

import { isGameOver } from '../App'

const DEBUGGING = false;


/**
 * A horizontal bar of buttons
 */
const Wrapper = styled.div`
   display: flex;
   justify-content: center;;
   align-items: center;
   gap: .5rem;

   margin: .5rem;
`
const Button = styled.button`
   /* Make button big enough to target */
   min-height: 2.5rem;
   padding: .5rem;
`
const NewGameButton = styled(Button)`
   outline: 2px solid blue;
`

export function GameControls({ gameState, resetEverything, forfeitGame, newGame, shrinkBoard, expandBoard, }) {

   return (
      <Wrapper>
         {DEBUGGING &&
            <Button onClick={resetEverything}>Reset Everything</Button>}
         {isGameOver(gameState)
            ? <NewGameButton as={motion.button} layoutId="gameOverButton" onClick={newGame}>
               New Game
            </NewGameButton>
            // Allow player to forfeit current game, so they don't need to keep
            // playing when there is not hope
            : <Button as={motion.button} layoutId="gameOverButton" onClick={forfeitGame}>
               Forfeit
            </Button>
         }
         <Button onClick={expandBoard} title="expand-board"><Expand /></Button>
         <Button onClick={shrinkBoard} title="shrink-board"><Shrink /></Button>
      </Wrapper>
   )
}

export default GameControls

