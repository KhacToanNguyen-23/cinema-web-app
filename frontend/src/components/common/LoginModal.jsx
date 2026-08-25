import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginModal = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoginModalOpen, setLoginModalOpen } = useAuth();
  const navigate = useNavigate();

  if (!isLoginModalOpen) return null;

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);
    if (success) {
      setLoginModalOpen(false);
      const token = localStorage.getItem('token');
      const decoded = parseJwt(token);
      if (decoded && decoded.role === 'STAFF') {
        navigate('/staff/pos');
      } else if (decoded && decoded.role === 'ADMIN') {
        navigate('/admin/dashboard');
      }
      // For MEMBER, we stay on the current page
    } else {
      setError('Tài khoản hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-md">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setLoginModalOpen(false)}
      ></div>
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-[28rem] bg-surface-container-high p-xl rounded-3xl border border-outline-variant/40 shadow-2xl animate-fade-in-up">
        <button 
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface bg-surface-container rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex flex-col items-center mb-xl gap-sm mt-sm">
          <h2 className="font-display-sm text-display-sm text-on-surface tracking-tight">Đăng nhập</h2>
          <p className="text-on-surface-variant font-body-md text-center">Chào mừng bạn trở lại với CineMax</p>
        </div>

        {error && (
          <div className="mb-md p-sm bg-error-container text-on-error-container rounded-xl text-center text-sm border border-error/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-[12px] uppercase text-on-surface-variant">Tên đăng nhập</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-md py-sm rounded-xl bg-surface text-on-surface border border-outline-variant focus:border-primary focus:outline-none transition-colors"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-[12px] uppercase text-on-surface-variant">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-md py-sm rounded-xl bg-surface text-on-surface border border-outline-variant focus:border-primary focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="mt-sm w-full py-md bg-primary text-white font-button rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md flex justify-center items-center gap-2"
          >
            ĐĂNG NHẬP
          </button>
        </form>
        
        <div className="mt-lg text-center text-on-surface-variant font-body-sm">
          Chưa có tài khoản? <a href="#" className="text-primary hover:underline">Đăng ký ngay</a>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
