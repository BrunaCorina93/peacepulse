// src/App.jsx
import React, { useState, useEffect } from 'react';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import GratitudeJournal from './components/GratitudeJournal';
import History from './components/History';
import BreathingGuide from './components/BreathingGuide';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('journal'); // journal, history, breathing
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setUser(auth.currentUser);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setCurrentView('journal');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Carregando PeacePulse... 🌊</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Função para renderizar o conteúdo baseado na view atual
  const renderContent = () => {
    switch (currentView) {
      case 'journal':
        return <GratitudeJournal />;
      case 'history':
        return <History />;
      case 'breathing':
        return <BreathingGuide />;
      default:
        return <GratitudeJournal />;
    }
  };

  return (
    <div className="app">
      {/* Header com Navegação */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🌊 PeacePulse</h1>
            <span className="user-email">Olá, {user.email}!</span>
          </div>
          
          <nav className="navigation">
            <button 
              className={`nav-button ${currentView === 'journal' ? 'active' : ''}`}
              onClick={() => setCurrentView('journal')}
            >
              📖 Diário
            </button>
            <button 
              className={`nav-button ${currentView === 'history' ? 'active' : ''}`}
              onClick={() => setCurrentView('history')}
            >
              📚 Histórico
            </button>
            <button 
              className={`nav-button ${currentView === 'breathing' ? 'active' : ''}`}
              onClick={() => setCurrentView('breathing')}
            >
              🌬️ Respiração
            </button>
          </nav>

          <button className="logout-button" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="app-main">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>✨ PeacePulse - Seu diário digital de gratidão e bem-estar</p>
      </footer>
    </div>
  );
}

export default App;