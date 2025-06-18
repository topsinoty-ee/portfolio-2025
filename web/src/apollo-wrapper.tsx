import { ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode, useEffect, useMemo, useState } from "react";

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, getAccessTokenSilently, logout, isLoading } = useAuth0();
  const [token, setToken] = useState<string | null>(null);
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      if (!isAuthenticated) {
        setToken(null);
        setTokenReady(true);
        return;
      }

      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
      } catch (error) {
        console.error("Auth token fetch failed", error);
        await logout({ logoutParams: { returnTo: window.location.origin } });
      } finally {
        setTokenReady(true);
      }
    };

    loadToken();
  }, [isAuthenticated, getAccessTokenSilently, logout]);

  const client = useMemo(() => {
    if (!tokenReady) return null;

    const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" });

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    }));

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(async ({ message, path }) => {
          console.warn(`[GraphQL error]: Message: ${message}, Path: ${path}`);
          if (message === "Unauthorized") {
            await logout({ logoutParams: { returnTo: window.location.origin } });
          }
        });
      }
      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
    });

    return new ApolloClient({
      link: from([errorLink, authLink.concat(httpLink)]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "network-only",
          nextFetchPolicy: "cache-first",
        },
        query: {
          fetchPolicy: "network-only",
        },
      },
    });
  }, [token, tokenReady, logout]);

  if (isLoading || !tokenReady || !client) return null; // or loading spinner, skeleton, etc.

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
