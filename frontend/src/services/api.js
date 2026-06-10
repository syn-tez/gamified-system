import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const api = {
    login: async (username, password) => {
        const response = await axios.post(`${API_BASE_URL}/user/login`, {
            username: username,
            password: password
        });
        return response.data;
    },

     // Получить данные профиля (имя, уровень, коины)
    getUserProfile: async (userId) => {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
        return response.data;
    },

    // Получить список всех задач с отметками, что выполнено
    getUserTasks: async (userId) => {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}/tasks`);
        return response.data;
    },

    // Отправить бэкенду сигнал о выполнении задачи
    completeTask: async (userId, taskId) => {
        const response = await axios.post(`${API_BASE_URL}/tasks/complete`, {
        user_id: Number(userId), // гарантируем, что ID уйдет числом
        task_id: taskId
        });
        return response.data;
    }
};