import ReactNativeASyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: "tutor-229e4.firebaseapp.com",
  projectId: "tutor-229e4",
  storageBucket: "tutor-229e4.firebasestorage.app",
  messagingSenderId: "355624443578",
  appId: "1:355624443578:web:cfdc56507e73bd393aac83",
  measurementId: "G-FC1TG785YQ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeASyncStorage),
});

export { auth, db };



