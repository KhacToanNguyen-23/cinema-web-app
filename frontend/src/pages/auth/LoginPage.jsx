// [AI UPDATE - Chuẩn hóa giao diện LoginPage thống nhất 100% theo LoginModal (Ảnh 2)]
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Admin', username: 'admin', password: '123456', icon: 'admin_panel_settings' },
  { label: 'Manager', username: 'manager', password: '123456', icon: 'manage_accounts' },
  { label: 'Staff', username: 'staff', password: '123456', icon: 'badge' },
  { label: 'Customer', username: 'customer', password: '123456', icon: 'person' },
];

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

  const redirectByRole = (token) => {
    const decoded = parseJwt(token);
    if (decoded && decoded.role === 'STAFF') {
      navigate('/staff/pos');
    } else if (decoded && (decoded.role === 'ADMIN' || decoded.role === 'MANAGER')) {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (success) {
      redirectByRole(localStorage.getItem('token'));
    } else {
      setError('Tài khoản hoặc mật khẩu không chính xác.');
    }
  };

  const fillDemo = (acc) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center font-body-md text-on-background relative overflow-hidden p-md"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0"></div>

      {/* Card matching Image 2 / LoginModal */}
      <div className="relative z-10 w-full max-w-[28rem] bg-surface-container-high p-xl rounded-3xl border border-outline-variant/40 shadow-2xl animate-fade-in-up">
        <div className="flex flex-col items-center mb-xl gap-sm mt-sm">
          <h2 className="font-display-sm text-display-sm text-on-surface tracking-tight">Đăng nhập</h2>
          <p className="text-on-surface-variant font-body-md text-center">Chào mừng bạn trở lại với CineMax</p>
        </div>

        {/* Demo accounts quick fill */}
        <div className="mb-md">
          <p className="text-[11px] uppercase text-on-surface-variant tracking-widest mb-sm text-center">Tài khoản demo</p>
          <div className="grid grid-cols-4 gap-xs">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                type="button"
                onClick={() => fillDemo(acc)}
                title={`${acc.username} / ${acc.password}`}
                className="flex flex-col items-center gap-[3px] py-sm px-xs rounded-xl bg-surface-container hover:bg-primary/10 hover:text-primary border border-outline-variant/40 hover:border-primary/40 transition-all text-on-surface-variant group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] group-hover:text-primary">{acc.icon}</span>
                <span className="text-[11px] font-medium">{acc.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-sm mb-md">
          <div className="flex-1 h-px bg-outline-variant/50"></div>
          <span className="text-[11px] uppercase text-on-surface-variant tracking-widest">hoặc nhập thủ công</span>
          <div className="flex-1 h-px bg-outline-variant/50"></div>
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
            className="mt-sm w-full py-md bg-primary text-white font-button rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md flex justify-center items-center gap-2 cursor-pointer"
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

export default LoginPage;