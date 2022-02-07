import { ThirdwebProvider } from "@3rdweb/react";
import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import theme from "./theme";

(window as any).global = window;
// @ts-ignore
window.Buffer = window.Buffer || require("buffer").Buffer;

export const supportedChainIds = [1, 4, 137, 80001];
const connectors = {
  injected: {},
};

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme} resetCSS={true}>
      <ThirdwebProvider
        connectors={connectors}
        supportedChainIds={supportedChainIds}
      >
        <App />
      </ThirdwebProvider>
    </ChakraProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
