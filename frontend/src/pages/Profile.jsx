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

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

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

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
    }

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
        
        {message && (
            <div className="toast-notification">
                [!] {message}
            </div>
        )}

        <div className="top-controls">
            <button onClick={toggleTheme} className="theme-btn">
                {theme === 'dark' ? (
                    <img src ="/light.svg" alt="Светлая тема" style={{width: '60px', height: '60px' }} />
                ) : (
                    <img src ="/dark.svg" alt="Темная тема" style={{width: '60px', height: '60px' }} />
                )}
        </button>

        <button onClick={handleLogout} className="logout-btn">
            [ ВЫХОД ]
        </button>
        </div>

        {/* <h2 className="page-title"></h2> */}
        {/* <UserProfile user={user} theme={theme} />
        <h3 className="section-title">ВАШИ КВЕСТЫ</h3>
        <div className="tasks-list">
            {tasks.map(task => (
            <TaskCard 
                key={task.id} 
                task={task} 
                onComplete={handleCompleteTask} 
            />
            ))}
        </div> */}

        <UserProfile 
        user={user} 
        theme={theme} 
        tasks={tasks} 
        onComplete={handleCompleteTask} 
        />

        </div>
    );
}