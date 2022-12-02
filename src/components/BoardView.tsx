import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

import { BoardSize } from "../App";
import TicTacToeBoard from "../game/TicTacToeBoard";

/**
 * Render the Tic Tac Toe board based on given board state
 */

type BoardProps = {
   size: number;
};
const Wrapper = styled.div<BoardProps>`
   width: auto;

   display: inline-grid;
   place-content: center;
   grid-template-columns: repeat(${(props) => props.size}, 60px);
   gap: 2px;

   background-color: hsl(0deg, 0%, 83%);

   margin: 1rem;
`;
const Tile = styled.div`
   width: 60px;
   aspect-ratio: 1;
   display: grid;
   place-items: center;
   box-sizing: border-box;
   font-size: x-large;
   color: hsl(0deg, 0%, 33%);
   background-color: white;
`;

function BoardView({ board, clickTile }: {
   board: TicTacToeBoard;
   // Callback to trigger the clicking action on the board
   clickTile: (x: number, y: number) => void;
}) {
   const size = board.size as BoardSize;
   // Flatten 2D array into 1D array so it fits into a CSS Grid
   const flattenedTiles = board.getTilesAsFlatRow()

   return (
      <Wrapper as={motion.div} size={size} layout>
         <AnimatePresence>
            {flattenedTiles.map((tileLabel, j) => {
               // Redetermine column and row numbers so we can trigger the right click action
               const row = Math.floor(j / size);
               const col = j % size;
               const key = `${col},${row}`;
               return (
                  <Tile
                     as={motion.div}
                     layout
                     // id={key}
                     key={key}
                     onClick={() => clickTile(col, row)}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                  >
                     {tileLabel}
                  </Tile>
               );
            })}
         </AnimatePresence>
      </Wrapper>
   );
}

export default BoardView