/* import React from 'react';
import '../styles/UserProfile.css';

export function UserProfile({ user }) {
    return (
        <div className="profile-card">
        <div className="coins-badge">
            🪙 {user.coins} коинов
        </div>
        
        <h3>Сотрудник: {user.username}</h3>
        <p className="profile-role">Должность: {user.role}</p>
        <p className="profile-level">Уровень: {user.level}</p>
        
        <p>Опыт: {user.exp} / 100 XP</p>
        <div className="exp-bar-container">
            <div className="exp-bar-fill" style={{ width: `${user.exp}%` }}></div>
        </div>
        </div>
    );
} */


import React from 'react';
import '../styles/UserProfile.css';

export function UserProfile({ user }) {
  // Защита от ошибки: если данные пользователя еще не подгрузились, ничего не рендерим
  if (!user) return <div className="pixel-loading">Загрузка профиля...</div>;

  return (
    <div className="user-profile-container">
      
      {/* ЛЕВАЯ КОЛОНКА: Карточка сотрудника */}
      <div className="profile-left pixel-card">
        <div className="avatar-placeholder">
          ( -_•) 
        </div>
        <h1 className="username">{user.username}</h1>
        <h2 className="user-role">{user.role || "Сотрудник"}</h2>
        
        <div className="user-stats-minimal">
          <p>ID: #{user.id}</p>
          <p>СТАТУС: АКТИВЕН</p>
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА: Прогресс и награды */}
      <div className="profile-right">
        
        {/* Блок уровней и коинов */}
        <div className="stats-header pixel-card">
          <div className="stat-box">
            <span className="stat-label">УРОВЕНЬ</span>
            <span className="stat-value">{user.level}</span>
          </div>
          
          {/* Прогресс-бар опыта */}
          <div className="exp-section">
            <span className="stat-label">ОПЫТ (EXP): {user.exp} / {user.level * 100}</span>
            <div className="exp-bar-wrapper">
              <div 
                className="exp-bar-fill" 
                style={{ width: `${Math.min((user.exp / (user.level * 100)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-label">МОНЕТЫ</span>
            <span className="stat-value text-gold">{user.coins} G</span>
          </div>
        </div>

        {/* Блок наград (Пока заглушка для красоты) */}
        <div className="rewards-section pixel-card">
          <h3 className="section-title">НАГРАДЫ</h3>
          <div className="rewards-list">
            <div className="reward-item" title="Первый вход">[⭐]</div>
            <div className="reward-item locked" title="Секретная награда">[ ? ]</div>
            <div className="reward-item locked" title="Секретная награда">[ ? ]</div>
          </div>
        </div>

      </div>
    </div>
  );
}