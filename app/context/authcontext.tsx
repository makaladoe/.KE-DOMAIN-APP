// app/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBLKjz2C6PlDyBFwNUAphwatB_Z9ciJi2I",
  authDomain: "domainapp-c5557.firebaseapp.com",
  projectId: "domainapp-c5557",
  storageBucket: "domainapp-c5557.firebasestorage.app",
  messagingSenderId: "18844736105",
  appId: "1:18844736105:web:a380802941b505dd29e0f8"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Context types
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, role: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Keep track of user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ✅ Auth functions
  const signUp = async (email: string, password: string, role: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Save user role in Firestore
   // await setDoc(doc(db, "users", uid), {
     // email,
    //  role,
     // createdAt: new Date()
   // });

    return userCredential.user; // ✅ return User so caller knows it's done
  };

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // ✅ return User
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook to use Auth anywhere
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
