import React from 'react';
import '../styles/UserProfile.css';
import { TaskCard } from './TaskCard';

export function UserProfile({ user, theme, tasks = [], onComplete }) {
  if (!user) return <div className="pixel-loading">Загрузка профиля...</div>;

  const activeTasks = tasks.filter(task => !task.is_done);
  const completedTasks = tasks.filter(task => task.is_done);

  return (
    <div className="app-container">
      
      <div className="responsive-row">

        <div className="responsive-column modifier-left">
          
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

          <div className="rewards-section pixel-card">
            <h3 className="section-title">НАГРАДЫ</h3>
            <div className="rewards-list">
              <div className="reward-item" title="Первый вход">⭐</div>
              <div className="reward-item locked" title="Секретная награда">?</div>
              <div className="reward-item locked" title="Секретная награда">?</div>
            </div>
          </div>

        </div>

        <div className="responsive-column">
          
          <div className="stats-header pixel-card">
            <div className="stat-box">
              <span className="stat-label">УРОВЕНЬ</span>
              <span className="stat-value">{user.level}</span>
            </div>
            
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
              <span className="stat-value text-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user.coins}
                <img 
                  src={theme === 'dark' ? '/coin-light.svg' : '/coin-dark.svg'} 
                  alt="Coins" 
                  className="pixel-coin-icon" 
                />
              </span>
            </div>
          </div>

          <div className="tasks-section pixel-card">
            <h3 className="section-title">ТЕКУЩИЕ КВЕСТЫ</h3>
            <div className="profile-tasks-list">
              {activeTasks.length > 0 ? (
                activeTasks.map(task => (
                  <TaskCard key={task.id} task={task} onComplete={onComplete} />
                ))
              ) : (
                <p className="no-tasks-text">Текущих нет</p>
              )}
            </div>
          </div>

          <div className="tasks-section pixel-card">
            <h3 className="section-title">ВЫПОЛНЕННЫЕ КВЕСТЫ</h3>
            <div className="profile-tasks-list">
              {completedTasks.length > 0 ? (
                completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} onComplete={onComplete} />
                ))
              ) : (
                <p className="no-tasks-text">Выполненные квесты отсутствуют</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}