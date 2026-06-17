import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { UserProfile } from '../components/UserProfile';
import { TaskCard } from '../components/TaskCard';
import '../styles/Profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('userId') || '1';
    
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState('');

    const loadDataFromBackend = async () => {
        try {
            const userData = await api.getUserProfile(currentUserId);
            const tasksData = await api.getUserTasks(currentUserId);
            setUser(userData);
            setTasks(tasksData);
        } catch (error) {
            console.error("Ошибка при общении с FastAPI:", error);
        }
    };

    useEffect(() => {
        loadDataFromBackend();
    }, [currentUserId]);

    const handleCompleteTask = async (taskId) => {
        try {
            const response = await api.completeTask(currentUserId, taskId);
            setMessage(response.message);
            loadDataFromBackend(); 

            setTimeout(() => {
                setMessage('');
            }, 4000);

        } catch (error) {
            setMessage(error.response?.data?.detail || "Ошибка сервера");
            setTimeout(() => { setMessage(''); }, 4000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    };

    if (!user) return <div className="pixel-loading">ЗАГРУЗКА ДАННЫХ...</div>;

    return (
        <div className="profile-page-container">
        
        {/* Ретро-уведомление */}
        {message && (
            <div className="toast-notification">
                [!] {message}
            </div>
        )}

        {/* Обновленная кнопка выхода */}
        <button onClick={handleLogout} className="logout-btn">
            [ ВЫХОД ]
        </button>

        <h2 className="page-title">ЛИЧНЫЙ ПРОФИЛЬ СОТРУДНИКА</h2>
        
        <UserProfile user={user} />

        {/* Исправленная надпись */}
        <h3 className="section-title">ВАШИ КВЕСТЫ</h3>
        
        <div className="tasks-list">
            {tasks.map(task => (
            <TaskCard 
                key={task.id} 
                task={task} 
                onComplete={handleCompleteTask} 
            />
            ))}
        </div>
        </div>
    );
}