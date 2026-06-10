import React from 'react';
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
}