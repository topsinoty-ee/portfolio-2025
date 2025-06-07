import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { FlashLightProvider } from "./components/ui/flashlightContext/provider";
import { AuthProviderWithHistory } from "./auth/auth0-provider.tsx";
import { ApolloWrapper } from "@/apollo-wrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProviderWithHistory>
      <ApolloWrapper>
        <FlashLightProvider>
          <App />
        </FlashLightProvider>
      </ApolloWrapper>
    </AuthProviderWithHistory>
  </StrictMode>,
);
