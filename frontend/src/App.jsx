import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [currentUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  // При первой загрузке страницы скачиваем и профиль, и задачи
  useEffect(() => {
    fetchUserProfile();
    fetchTasks();
  }, []);

  // Запрос профиля сотрудника
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/user/${currentUserId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Не удалось загрузить данные из БД:", error);
    }
  };

  // Запрос списка задач с бэкенда
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/user/${currentUserId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Не удалось загрузить задачи:", error);
    }
  };

  const completeTask = async (taskId) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/tasks/complete', {
        user_id: currentUserId,
        task_id: taskId
      });
      setMessage(response.data.message);
      fetchUserProfile(); // Сразу перекачиваем профиль, чтобы увидеть новый опыт
      fetchTasks();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Ошибка сервера");
    }
  };

  if (!user) return <div style={{ padding: '20px' }}>Подключение к PostgreSQL...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Панель управления геймификацией</h2>
      
      {/* Карточка сотрудника с балансом монет */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', background: '#f9f9f9', marginBottom: '30px', position: 'relative' }}>
        
        <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#fff9c4', padding: '5px 15px', borderRadius: '20px', border: '1px solid #fbc02d', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
          🪙 {user.coins} коинов
        </div>

        <h3>Сотрудник: {user.username}</h3>
        <p style={{ color: '#555', fontStyle: 'italic' }}>Должность: {user.role}</p>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Уровень: {user.level}</p>
        
        <p>Опыт: {user.exp} / 100 XP</p>
        <div style={{ width: '100%', background: '#e0e0e0', borderRadius: '5px', height: '15px', overflow: 'hidden' }}>
          <div style={{ width: `${user.exp}%`, background: '#4caf50', height: '100%', transition: 'width 0.4s ease' }}></div>
        </div>
      </div>

      {/* Квесты */}
      <h3>Доступные квесты:</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {tasks.map((task) => (
          <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', background: task.is_done ? '#f5f5f5' : '#fff', opacity: task.is_done ? 0.7 : 1 }}>
            <div>
              <strong style={{ fontSize: '16px', textDecoration: task.is_done ? 'line-through' : 'none', color: task.is_done ? '#888' : '#000' }}>{task.title}</strong>
              <div style={{ display: 'flex', gap: '15px', marginTop: '5px', fontSize: '14px' }}>
                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>+{task.exp_reward} XP</span>
                <span style={{ color: '#ff9800', fontWeight: 'bold' }}>🪙 +{task.coin_reward} коинов</span>
              </div>
            </div>
            
            <button 
              onClick={() => completeTask(task.id)}
              disabled={task.is_done} // Блокируем кнопку, если выполнено!
              style={{ 
                padding: '8px 15px', 
                background: task.is_done ? '#bdbdbd' : '#2196f3', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: task.is_done ? 'not-allowed' : 'pointer' 
              }}
            >
              {task.is_done ? 'Выполнено' : 'Сдать'}
            </button>
          </div>
        ))}
      </div>

      {message && (
        <div style={{ marginTop: '25px', padding: '10px', background: '#e3f2fd', borderRadius: '5px', color: '#0d47a1', textAlign: 'center' }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default App;