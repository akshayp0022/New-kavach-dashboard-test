import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import CustomTheme from "./theme/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={CustomTheme}>
      <App />
    </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
