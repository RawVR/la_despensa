import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBQnLXE34um1oZrbjCoXJtsE_WdzyZruOc",
    authDomain: "ladespensa-faa30.firebaseapp.com",
    projectId: "ladespensa-faa30",
    storageBucket: "ladespensa-faa30.appspot.com",
    messagingSenderId: "927153684983",
    appId: "1:927153684983:web:0ac9f5b4f47a794dab2ef2",
    measurementId: "G-19Q9V058WV"
  },
}

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);
const analytics = getAnalytics(app);
