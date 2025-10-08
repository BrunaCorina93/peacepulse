// src/components/BreathingGuide.jsx
import React, { useState, useEffect } from 'react';
import './BreathingGuide.css';

const BreathingGuide = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('ready'); // ready, inhale, hold, exhale
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  // Configuração dos tempos (em segundos)
  const phaseTimes = {
    inhale: 4,   // Inspirar
    hold: 7,     // Segurar
    exhale: 8    // Expirar
  };

  // Lógica do timer com useEffect
  useEffect(() => {
    let timer;
    
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Transição para próxima fase
      switch (currentPhase) {
        case 'inhale':
          setCurrentPhase('hold');
          setTimeLeft(phaseTimes.hold);
          break;
        case 'hold':
          setCurrentPhase('exhale');
          setTimeLeft(phaseTimes.exhale);
          break;
        case 'exhale':
          setCurrentPhase('inhale');
          setTimeLeft(phaseTimes.inhale);
          setCycleCount(prev => prev + 1);
          
          // Parar após 5 ciclos (opcional)
          if (cycleCount >= 4) {
            stopBreathing();
          }
          break;
        default:
          break;
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, currentPhase, cycleCount, phaseTimes]);

  const startBreathing = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setTimeLeft(phaseTimes.inhale);
    setCycleCount(0);
  };

  const stopBreathing = () => {
    setIsActive(false);
    setCurrentPhase('ready');
    setTimeLeft(0);
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'ready':
        return 'Pronto para começar?';
      case 'inhale':
        return 'INSPIRE...';
      case 'hold':
        return 'SEGURE...';
      case 'exhale':
        return 'EXPIRE...';
      default:
        return '';
    }
  };

  const getPhaseDescription = () => {
    switch (currentPhase) {
      case 'ready':
        return 'Clique em iniciar para começar a sessão de respiração';
      case 'inhale':
        return 'Respire fundo pelo nariz';
      case 'hold':
        return 'Mantenha o ar nos pulmões';
      case 'exhale':
        return 'Solte o ar lentamente pela boca';
      default:
        return '';
    }
  };

  return (
    <div className="breathing-guide">
      <div className="breathing-header">
        <h2>🌬️ Guia de Respiração</h2>
        <p>Exercício 4-7-8 para relaxamento e redução de ansiedade</p>
      </div>

      <div className="breathing-content">
        {/* Área do círculo animado */}
        <div className="circle-container">
          <div className={`breathing-circle ${currentPhase}`}>
            <span className="timer">{timeLeft}</span>
          </div>
        </div>

        {/* Instruções */}
        <div className="instructions">
          <h3 className="phase-instruction">{getPhaseInstruction()}</h3>
          <p className="phase-description">{getPhaseDescription()}</p>
        </div>

        {/* Controles */}
        <div className="controls">
          {!isActive ? (
            <button className="start-button" onClick={startBreathing}>
              🚀 Iniciar Sessão
            </button>
          ) : (
            <button className="stop-button" onClick={stopBreathing}>
              ⏹️ Parar
            </button>
          )}
        </div>

        {/* Estatísticas */}
        <div className="stats">
          <p>Ciclos completos: <strong>{cycleCount}</strong></p>
          <div className="phase-indicators">
            <span className={`phase-dot ${currentPhase === 'inhale' ? 'active' : ''}`}>Inspirar</span>
            <span className={`phase-dot ${currentPhase === 'hold' ? 'active' : ''}`}>Segurar</span>
            <span className={`phase-dot ${currentPhase === 'exhale' ? 'active' : ''}`}>Expirar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingGuide;