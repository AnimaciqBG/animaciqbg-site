import React from 'react';
import { Shield } from 'lucide-react';
import { MOCK_ADMIN } from '../utils/constants';

const LoginView = ({ settings, loginForm, setLoginForm, setCurrentUser, setView, addLog, showToast }) => {
  return (
    <div className="pt-32 sm:pt-40 lg:pt-48 flex justify-center px-4 sm:px-6 lg:px-10">
      <div className="bg-white/5 premium-blur p-6 sm:p-10 lg:p-16 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[4rem] border border-white/10 w-full max-w-xl shadow-3xl text-center">
         <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-white/10">
            <Shield size={48} style={{ color: settings.primaryColor }} />
         </div>
         <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-4 tracking-[0.05em] sm:tracking-[0.1em] uppercase">{settings.texts.loginTitle}</h2>
         <p className="text-slate-500 mb-8 sm:mb-10 lg:mb-12 font-medium text-sm sm:text-base">Само за оторизиран персонал.</p>
         <form onSubmit={(e)=>{
           e.preventDefault();
           const savedPass = localStorage.getItem('v14_adminPass') || 'admin123';
           if(loginForm.email === 'admin@animaciqbg.net' && loginForm.password === savedPass){
             setCurrentUser(MOCK_ADMIN);
             localStorage.setItem('adminSession', 'true');
             setView('admin');
             addLog("Вход в административен панел", "success");
             showToast("Добре дошли, Админ!", "success");
           } else {
             showToast("Невалидни данни!", "error");
           }
         }} className="space-y-6">
            <input type="email" required placeholder={settings.texts.loginEmailPlaceholder} className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}} value={loginForm.email} onChange={e=>setLoginForm({...loginForm, email: e.target.value})}/>
            <input type="password" required placeholder={settings.texts.loginPasswordPlaceholder} className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}} value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password: e.target.value})}/>
            <button className="w-full py-5 sm:py-6 lg:py-7 text-black bg-white font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-sm sm:text-base rounded-2xl sm:rounded-3xl hover:scale-105 transition-all shadow-2xl mt-4">
              {settings.texts.loginButton}
            </button>
         </form>
      </div>
    </div>
  );
};

export default LoginView;
