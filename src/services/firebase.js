// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9oXopW6K8F-ZA8PEbNHu1jtAySSEkR4I",
  authDomain: "peacepulse-edf39.firebaseapp.com",
  projectId: "peacepulse-edf39",
  storageBucket: "peacepulse-edf39.firebasestorage.app",
  messagingSenderId: "647075014961",
  appId: "1:647075014961:web:6512dd456bd9ce96e1a810",
  measurementId: "G-391LBVV1YS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);