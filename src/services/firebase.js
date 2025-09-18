import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// SUAS CREDENCIAIS DO FIREBASE - VOCÊ VAI PRECISAR CONFIGURAR!
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

// Initialize Firebase Authentication
const auth = getAuth(app);

// Exportações
export { auth };
export default app;