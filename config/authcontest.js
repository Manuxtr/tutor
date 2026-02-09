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
      router.replace("/"); // or your main protected route
    }
  }, [isLoggedIn, isReady, segments]);

  // Signup function
  const Signup = async (email, password) => {
    console.log("Attempting signup with:", email);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await saveSignupEvent(user);
      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  // Login function - NOW ACTUALLY SIGNS IN WITH FIREBASE
  const LogIn = async (email, password) => {
    console.log("Attempting login with:", email);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await saveLoginEvent(user);
      return user;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  // Logout function
  const LogOut = async () => {
    try {
      if (currentUser) {
        await saveLogoutEvent(currentUser);
      }
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  // Save signup event to firestore
  const saveSignupEvent = async (user) => {
    try {
      if (user?.uid) {
        await setDoc(
          doc(db, "users", user.uid, "signupHistory", new Date().toISOString()),
          {
            event: "signup",
            timestamp: serverTimestamp(),
            email: user.email,
            uid: user.uid,
          },
        );
        await setDoc(
          doc(db, "users", user.uid),
          {
            email: user.email,
            uid: user.uid,
            fullname: user.fullname || null,
            signupMethod: "email/password",
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
          },
          { merge: true },
        );
      }
    } catch (error) {
      console.error("Error saving signup event:", error);
    }
  };

  // Save login event to Firestore
  const saveLoginEvent = async (user) => {
    try {
      if (user?.uid) {
        await setDoc(
          doc(db, "users", user.uid, "loginHistory", new Date().toISOString()),
          {
            event: "login",
            timestamp: serverTimestamp(),
            email: user.email,
            uid: user.uid,
          },
        );
        await setDoc(
          doc(db, "users", user.uid),
          {
            lastLogin: serverTimestamp(),
            email: user.email,
          },
          { merge: true },
        );
      }
    } catch (error) {
      console.error("Error saving login event:", error);
    }
  };

  // Save logout event to Firestore
  const saveLogoutEvent = async (user) => {
    try {
      if (user?.uid) {
        await setDoc(
          doc(db, "users", user.uid, "loginHistory", new Date().toISOString()),
          {
            event: "logout",
            timestamp: serverTimestamp(),
            email: user.email,
            uid: user.uid,
          },
        );
        await setDoc(
          doc(db, "users", user.uid),
          {
            lastLogout: serverTimestamp(),
          },
          { merge: true },
        );
      }
    } catch (error) {
      console.error("Error saving logout event:", error);
    }
  };

  // Initialize Firebase auth listener on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "Logged in" : "Logged out");
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
      setIsReady(true);
      SplashScreen.hideAsync();
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isReady, LogIn, LogOut, Signup }}
    >
      {children}
    </AuthContext.Provider>
  );
}


