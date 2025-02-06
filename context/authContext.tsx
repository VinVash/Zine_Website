import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { auth, db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { getUser, IUser } from "../apis/users";
import { log } from "console";
import { setAuthorizationHeader } from "../api/axios";

interface UserType {
  email: string | null;
  uid: number | null;
}

interface IAuthContext {
  user: UserType;
  authUser: IUser | undefined;
  logIn: (email: string, password: string) => Promise<any>;
  signUp: (name: string, email: string, password: string) => Promise<any>;
  logOut: () => Promise<void>;
}
export const sendPasswordResetEmail = async (email: string) => {
  try {
    const response = await axios.post(`/auth/forgot?email=${email}`);
    return response;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};
const AuthContext = createContext<IAuthContext>({ user: { email: null, uid: null }, authUser: undefined, logIn: async () => {}, signUp: async () => {}, logOut: async () => {} });
export const useAuth = () => useContext<IAuthContext>(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType>({ email: null, uid: null });
  const [authUser, setAuthUser] = useState<IUser | undefined>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      // console.log("token", token);
      const response = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if(token) setAuthorizationHeader(token)
      // console.log("inside user details", response);
      return response.data;
    } catch (err) {
      // console.log(err);
      throw err;
    }
  };

  const logIn = async (email: string, password: string): Promise<any> => {
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { jwt, success, failureReason } = response.data;
      if(failureReason != null) {
        throw new Error(failureReason);
      }
      console.log(response.data);
      localStorage.setItem("token", jwt);
      // document.cookie = `token=${jwt}; path=/;`;
      getUserDetails().then((res) => {
        const userData = res as IUser;
        setAuthorizationHeader(jwt)
        setAuthUser(userData);
        setUser({ uid: userData.id, email: userData.email });
      });
      // console.log("userResponse", userDetails);
      return;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<any> => {
    try {
      const res = await axios.post("/auth/register", { name, email, password });
      return res;
    } catch (error) {
      console.error("Singup failed:", error);
      throw error;
    }
  };
  useEffect(() => {
    // console.log("authcontext", authUser);
  }, [authUser]);
  useEffect(() => {
    // console.log("loaded", loading);
  });
  useEffect(() => {
    // console.log("inside use effect");

    let isMounted = true;
    // const controller = new AbortController();

    const getUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("/auth/me", {
            // signal: controller.signal,
            headers: { Authorization: `Bearer ${token}` },
          });
          isMounted && setAuthUser(response.data);
          // console.log(response);
        }

        setLoading(false);
      } catch (err) {
        // console.log(err);
        setLoading(false);
      }
    };
    getUserDetails();

    return () => {
      isMounted = false;
      // controller.abort();
    };
  }, []);

  const logOut = async () => {
    localStorage.removeItem("token");
    await router.push("/login");
    setUser({ email: null, uid: null });
    setAuthUser(undefined);
  };

  return <AuthContext.Provider value={{ user, authUser, logIn, signUp, logOut }}>{loading ? null : children}</AuthContext.Provider>;
};
