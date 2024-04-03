"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "./";

export interface RefereeClient {
  _client?: Client;
  token: string;
  tokenMetadata?: {
    iat: number;
    exp: number;
  };
}

const Context = createContext<RefereeClient>({
  token: "",
});

export function ClientContext({
  children,
  host,
  token,
}: {
  children: JSX.Element;
  host: string;
  token: string;
}) {
  const [client, setClient] = useState<Client>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof token === "undefined") return;

    setClient(new Client(host, token));
    setLoaded(true);

    return () => {
      setClient(undefined);
      setLoaded(false);
    };
  }, [token]);

  return (
    <Context.Provider
      value={{
        _client: client,
        token,
      }}
    >
      <div>{loaded && children}</div>
    </Context.Provider>
  );
}

export function useClient(
  scope: "user" | "admin" | "auth" | "public" = "admin",
): { client: Client } {
  const { _client } = useContext(Context);

  if (!_client) {
    throw new Error("RefereeClient not initialized");
  }

  if (scope !== _client.scope) {
    const client = Object.assign(
      Object.create(Object.getPrototypeOf(_client)),
      _client,
    );
    client.setScope(scope);
    return { client };
  }

  return { client: _client };
}
