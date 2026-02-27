import { SplashScreen, useRouter, useSegments } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";

export const AuthContext = createContext({
  isLoggedIn: false,
  isReady: false,
  LogIn: async () => null,
  LogOut: async () => {},
  Signup: async () => null,
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();
  const segments = useSegments();

  // Auto-navigation based on auth state
  useEffect(() => {
    if (!isReady) return;
    const inProtectedGroup = segments[0] === "(protected)";
    if (!isLoggedIn && inProtectedGroup) {
      router.replace("/login");
    } else if (isLoggedIn && !inProtectedGroup) {
      router.replace("/");
    }
  }, [isLoggedIn, isReady, segments]);

  // Signup
  const Signup = async (email, password) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", user.uid), {
        timestamp: serverTimestamp(),
        email: user.email,
        uid: user.uid,
      });
      await setDoc(doc(db, "users", user.uid),{
        email: user.email,
        uid: user.uid,
        signupMethod: "email/password",
        createdAt: serverTimestamp(),
      }, { merge: true });
      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  // Login
  const LogIn = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", user.uid), {
        timestamp: serverTimestamp(),
        email: user.email,
        uid: user.uid,
      });
      await setDoc(doc(db, "users", user.uid), {
        lastLogin: serverTimestamp(),
        email: user.email,
      }, { merge: true });
      return user;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  // Logout
  const LogOut = async () => {
    try {
      if (currentUser) {
        await setDoc(doc(db, "users", ), {
          timestamp: serverTimestamp(),
          email: currentUser.email,
          uid: currentUser.uid,
        });
        await setDoc(doc(db, "users", currentUser.uid), {
          lastLogout: serverTimestamp(),
        }, { merge: true });
      }
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ?? null);
      setIsLoggedIn(!!user);
      setIsReady(true);
      SplashScreen.hideAsync();
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isReady, LogIn, LogOut, Signup }}>
      {children}
    </AuthContext.Provider>
  );
}
