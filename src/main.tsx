
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import "./globals.css";
import { UserProvider } from "./contexts/UserContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <UserProvider>
          <App />
        </UserProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
