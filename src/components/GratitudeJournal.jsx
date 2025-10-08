import React, { useState } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './GratitudeJournal.css'; // Vamos criar o CSS depois

const GratitudeJournal = () => {
  const [entries, setEntries] = useState(['', '', '']);
  const [isSaving, setIsSaving] = useState(false);

  // Função para atualizar um campo específico
  const handleEntryChange = (index, value) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };

  // Função para salvar no Firebase
  //const handleSave = async (e) => {
    //e.preventDefault();
    const handleSave = async (e) => {
  e.preventDefault();
  
  if (!auth.currentUser) {
    alert('Você precisa estar logado!');
    return;
  }

  alert('🎉 Funcionou! Login configurado com sucesso!\n\nFirestore será configurado em seguida.');
    // Verifica se o usuário está logado
    if (!auth.currentUser) {
      alert('Você precisa estar logado para salvar!');
      return;
    }

    // Verifica se pelo menos um campo foi preenchido
    if (entries.every(entry => entry.trim() === '')) {
      alert('Preencha pelo menos um campo de gratidão!');
      return;
    }

    setIsSaving(true);

    try {
      // Salva no Firestore
      await addDoc(collection(db, 'entries'), {
        userId: auth.currentUser.uid,
        entries: entries,
        date: serverTimestamp(), // Data do servidor Firebase
        createdAt: new Date().toISOString()
      });

      // Limpa os campos após salvar
      setEntries(['', '', '']);
      alert('Diário salvo com sucesso! 🌟');
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="journal-container">
      <h2>📖 Meu Diário de Gratidão</h2>
      <p className="subtitle">Registre 3 coisas boas do seu dia:</p>
      
      <form onSubmit={handleSave} className="journal-form">
        {entries.map((entry, index) => (
          <div key={index} className="input-group">
            <label htmlFor={`entry-${index + 1}`}>
              {index + 1}. Pelo que você é grato hoje?
            </label>
            <textarea
              id={`entry-${index + 1}`}
              value={entry}
              onChange={(e) => handleEntryChange(index, e.target.value)}
              placeholder={`Escreva sua gratidão ${index + 1} aqui...`}
              rows={3}
            />
          </div>
        ))}
        
        <button 
          type="submit" 
          disabled={isSaving}
          className={`save-button ${isSaving ? 'saving' : ''}`}
        >
          {isSaving ? '💾 Salvando...' : '💾 Salvar Diário'}
        </button>
      </form>
    </div>
  );
};

export default GratitudeJournal;