import React from 'react';
import { Settings, LogOut, X, Menu } from 'lucide-react';

const Navigation = ({ view, setView, currentUser, settings, mobileMenuOpen, setMobileMenuOpen, onLogout, setAdminTab }) => {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[90] bg-black/70 backdrop-blur-3xl border-b border-white/5 h-24 flex items-center">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 w-full flex items-center justify-between">
           <div className="flex items-center gap-6 sm:gap-10 lg:gap-16">
             <button onClick={() => { window.location.hash = ''; setView('home'); setMobileMenuOpen(false); }} className="group">
                <span className="text-xl sm:text-2xl lg:text-4xl font-black text-white tracking-tighter flex items-center gap-2 sm:gap-3">
                      <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" className="h-8 sm:h-10 lg:h-14 w-auto object-contain transition-transform group-hover:scale-105" />
                      <span className="group-hover:tracking-normal transition-all duration-500">
                        <span style={{ color: settings.primaryColor }}>{settings.siteName.slice(0, -3)}</span>{settings.siteName.slice(-3)}
                      </span>
                   </span>
             </button>
             <div className="hidden xl:flex items-center gap-10">
               {['home', 'collections', 'contact'].map(nav => (
                 <button
                  key={nav}
                  onClick={() => setView(nav)}
                  className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:translate-y-[-2px] ${view === nav ? 'text-white' : 'text-slate-500 hover:text-white'}`}
                >
                   {nav === 'home' ? 'Начало' : (nav === 'collections' ? 'Колекции' : 'Контакти')}
                   {view === nav && <div className="h-1 w-full mt-2 rounded-full" style={{ backgroundColor: settings.primaryColor }} />}
                 </button>
               ))}
             </div>
           </div>

           <div className="flex items-center gap-6">
              {currentUser && (
                <div className="hidden md:flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/10 premium-blur">
                   <button
                    onClick={() => { setAdminTab('dashboard'); setView('admin'); }}
                    className="p-3 bg-white/5 rounded-full text-white hover:bg-white/20 transition-all flex items-center gap-3"
                  >
                    <Settings size={20}/>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Контрол</span>
                  </button>
                   <button onClick={onLogout} className="p-3 bg-rose-600 rounded-full text-white shadow-xl shadow-rose-600/20 hover:scale-105 transition-all"><LogOut size={20}/></button>
                </div>
              )}
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="xl:hidden p-3 bg-white/5 rounded-full text-white border border-white/10 hover:bg-white/10 transition-all"
              >
                {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
              </button>
           </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[85] xl:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-24 right-0 w-[80vw] sm:w-72 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 h-[calc(100vh-6rem)] p-5 sm:p-8 flex flex-col gap-3 sm:gap-4 animate-slide-in">
            {['home', 'collections', 'contact'].map(nav => (
              <button
                key={nav}
                onClick={() => { setView(nav); setMobileMenuOpen(false); }}
                className={`w-full text-left p-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm transition-all
                  ${view === nav ? 'text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                style={view === nav ? { backgroundColor: settings.primaryColor } : {}}
              >
                {nav === 'home' ? 'Начало' : (nav === 'collections' ? 'Колекции' : 'Контакти')}
              </button>
            ))}
            {currentUser && (
              <>
                <div className="h-px bg-white/10 my-4" />
                <button
                  onClick={() => { setAdminTab('dashboard'); setView('admin'); setMobileMenuOpen(false); }}
                  className="w-full text-left p-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm text-slate-500 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3"
                >
                  <Settings size={18}/> Контрол Панел
                </button>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-left p-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm text-rose-500 hover:bg-rose-500/10 transition-all flex items-center gap-3"
                >
                  <LogOut size={18}/> Изход
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
