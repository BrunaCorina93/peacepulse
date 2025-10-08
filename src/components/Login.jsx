import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!email || !password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um email válido (ex: usuario@exemplo.com)');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Tentando:', isLogin ? 'Login' : 'Cadastro', 'com:', email);
      
      let userCredential;
      
      if (isLogin) {
        // LOGIN
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Login realizado com sucesso');
      } else {
        // CADASTRO
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('✅ Conta criada com sucesso');
      }

      // Aguardar um pouco para o auth atualizar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('👤 Usuário autenticado:', auth.currentUser);
      console.log('📞 Chamando onLogin callback...');

      // Chamar onLogin de forma segura
      if (onLogin && typeof onLogin === 'function') {
        onLogin(userCredential.user);
      } else {
        console.warn('⚠️ onLogin não disponível, recarregando página...');
        window.location.reload();
      }

    } catch (error) {
      console.error('❌ Erro de autenticação:', error);
      
      // Mensagens de erro detalhadas
      let errorMessage = 'Erro desconhecido. Tente novamente.';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Email inválido. Verifique o formato.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso. Tente fazer login.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado. Crie uma conta primeiro.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta. Tente novamente.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erro de conexão. Verifique se o emulador está rodando.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = `Erro: ${error.message}`;
      }
      
      alert(`❌ ${errorMessage}`);
      console.log('🔧 Código do erro:', error.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🌊 PeacePulse</h2>
        <p>Seu diário digital de gratidão</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Sua senha (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? (
              <span>⏳ {isLogin ? 'Entrando...' : 'Cadastrando...'}</span>
            ) : (
              <span>{isLogin ? '🚀 Entrar' : '✨ Cadastrar'}</span>
            )}
          </button>
        </form>

        <div className="toggle-section">
          <p>
            {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
            <span 
              className="toggle-link" 
              onClick={() => !loading && setIsLogin(!isLogin)}
            >
              {isLogin ? 'Cadastre-se aqui' : 'Faça login aqui'}
            </span>
          </p>
        </div>

        {/* Informações para debug */}
        <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '5px', fontSize: '12px' }}>
          <strong>💡 Modo Desenvolvimento:</strong>
          <br/>• Use qualquer email/senha no emulador
          <br/>• Senha mínima: 6 caracteres
          <br/>• Emulador: http://127.0.0.1:60003
        </div>
      </div>
    </div>
  );
};

export default Login;
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  console.log('🔐 Tentando login com:', email);

  try {
    if (isLogin) {
      // LOGIN
      console.log('📡 Conectando ao Auth Emulator...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login bem-sucedido:', userCredential.user);
    } else {
      // CADASTRO
      console.log('📝 Criando nova conta...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Conta criada:', userCredential.user);
    }
    // ... resto do código
  } catch (error) {
    console.error('💥 ERRO DETALHADO:', error);
    console.log('🔧 Código do erro:', error.code);
    console.log('📄 Mensagem:', error.message);
    // ... tratamento de erro
  }
};