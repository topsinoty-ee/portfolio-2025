import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import { ReactNode, useEffect, useState } from "react";
import { setContext } from "@apollo/client/link/context";
import { useAuth0 } from "@auth0/auth0-react";

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  const [bearer, setBearer] = useState<string | null>(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then(setBearer);
    } else {
      setBearer(null);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
  });

  const authLink = setContext((_, { headers, ...rest }) => {
    if (!bearer) return { headers, ...rest };
    return {
      headers: {
        ...headers,
        authorization: bearer ? `Bearer ${bearer}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "network-only",
      },
      query: {
        fetchPolicy: "network-only",
      },
    },
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
