"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Extended User type to include custom Firestore fields
interface User extends FirebaseUser {
  name?: string;
  avatar?: string;
  provider?: string;
  createdAt?: Date;
  lastLogin?: Date;
}

// Context value type
interface AuthContextValue {
  user: User | null;
}

// Create the AuthContext to store user info
const AuthContext = createContext<AuthContextValue>({ user: null });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeFromUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUser({
              ...firebaseUser,
              ...userData,
            });
          } else {
            setUser(firebaseUser as User);
          }
        });

        return () => unsubscribeFromUserDoc();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
