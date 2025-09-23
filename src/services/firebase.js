import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  // Sua configuração do Firebase
  apiKey: "sua-chave-aqui",
  authDomain: "peacepulse-final.firebaseapp.com",
  projectId: "peacepulse-final",
  storageBucket: "peacepulse-final.appspot.com",
  messagingSenderId: "seu-id-aqui",
  appId: "seu-app-id-aqui"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Conexão com emuladores - CORRIGIDO
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Usar URL completa para auth
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  
  // Conectar Firestore
  connectFirestoreEmulator(db, 'localhost', 8080);
  
  console.log('✅ Conectado aos emuladores do Firebase');
}
