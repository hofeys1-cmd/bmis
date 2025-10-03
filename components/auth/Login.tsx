import React, { useState } from 'react';
import { HeartPulse } from 'lucide-react';

interface Props {
  onLogin: (username: string, password: string) => boolean;
}

export const Login: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(username, password);
    if (!success) {
      setError('نام کاربری یا رمز عبور نامعتبر است.');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.7) 100%), url('https://storage.googleapis.com/aistudio-hosting/222d1066-51f7-48f1-a1cf-30c1d683507d/images/9924e231-1554-47f6-939e-473d09a27909.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-md w-full bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/50">
        <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
               <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl text-white shadow-lg">
                    <HeartPulse className="h-12 w-12" />
                </div>
            </div>
          <h1 className="text-3xl font-extrabold text-slate-800">ورود به سامانه مدیریت HSE</h1>
          <p className="text-slate-500 mt-2">لطفا برای ادامه، اطلاعات کاربری خود را وارد کنید.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              نام کاربری
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-base text-slate-800 bg-white/90 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 focus:outline-none"
              required
              autoFocus
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-base text-slate-800 bg-white/90 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          {error && <p className="text-sm text-danger-600 text-center font-semibold">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-xl disabled:opacity-70 transition-all duration-300 transform hover:scale-105"
            >
              ورود
            </button>
          </div>
        </form>
      </div>
      <footer className="text-center text-slate-200 mt-8">
         <p>&copy; 2024 مرکز سلامت. همه حقوق محفوظ است.</p>
      </footer>
    </div>
  );
};