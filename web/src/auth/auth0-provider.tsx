import { Auth0Provider } from "@auth0/auth0-react";
import config from "@/config.ts";

export const AuthProviderWithHistory = ({ children }) => {
  if (!config.auth0Client || !config.auth0Domain) throw new Error("Invalid AuthProvider");

  return (
    <Auth0Provider
      domain={config.auth0Domain}
      clientId={config.auth0Client}
      clientSecret={config.auth0Client}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      {children}
    </Auth0Provider>
  );
};
