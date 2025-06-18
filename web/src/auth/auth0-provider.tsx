import { ReactNode } from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import config from "@/config.ts";

export const AuthProviderWithHistory = ({ children }: { children: ReactNode }) => {
  if (!config.auth0Client || !config.auth0Domain) throw new Error("Invalid AuthProvider");

  return (
    <Auth0Provider
      domain={config.auth0Domain}
      clientId={config.auth0Client}
      authorizationParams={{
        audience: config.audience,
        scope: config.scope,
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
};
