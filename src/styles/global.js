import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin:0;
    padding:0;
    box-sizing: none;
  }

  input[type="range"] {
    margin: 0px;
  }

  html {
    @media (max-width:1080px) {
      font-size:93.75%; //15px
    }
    @media (max-width:720px) {
      font-size:87.5%; //14px
    }
  }

  body {
    background: #ddd8d2;
    -webkit-font-smoothing: antialiased;
  }

  body, input, textarea, button {
    font-family: 'Roboto' , Arial, sans-serif;
    font-weight: 400;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 600;
  }

  button {
    cursor:pointer;
  }

  * ::-webkit-scrollbar {
      width: 5px;
  }
  * ::-webkit-scrollbar-thumb:hover {
      background: #ddd;
    }
  * ::-webkit-scrollbar-thumb {
    background: #e2e2e2;
    border-radius: 10px;
  }
  * ::-webkit-scrollbar-track {
      background: #eee;

  }

  [disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  *, *:before, *:after {
    box-sizing: border-box;
    outline:none;
    margin: 0;
    padding: 0;
  }


  .noSelect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}

  .noBreakText {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .rowCenter {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

`;
