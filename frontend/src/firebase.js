// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-8e783.firebaseapp.com",
  projectId: "mern-blog-8e783",
  storageBucket: "mern-blog-8e783.appspot.com",
  messagingSenderId: "579254201038",
  appId: "1:579254201038:web:0de58ab18dfd7c6398be9f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);