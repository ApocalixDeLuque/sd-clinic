"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as jose from "jose";
import { ApiError } from ".";
import { ClientContext, useClient } from "./context";
import toast from "react-hot-toast";

export interface Session {
  token?: SessionToken;
  user?: User;
  isAuth: boolean;
  requestRefresh: boolean;

  init: (token: string) => void;
  logout: () => void;
  reloadToken: () => void;
}

export interface User {
  id: string;
  isAdmin: boolean;
  name: string;
}

type RefereeJWTPayload = jose.JWTPayload & {
  data: User;
};

export interface SessionToken {
  token: string;
  claims: RefereeJWTPayload;
}

const Context = createContext<Session>({
  init: () => {
    throw new Error("SessionContext not initialized");
  },
  logout: () => {
    throw new Error("SessionContext not initialized");
  },
  reloadToken: () => {
    throw new Error("SessionContext not initialized");
  },
  isAuth: false,
  requestRefresh: false,
});

function SessionRenewChecker({ children }: { children?: JSX.Element }) {
  const session = useSession();
  const { client } = useClient();

  const handleTokenRenewCheck = useCallback(async () => {
    if (!session.token) return;

    const claims = session.token.claims;
    if (claims.iat && claims.exp) {
      // if expires in less than a week
      const delta = claims.exp * 1000 - Date.now();
      const aWeek = 1000 * 60 * 60 * 24 * 7;
      if (delta < aWeek || session.requestRefresh) {
        console.info("Renewing token");
        try {
          const newToken = await client.auth
            .renew(session.token.token)
            .submit();
          session.init(newToken.token);
        } catch (err) {
          if (err instanceof ApiError) {
            if (err.httpCode === 401) {
              session.logout();
              toast.error("Sesión expirada, necesitas iniciar sesión de nuevo");
            }
          }
        }
      }
    }
  }, [client.auth, session]);

  useEffect(() => {
    void handleTokenRenewCheck().then();
  }, [handleTokenRenewCheck, session.requestRefresh]);

  return <> {children} </>;
}

export function SessionContext({ children }: { children: JSX.Element }) {
  const [token, setToken] = useState<SessionToken>();
  const [user, setUser] = useState<User>();
  const [loaded, setLoaded] = useState(false);
  const [requestRefresh, setRequestRefresh] = useState(false);

  useEffect(() => {
    const localToken = localStorage.getItem("sd_token");

    if (localToken) {
      init(localToken);
    }

    setLoaded(true);

    return () => {
      setLoaded(false);
    };
  }, []);

  const init = (newToken: string) => {
    const claims = jose.decodeJwt(newToken) as RefereeJWTPayload;

    console.log(claims);

    setToken({
      token: newToken,
      claims,
    });

    setUser({
      ...claims.data,
      id: claims.sub ?? "",
    });

    setRequestRefresh(false);

    localStorage.setItem("sd_token", newToken);
  };

  const logout = () => {
    setToken(undefined);
    setUser(undefined);
    localStorage.removeItem("sd_token");
  };

  const reloadToken = async () => {
    setRequestRefresh(true);
  };

  // as this session provider belongs to the project
  // we can inject launchdarkly here

  return (
    <Context.Provider
      value={{
        token,
        user,
        init,
        logout,
        requestRefresh,
        reloadToken,
        isAuth: Boolean(token),
      }}
    >
      {loaded ? (
        <ClientContext
          host={process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8585"}
          token={token?.token ?? ""}
        >
          <SessionRenewChecker>
            <>
              <div>{children}</div>
            </>
          </SessionRenewChecker>
        </ClientContext>
      ) : (
        []
      )}
    </Context.Provider>
  );
}

export function useSession() {
  return useContext(Context);
}
