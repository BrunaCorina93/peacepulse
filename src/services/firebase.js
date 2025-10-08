import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAOM2tOZVGc3hYQhfvjWBvPwPXn_DvJXr0",
  authDomain: "peacepulse-final.firebaseapp.com",
  projectId: "peacepulse-final",
  storageBucket: "peacepulse-final.firebasestorage.app",
  messagingSenderId: "620147217500",
  appId: "1:620147217500:web:f906001145d3b7a6a80299"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔥 CONEXÃO CORRIGIDA - usar a URL exata do emulador
console.log('🔄 Iniciando conexão com emuladores...');

// Conectar Auth Emulator
connectAuthEmulator(auth, "http://127.0.0.1:60001", { disableWarnings: true });
console.log('✅ Auth Emulator conectado: http://127.0.0.1:60001');

// Conectar Firestore Emulator  
connectFirestoreEmulator(db, '127.0.0.1', 60002);
console.log('✅ Firestore Emulator conectado: http://127.0.0.1:60002');

console.log('🚀 Todos os emuladores conectados!');















































