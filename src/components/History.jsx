import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import './History.css';

const History = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    useEffect(() => {
  // TEMPORARIAMENTE: Força o UID do usuário que está nos documentos
  const testUserId = "D3rrVjQAldOQxLZbu55cdMTsrKH2"; // ← USE O MESMO UID DOS SEUS DOCUMENTOS
  
  const q = query(
    collection(db, 'entries'),
    where('userId', '==', testUserId), // ← USA O UID FIXO
    orderBy('date', 'desc')
  );

  console.log('🔍 Buscando documentos para o usuário:', testUserId);

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    console.log('📦 Encontrados:', querySnapshot.size, 'documentos');
    const entriesData = [];
    querySnapshot.forEach((doc) => {
      console.log('📄 Documento:', doc.id, doc.data());
      entriesData.push({ id: doc.id, ...doc.data() });
    });
    setEntries(entriesData);
    setLoading(false);
  }, (error) => {
    console.error('❌ Erro na query:', error);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

    // Cria a query para buscar apenas os entries do usuário atual, ordenados por data
    const q = query(
      collection(db, 'entries'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('date', 'desc')
    );

    // Escuta as mudanças em tempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entriesData = [];
      querySnapshot.forEach((doc) => {
        entriesData.push({ id: doc.id, ...doc.data() });
      });
      setEntries(entriesData);
      setLoading(false);
    });

    // Limpa a inscrição quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  // Função para formatar a data
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    const date = timestamp.toDate();
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Carregando seu histórico... ⏳</div>;
  }

  return (
    <div className="history-container">
      <h2>📚 Seu Histórico de Gratidão</h2>
      
      {entries.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum registro encontrado.</p>
          <p>Comece preenchendo seu diário de gratidão acima! ✨</p>
        </div>
      ) : (
        <div className="entries-list">
          {entries.map((entry) => (
            <div key={entry.id} className="entry-card">
              <div className="entry-date">
                {formatDate(entry.date)}
              </div>
              <div className="entry-content">
                {entry.entries.map((item, index) => (
                  item.trim() && (
                    <div key={index} className="gratitude-item">
                      <span className="item-number">{index + 1}.</span>
                      <span className="item-text">{item}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;