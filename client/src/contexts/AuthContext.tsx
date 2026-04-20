/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, createContext, useEffect, useState } from "react";
import i18n from "../i18n";
import { serverURL } from "../serverURL";

interface User {
  _id: string;
  email?: string;
  username: string;
  avatar: string;
  sketchs: string[];
  likes: string[];
  comments: string[];
  info: string;
}

interface fetchResult {
  token: string;
  verified: boolean;
  user: User;
}

interface fetchFailed {
  error: String;
}

interface AuthContextType {
  user: User | null;
  error: Error | null;
  login(email: string, password: string): void;
  logout(): void;
}

const initialAuth: AuthContextType = {
  user: null,
  error: null,
  login: () => {
    throw new Error("login not implemented.");
  },
  logout: () => {
    throw new Error("logout not implemented.");
  },
};

export const AuthContext = createContext<AuthContextType>(initialAuth);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<Error | null>(null);

  // Helper to get translated strings OUTSIDE of React components.
  // We can't use the useTranslation() hook here because this isn't rendered
  // inside the Provider — we reference the i18n instance directly instead.
  const t = (key: string) => i18n.t(key);

  const login = async (email: string, password: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    const urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);

    try {
      const response = await fetch(`${serverURL}users/login`, {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
      });

      if (response.ok) {
        const result = (await response.json()) as fetchResult;
        if (result.user) {
          setUser(result.user);
          localStorage.setItem("token", result.token);
        }
      } else {
        const result = (await response.json()) as fetchFailed;
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert(t("auth.loginError"));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const checkForToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchActiveUser(token);
    } else {
      setUser(null);
    }
  };

  const fetchActiveUser = async (token: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    try {
      const response = await fetch(`${serverURL}users/active`, {
        method: "GET",
        headers: myHeaders,
      });
      const result = await response.json();
      setUser(result);
      return result;
    } catch (err) {
      console.error("error :>> ", err);
    }
  };

  useEffect(() => {
    checkForToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};
