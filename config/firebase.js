import ReactNativeASyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSOZnzZF30McwfhRN89OD4iC___JLOQm8",
  authDomain: "copreneur-13999.firebaseapp.com",
  projectId: "copreneur-13999",
  storageBucket: "copreneur-13999.firebasestorage.app",
  messagingSenderId: "825629493346",
  appId: "1:825629493346:web:cc0f7da4565fa42498e93b",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeASyncStorage),
});

export { auth, db };



