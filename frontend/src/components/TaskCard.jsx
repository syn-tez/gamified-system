import React from 'react';
import '../styles/TaskCard.css';

export function TaskCard({ task, onComplete }) {
    return (
        /* Если задача выполнена, добавляем класс 'completed' */
        <div className={`task-card ${task.is_done ? 'completed' : ''}`}>
        <div>
            <strong className="task-title">{task.title}</strong>
            <div className="task-rewards">
            <span className="reward-xp">+{task.exp_reward} XP</span>
            <span className="reward-coins">🪙 +{task.coin_reward} коинов</span>
            </div>
        </div>
        
        <button 
            onClick={() => onComplete(task.id)}
            disabled={task.is_done}
            className="task-btn"
        >
            {task.is_done ? 'Выполнено' : 'Сдать'}
        </button>
        </div>
    );
}