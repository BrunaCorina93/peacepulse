import React, { useState, useEffect } from 'react';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import GratitudeJournal from './components/GratitudeJournal';
import History from './components/History';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Observa mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    // A função onAuthStateChanged vai atualizar o estado automaticamente
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        // Usuário LOGADO - Mostra o diário
        <>
          <header className="app-header">
            <div className="header-content">
              <h1>🌊 PeacePulse</h1>
              <p>Seu diário digital de gratidão e mindfulness</p>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </header>
          
          <main>
            <GratitudeJournal />
            <History />
          </main>
        </>
      ) : (
        // Usuário NÃO LOGADO - Mostra tela de login
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;