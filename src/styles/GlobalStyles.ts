import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
   #root {
      --bg-color: 0deg 0% 90%;
      --shadow-color: 0deg 0% 56%;
      background-color: hsl(var(--bg-color));

      /* use flexbox to center main app */
      display: grid;
      place-items: center;
   }
   body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
         'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
         sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
   }
   code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
         monospace;
   }
`