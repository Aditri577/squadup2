import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC9YRC5vMMWgmVBgwZ7oM9rYq-E4pxVuiY",
  authDomain: "squadup2-493e0.firebaseapp.com",
  projectId: "squadup2-493e0",
  storageBucket: "squadup2-493e0.firebasestorage.app",
  messagingSenderId: "496247423194",
  appId: "1:496247423194:web:b2851a4f78034e33dfe5e3",
  measurementId: "G-E5T1KL1BV8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

export default app;