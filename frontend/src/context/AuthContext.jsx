import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      setUser({ token, ...decoded }); 
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      const decoded = parseJwt(token);
      setUser({ token, ...decoded });
      return true;
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isLoginModalOpen, setLoginModalOpen }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
