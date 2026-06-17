import React from 'react';
import '../styles/TaskCard.css';

export function TaskCard({ task, onComplete }) {
    return (
        <div className={`task-card ${task.is_done ? 'completed' : ''}`}>
            <div className="task-info">
                <strong className="task-title">{task.title}</strong>
                <div className="task-rewards">
                    <span className="reward-xp">+{task.exp_reward} EXP</span>
                    <span className="reward-coins">+{task.coin_reward} G</span>
                </div>
            </div>
            
            <button 
                onClick={() => onComplete(task.id)}
                disabled={task.is_done}
                className="task-btn"
            >
                {task.is_done ? '[ ВЫПОЛНЕНО ]' : '[ СДАТЬ ]'}
            </button>
        </div>
    );
}