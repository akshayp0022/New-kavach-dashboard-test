import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import { AppProvider } from "./components/AppContext";
import CustomTheme from "./theme/theme";
import { AuthProvider } from "./context/auth";
import { BrowserRouter } from "react-router-dom";
import { EmployeeProvider } from "./context/employee";
import { EmailProvider } from "./context/email";
import { StatusProvider } from "./context/status";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EmployeeProvider>
          <StatusProvider>
            <EmailProvider>
              <AppProvider>
                <ThemeProvider theme={CustomTheme}>
                  <App />
                </ThemeProvider>
              </AppProvider>
            </EmailProvider>
          </StatusProvider>
        </EmployeeProvider>
      </AuthProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
