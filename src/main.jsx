import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import TitleProvider from "./context/TitleContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <TitleProvider>
        <App />
    </TitleProvider>
    </BrowserRouter>
  </StrictMode>
);