import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api'; 
import '../styles/Authorization.css';   

export default function Authorization() {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    if (!username.trim() || !password.trim()) return;

    try {
      setError(''); 
      const userData = await api.login(username.trim(), password.trim());
      localStorage.setItem('userId', userData.id.toString());
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка авторизации");
    }
  };

  return (
    <div className="auth-container">
      <button onClick={() => navigate('/register')} className="register-link-btn">
        Регистрация
      </button>

      <h2 className="auth-title">Вход в систему</h2>
      
      <form onSubmit={handleLogin} className="auth-form">
        <input 
          type="text" 
          placeholder="Введите ваш никнейм" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input" 
        />
        
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"} 
            placeholder="Введите ваш пароль" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            className="auth-input password-input"
          />
          
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle-btn"
          >
            {showPassword ? "👁️" : "🙈"}
          </button>
        </div>
        
        <button 
          type="submit" 
          disabled={!username.trim() || !password.trim()} 
          className="auth-submit-btn"
        >
          Войти
        </button>

        {error && <div className="auth-error">{error}</div>}
      </form>
    </div>
  );
}