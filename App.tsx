import React, { useState, useCallback } from 'react';
import { Login } from './components/auth/Login';
import { ComplexHSEManagement } from './components/hse/ComplexHSEManagement';
import { ContractorHSEManagement } from './components/hse/ContractorHSEManagement';
import type { User } from './types';
import { UserManagement } from './components/admin/UserManagement';
import { NotificationProvider } from './contexts/NotificationContext';
import { LogOut, UserCog, Building2, Users, ArrowRight, HeartPulse, Calendar } from 'lucide-react';


// Mock data, since we can't add files
const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', password: '12345', roles: ['admin'] },
  { id: '2', username: 'dr_ahmadi', password: 'password', roles: ['occupationalMedicine', 'treatment'] },
  { id: '3', username: 'safety_officer', password: 'password', roles: ['safety'] },
  { id: '4', username: 'fire_chief', password: 'password', roles: ['fireDepartment'] },
  { id: '5', username: 'env_spec', password: 'password', roles: ['environment'] },
];

const JalaliDate: React.FC = () => {
  const formattedDate = new Intl.DateTimeFormat('fa-IR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  }).format(new Date());

  return (
    <div className="hidden lg:flex items-center space-x-2 space-x-reverse text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/90">
      <Calendar className="h-5 w-5 text-slate-500" />
      <span className="font-semibold text-sm">{formattedDate}</span>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isAdminView, setIsAdminView] = useState(false);
  const [hseView, setHseView] = useState<'selection' | 'complex' | 'contractor'>('selection');

  const handleLogin = useCallback((username: string, password: string): boolean => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setIsAdminView(false);
    setHseView('selection');
  }, []);
  
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const hasAdminRole = currentUser.roles.includes('admin');
  
  const pageTitle = isAdminView ? 'پنل مدیریت' : 
                  hseView === 'complex' ? 'مدیریت HSE مجتمع' :
                  hseView === 'contractor' ? 'مدیریت HSE پیمانکاران' :
                  'سامانه مدیریت HSE';

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg text-white">
                  <HeartPulse className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-slate-700">{pageTitle}</h1>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <JalaliDate />
                {hseView !== 'selection' && !isAdminView && (
                    <button
                        onClick={() => setHseView('selection')}
                        className="flex items-center space-x-2 space-x-reverse text-slate-600 hover:text-primary-600 transition-colors"
                        title="بازگشت به انتخاب بخش"
                    >
                        <ArrowRight className="h-5 w-5" />
                        <span className="font-semibold hidden sm:inline">بازگشت</span>
                    </button>
                )}
                {hasAdminRole && (
                  <button
                    onClick={() => setIsAdminView(!isAdminView)}
                    className="flex items-center space-x-2 space-x-reverse text-slate-600 hover:text-primary-600 transition-colors"
                    title={isAdminView ? "بازگشت به داشبورد اصلی" : "پنل مدیریت"}
                  >
                    <UserCog className="h-6 w-6" />
                    <span className="font-semibold hidden sm:inline">{isAdminView ? "داشبورد اصلی" : "مدیریت"}</span>
                  </button>
                )}
                 <div className="text-sm text-right">
                    <p className="font-semibold text-slate-700">{currentUser.username}</p>
                    <p className="text-slate-500">{currentUser.roles.join(', ')}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 space-x-reverse text-danger-500 hover:text-danger-700 transition-colors p-2 rounded-md hover:bg-danger-50"
                  title="خروج"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-semibold hidden sm:inline">خروج</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          {isAdminView && hasAdminRole ? (
            <UserManagement users={users} setUsers={setUsers} />
          ) : (
            <>
              {hseView === 'selection' && (
                 <div className="flex flex-col items-center justify-center pt-10 animate-fade-in-scale">
                    <h2 className="text-3xl font-bold text-slate-700 mb-4">انتخاب بخش مورد نظر</h2>
                    <p className="text-slate-500 mb-12 max-w-2xl text-center">
                        به سامانه یکپارچه مدیریت بهداشت، ایمنی و محیط زیست (HSE) خوش آمدید. لطفاً یکی از سامانه‌های زیر را برای ادامه انتخاب کنید.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                        <div 
                        onClick={() => setHseView('complex')} 
                        className="group bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="p-5 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl text-primary-600 group-hover:from-primary-500 group-hover:to-primary-600 group-hover:text-white transition-all duration-300">
                                    <Building2 className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">مدیریت HSE مجتمع</h3>
                            <p className="text-slate-600">
                                مدیریت جامع طب کار، درمان، ایمنی و موارد دیگر برای پرسنل رسمی مجتمع.
                            </p>
                        </div>
                        <div 
                        onClick={() => setHseView('contractor')}
                        className="group bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="p-5 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl text-primary-600 group-hover:from-primary-500 group-hover:to-primary-600 group-hover:text-white transition-all duration-300">
                                    <Users className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">مدیریت HSE پیمانکاران</h3>
                            <p className="text-slate-600">
                                ابزارهای مربوط به نظارت و مدیریت ایمنی و سلامت پیمانکاران.
                            </p>
                        </div>
                    </div>
                </div>
              )}
              {hseView === 'complex' && <ComplexHSEManagement user={currentUser} />}
              {hseView === 'contractor' && <ContractorHSEManagement />}
            </>
          )}
        </main>
      </div>
    </NotificationProvider>
  );
};

export default App;