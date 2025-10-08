import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import './History.css';

const History = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🎯 Componente History montado');
    
    // Verificar se o usuário está logado
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ Usuário não está logado. Redirecionando...');
      setError('Você precisa estar logado para ver o histórico');
      setLoading(false);
      return;
    }

    console.log('👤 Usuário logado:', user.uid, user.email);

    // Criar a query para buscar os entries do usuário atual
    const q = query(
      collection(db, 'entries'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    console.log('🔍 Executando query no Firestore...');
    console.log('📋 Query:', q);

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        console.log('✅ Dados recebidos do Firestore');
        console.log('📊 Número de documentos:', querySnapshot.size);
        
        const entriesData = [];
        
        querySnapshot.forEach((doc) => {
          const entryData = doc.data();
          console.log('📄 Documento:', doc.id, entryData);
          entriesData.push({ 
            id: doc.id, 
            ...entryData 
          });
        });

        console.log('🎁 Entries processados:', entriesData);
        setEntries(entriesData);
        setLoading(false);
        setError(null);
      }, 
      (error) => {
        console.error('❌ Erro na consulta do Firestore:', error);
        setError('Erro ao carregar histórico: ' + error.message);
        setLoading(false);
      }
    );

    // Cleanup function
    return () => {
      console.log('🧹 Limpando subscription do Firestore');
      unsubscribe();
    };
  }, []);

  // Função para formatar a data de forma segura
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    
    try {
      let date;
      if (timestamp.toDate) {
        // É um Timestamp do Firestore
        date = timestamp.toDate();
      } else if (timestamp.seconds) {
        // É um objeto timestamp com seconds
        date = new Date(timestamp.seconds * 1000);
      } else {
        // É uma string ou outro formato
        date = new Date(timestamp);
      }
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error, timestamp);
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-state">
          <h2>📚 Seu Histórico de Gratidão</h2>
          <p>Carregando suas entries... ⏳</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-container">
        <div className="error-state">
          <h2>📚 Seu Histórico de Gratidão</h2>
          <p className="error-message">❌ {error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>📚 Seu Histórico de Gratidão</h2>
      
      <div className="history-info">
        <p>📊 Total de registros: <strong>{entries.length}</strong></p>
        {entries.length > 0 && (
          <p>📅 Período: {formatDate(entries[entries.length-1].date)} até {formatDate(entries[0].date)}</p>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>Nenhum registro encontrado</h3>
          <p>Comece preenchendo seu diário de gratidão para ver seu histórico aqui!</p>
          <p>✨ Cada momento de gratidão conta!</p>
        </div>
      ) : (
        <div className="entries-list">
          {entries.map((entry, index) => (
            <div key={entry.id || index} className="entry-card">
              <div className="entry-header">
                <span className="entry-date">{formatDate(entry.date)}</span>
                <span className="entry-count">{entry.entries ? entry.entries.length : 0} itens</span>
              </div>
              
              <div className="entry-content">
                {entry.entries && entry.entries.map((item, itemIndex) => (
                  item && item.trim() && (
                    <div key={itemIndex} className="gratitude-item">
                      <span className="item-number">{itemIndex + 1}.</span>
                      <span className="item-text">{item}</span>
                    </div>
                  )
                ))}
                
                {(!entry.entries || entry.entries.length === 0) && (
                  <p className="no-items">Nenhum item registrado nesta entry</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Debug info - remover em produção */}
      <div className="debug-info" style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px', fontSize: '12px' }}>
        <strong>🔧 Informações de Debug:</strong>
        <br/>• Usuário ID: {auth.currentUser?.uid || 'Não logado'}
        <br/>• Total de entries: {entries.length}
        <br/>• Firestore conectado: {db ? 'Sim' : 'Não'}
      </div>
    </div>
  );
};

export default History;