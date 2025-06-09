import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import { ReactNode, useEffect, useState } from "react";
import { setContext } from "@apollo/client/link/context";
import { useAuth0 } from "@auth0/auth0-react";
import { onError } from "@apollo/client/link/error";

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  const [bearer, setBearer] = useState<string | null>(null);
  const { isAuthenticated, getAccessTokenSilently, logout } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then(setBearer)
        .catch(async (error) => {
          await logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          });
          throw new Error("Failed to get token: " + error.message);
        });
    } else {
      setBearer(null);
    }
  }, [isAuthenticated, getAccessTokenSilently, logout]);

  const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: bearer ? `Bearer ${bearer}` : "",
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(async ({ message }) => {
        if (message === "Unauthorized") {
          await logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          });
        }
      });
    }
    if (networkError) throw new Error(`Network error: ${networkError}`);
  });

  const client = new ApolloClient({
    link: errorLink.concat(authLink.concat(httpLink)),
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

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
