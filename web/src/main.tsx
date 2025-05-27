import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { FlashLightProvider } from "./components/ui/flashlightContext/provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FlashLightProvider>
      <App />
    </FlashLightProvider>
  </StrictMode>
);
