/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode, createContext, useEffect, useState } from "react"
import { serverURL } from "../serverURL"


interface User {
  _id:  string,
  email?: string,
  username: string,
  avatar: string,
  sketchs: string[], 
  likes: string[],
  comments: string[],
  info:string
}

interface fetchResult {
  token: string,
  verified: boolean,
  user: User
}

interface fetchFailed {
  error: String
}

interface AuthContextType {
  user: User | null,
  error: Error | null,
  login(email: string, password: string): void,
  logout(): void
}

// export const AuthContext = createContext<AuthContextType | null>(null); // not recommended
// export const AuthContext = createContext<AuthContextType>({} as AuthContextType); // less recommended
// export const AuthContext = createContext<AuthContextType>(null!); // less recommended

const initialAuth: AuthContextType = {
  user: null,
  error: null,
  login: () => {
    throw new Error('login not implemented.');
  },
  logout: () => {
    throw new Error('logout not implimented.');
  }
};

export const AuthContext = createContext<AuthContextType>(initialAuth);

export const AuthContextProvider = ({children} : {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  // console.log("active user : ", user)
  const [error, setError] = useState<Error | null>(null);

  const login = async(email: string, password: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    const urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
    };
    try {
      // const response = await fetch(`https://shareyourserver.vercel.app/api/users/login`, requestOptions);
       const response = await fetch(`${serverURL}users/login`, requestOptions);

      // console.log(response);
      console.log('process.env.REACT_APP_BASE_URL :>> ', process.env.REACT_APP_BASE_URL);
      console.log('process.env.SERVER_MODE :>> ', process.env.SERVER_MODE);
      if (response.ok) {
        const result = await response.json() as fetchResult
        if (result.user) {
          setUser(result.user);
          // console.log(result.user)
          localStorage.setItem("token", result.token);
   
        }
        // console.log(result);
      } else {
        const result = await response.json() as fetchFailed
        alert(result.error)
      }
    } catch (error) {
      console.log(error);
      // setError(error); //I still have to figure out how to type the unknown fetch results
      alert("Something went wrong - check console for error")
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  }

  const checkForToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // console.log("There is a token")
      fetchActiveUser(token);
      // setUser(true)
    } else {
      // console.log("There is no token")
      setUser(null)
    }
  }

const fetchActiveUser = async (token: string) => {
    const  myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  
  const requestOptions = {
      method: 'GET',
      headers: myHeaders,
  };

try {
  const response = await fetch(`${serverURL}users/active`, requestOptions);
  const result = await response.json();
  // console.log("active user result", result)
  setUser(result)
  return result;
 
} catch (error) {
  console.log('error :>> ', error);
}

  }

  useEffect(() => {
    checkForToken();
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout,  error }}>
      { children }
    </AuthContext.Provider>
  )
}