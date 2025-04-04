// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyD7LG1n74eLLrbnE8kB24AEKOTQ15alU0U",
  authDomain: "skillstation123.firebaseapp.com",
  projectId: "skillstation123",
  storageBucket: "skillstation123.firebasestorage.app",
  messagingSenderId: "446161614763",
  appId: "1:446161614763:web:9db38d84eca510cce104ee",
  measurementId: "G-X7E1MF88SB"
};

// Initialize Firebase
export { serverTimestamp }
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db=getFirestore(app)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ Auth persistence set to local.");
  })
  .catch((error) => {
    console.error("❌ Failed to set persistence", error);
  });// 👇 set persistence once at app startup


export { auth };