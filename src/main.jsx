import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import ColorSchemeContext from "./context/ColorSchemeContext";
import { Notifications } from "@mantine/notifications";
import { AuthProvider } from "./context/AuthContext";
import Router from "./Router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorSchemeContext>
      <Notifications position="top-right" />
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ColorSchemeContext>
  </React.StrictMode>
);
