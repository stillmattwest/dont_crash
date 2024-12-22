import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";

// Ensure the root element exists and its type is inferred correctly
const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
