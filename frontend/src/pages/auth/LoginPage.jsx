import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

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
      const token = localStorage.getItem('token');
      const decoded = parseJwt(token);
      if (decoded && decoded.role === 'STAFF') {
        navigate('/staff/pos');
      } else if (decoded && decoded.role === 'MEMBER') {
        navigate('/');
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      setError('Tài khoản hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div 
      className="min-h-screen bg-background flex flex-col items-center justify-center font-body-md text-on-background relative overflow-hidden p-xl"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40 z-0"></div>
      
      <div className="relative z-10 w-full max-w-[28rem] bg-surface-container-low/80 backdrop-blur-2xl p-xl rounded-2xl border border-outline-variant/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center mb-xl gap-sm">
          <h1 className="font-headline-md text-headline-md text-primary tracking-tight">CINEMAX</h1>
          <p className="text-on-surface-variant font-body-md text-center">Đăng nhập vào hệ thống quản lý rạp chiếu</p>
        </div>

        {error && (
          <div className="mb-md p-sm bg-error-container text-on-error-container rounded-lg text-center text-sm border border-error/50">
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
              className="px-md py-sm rounded-lg bg-surface text-on-surface border border-outline-variant focus:border-primary focus:outline-none transition-colors"
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
              className="px-md py-sm rounded-lg bg-surface text-on-surface border border-outline-variant focus:border-primary focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="mt-sm w-full py-md bg-primary text-white font-button rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all shadow-[0_4px_12px_rgba(229,9,20,0.3)]"
          >
            ĐĂNG NHẬP
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
