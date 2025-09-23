import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // 🔥 AGORA A handleSubmit ESTÁ AQUI! 🔥
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validação básica do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um email válido (ex: usuario@exemplo.com)');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Login realizado com sucesso');
      } else {
        // Cadastro
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('✅ Conta criada com sucesso');
      }
      onLogin();
    } catch (error) {
      console.error('❌ Erro do Firebase:', error);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = 'Erro desconhecido. Tente novamente.';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Email inválido. Verifique o formato.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erro de conexão. Verifique sua internet.';
          break;
        default:
          errorMessage = error.message;
      }
      
      alert(`Erro: ${errorMessage}`);
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
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
          <span 
            className="toggle-link" 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;