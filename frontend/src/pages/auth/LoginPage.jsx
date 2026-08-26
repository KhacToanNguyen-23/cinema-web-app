import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Admin', username: 'admin', password: '123456', color: 'bg-red-600 hover:bg-red-700' },
  { label: 'Manager', username: 'manager', password: '123456', color: 'bg-purple-600 hover:bg-purple-700' },
  { label: 'Staff', username: 'staff', password: '123456', color: 'bg-blue-600 hover:bg-blue-700' },
  { label: 'Customer', username: 'customer', password: '123456', color: 'bg-green-600 hover:bg-green-700' },
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
    } else if (decoded && decoded.role === 'MEMBER') {
      navigate('/');
    } else {
      navigate('/admin/dashboard');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (success) {
      redirectByRole(localStorage.getItem('token'));
    } else {
      setError('Tai khoan hoac mat khau khong chinh xac.');
    }
  };

  const handleQuickLogin = async (acc) => {
    setError('');
    const success = await login(acc.username, acc.password);
    if (success) {
      redirectByRole(localStorage.getItem('token'));
    } else {
      setError('Dang nhap nhanh that bai.');
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center font-body-md text-on-background relative overflow-hidden p-xl"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40 z-0"></div>

      <div className="relative z-10 w-full max-w-[28rem] bg-surface-container-low/80 backdrop-blur-2xl p-xl rounded-2xl border border-outline-variant/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center mb-xl gap-sm">
          <h1 className="font-headline-md text-headline-md text-primary tracking-tight">CINEMAX</h1>
          <p className="text-on-surface-variant font-body-md text-center">Dang nhap vao he thong quan ly rap chieu</p>
        </div>

        {error && (
          <div className="mb-md p-sm bg-error-container text-on-error-container rounded-lg text-center text-sm border border-error/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-[12px] uppercase text-on-surface-variant">Ten dang nhap</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-md py-sm rounded-lg bg-surface text-on-surface border border-outline-variant focus:border-primary focus:outline-none transition-colors"
              placeholder="Nhap ten dang nhap"
              required
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-[12px] uppercase text-on-surface-variant">Mat khau</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-md py-sm rounded-lg bg-surface text-on-surface border border-outline-variant focus:border-primary focus:outline-none transition-colors"
              placeholder="..."
              required
            />
          </div>

          <button
            type="submit"
            className="mt-sm w-full py-md bg-primary text-white font-button rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all shadow-[0_4px_12px_rgba(229,9,20,0.3)]"
          >
            DANG NHAP
          </button>
        </form>

        <div className="mt-lg">
          <div className="flex items-center gap-sm mb-md">
            <div className="flex-1 h-px bg-outline-variant/50"></div>
            <span className="text-[11px] uppercase text-on-surface-variant tracking-widest">TAI KHOAN DEMO</span>
            <div className="flex-1 h-px bg-outline-variant/50"></div>
          </div>
          <div className="grid grid-cols-2 gap-sm">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                onClick={() => handleQuickLogin(acc)}
                className={`${acc.color} text-white text-sm font-medium py-sm px-md rounded-lg transition-colors flex flex-col items-center gap-[2px]`}
              >
                <span className="font-bold">{acc.label}</span>
                <span className="text-white/70 text-[11px]">{acc.username} / {acc.password}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;