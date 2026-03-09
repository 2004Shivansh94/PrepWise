// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVmFQxIhya4vd9cVVFhU7G6-iroH1gd0U",
  authDomain: "ai-mock-8ebb0.firebaseapp.com",
  projectId: "ai-mock-8ebb0",
  storageBucket: "ai-mock-8ebb0.firebasestorage.app",
  messagingSenderId: "611843065105",
  appId: "1:611843065105:web:bed3783e90a0d97ae4b8b0",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
