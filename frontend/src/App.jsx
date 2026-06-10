import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Authorization from './pages/Authorization';
import Profile from './pages/Profile';

const RegisterStub = () => <div style={{ textAlign: 'center', padding: '40px' }}><h2>Страница Регистрации (В разработке)</h2></div>;

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userId');
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Главный экран приложения — Авторизация */}
          <Route path="/" element={<Authorization />} />

          <Route path="/register" element={<RegisterStub />} />

          {/* Профиль доступен только авторизованным */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Авторедирект на вход, если ввели несуществующий адрес */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;