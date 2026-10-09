import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBItCODkqjOBCSTHQLst_zimOnsrYcPUGo",
  authDomain: "staropub-menu.firebaseapp.com",
  projectId: "staropub-menu",
  storageBucket: "staropub-menu.firebasestorage.app",
  messagingSenderId: "211658818022",
  appId: "1:211658818022:web:e944e70d38b71515b25627",
  measurementId: "G-GQ5PKEN8SW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, signInWithPopup };
