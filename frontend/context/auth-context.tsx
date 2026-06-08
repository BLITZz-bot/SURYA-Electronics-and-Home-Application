"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut, getIdToken } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getApiUrl } from "../lib/api-utils";

interface AuthContextType {
  user: User | null;
  dbUser: any | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  token: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
  refreshToken: async () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const idToken = await getIdToken(firebaseUser);
          setToken(idToken);
          
          const url = getApiUrl('/api/users/profile');
          const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${idToken}` }
          });
          
          if (response.ok) {
            const profile = await response.json();
            setDbUser(profile);
            const role = profile.role?.toLowerCase();
            setIsAdmin(role === 'admin' || role === 'primary_admin' || role === 'secondary_admin');
          }
        } catch (err) {
          console.error("Auth initialization error:", err);
          setIsAdmin(false);
        }
      } else {
        setToken(null);
        setDbUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const refreshToken = async () => {
    if (user) {
      const freshToken = await getIdToken(user, true);
      setToken(freshToken);
      return freshToken;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, token, loading, isAdmin, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
