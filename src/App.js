import React, { useState, useEffect, useRef, memo } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  SkipForward, SkipBack, Search, Home, Clock, Heart, 
  TrendingUp, Settings, Shield, Plus, X, Check, 
  LogOut, User, Menu, Film, AlertTriangle, Send, 
  ChevronLeft, ChevronRight, Eye, ThumbsUp, ThumbsDown,
  Edit, Save, HelpCircle, FileText, Globe, Lock,
  Trash2, UploadCloud, Image as ImageIcon, Snowflake,
  Palette, Sliders, CloudRain, Flower, Activity, Video,
  MessageSquare, ShieldAlert, Ban, Stamp, HardDrive, Download,
  Radio, RefreshCw, Sparkles, Type, RotateCcw, Layout, Mail,
  ExternalLink, FileDown
} from 'lucide-react';

/**
 * ANIMATIONBG - ВЕРСИЯ 11.0 (HYBRID: STREAM & DOWNLOAD)
 * * Промени:
 * - Добавена опция за Download Link (Torrent/Direct) в админ панела.
 * - Динамични радио бутони за избор на тип съдържание (Embed vs Download).
 * - Нов модален прозорец за изтегляне.
 * - Различни визуални баджове на картите (СТРИЙМ vs БГ АУДИО).
 * - Пълна поддръжка на localStorage и CMS.
 */

const DEFAULT_VIDEOS = [
  {
    id: '1',
    title: 'Frozen (2013) - Анимация',
    thumbnail: 'https://images.unsplash.com/photo-1580136608260-42d1c4aa0153?q=80&w=1000&auto=format&fit=crop',
    streamType: 'embed',
    embedUrl: 'https://vidsrc.me/embed/movie/tt2294629',
    duration: '1:42:00',
    year: 2013,
    views: 4500,
    likes: 320,
    description: 'Магична история за две сестри и вечната зима.',
    tags: ['Animation', 'Family']
  }
];

const DEFAULT_TEXTS = {
  homeTitle: 'Български дублирани анимации',
  homeSubtitle: 'Премиум технология за стрийминг. Гледай веднага.',
  searchPlaceholder: 'Търсене...',
  footerDescription: 'Стрийминг Платформа за анимации © 2026',
  videoBadgeStream: 'СТРИЙМ',
  videoBadgeDownload: 'БГ АУДИО',
  loginTitle: 'АДМИН ПАНЕЛ',
  loginEmailPlaceholder: 'Имейл',
  loginPasswordPlaceholder: 'Парола',
  loginButton: 'ВХОД',
  adminTabCatalog: 'Каталог',
  adminTabSettings: 'Настройки',
  adminTabTexts: 'Текстове',
  adminTabLogs: 'Логове',
  playerLiveBadge: 'СТРИЙМ НА ЖИВО',
  playerLoading: 'Зареждане...'
};

const MOCK_ADMIN = { id: 'a1', name: 'Администратор', role: 'admin' };

// --- ВИЗУАЛНИ ЕФЕКТИ (СЕЗОНИ) ---
const VisualEffectLayer = ({ type }) => {
  if (!type || type === 'none') return null;
  const getParticles = () => {
    switch(type) {
      case 'snow': return { char: '❄', count: 40, class: 'animate-fall' };
      case 'rain': return { char: '💧', count: 60, class: 'animate-rain' };
      case 'sakura': return { char: '🌸', count: 30, class: 'animate-sway' };
      case 'fireflies': return { char: '●', count: 40, class: 'animate-glow' };
      default: return null;
    }
  };
  const effect = getParticles();
  if (!effect) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
       <style>{`
         @keyframes fall { 0% { transform: translateY(-10vh); opacity: 0.8; } 100% { transform: translateY(110vh); opacity: 0; } }
         @keyframes rain { 0% { transform: translateY(-10vh); opacity: 0.5; } 100% { transform: translateY(110vh); opacity: 0; } }
         @keyframes sway { 0% { transform: translateY(-10vh) translateX(0) rotate(0); opacity: 0.8; } 100% { transform: translateY(110vh) translateX(20px) rotate(360deg); opacity: 0; } }
         @keyframes glow { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5) translate(10px, -10px); } }
         .animate-fall { animation: fall linear infinite; }
         .animate-rain { animation: rain linear infinite; }
         .animate-sway { animation: sway linear infinite; }
         .animate-glow { animation: glow ease-in-out infinite; }
       `}</style>
       {[...Array(effect.count)].map((_, i) => (
         <div key={i} className={`absolute ${effect.class}`}
           style={{
             left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
             animationDuration: `${Math.random() * 5 + 5}s`, animationDelay: `${Math.random() * 5}s`, 
             fontSize: type === 'fireflies' ? '4px' : `${Math.random() * 20 + 10}px`,
             color: type === 'fireflies' ? '#fde047' : (type === 'sakura' ? '#fbcfe8' : 'white'),
             opacity: 0.4
           }}>{effect.char}</div>
       ))}
    </div>
  );
};

// --- MODAL ЗА ИЗТЕГЛЯНЕ ---
const DownloadModal = ({ video, onClose, settings }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="relative aspect-video">
          <img src={video.thumbnail} className="w-full h-full object-cover opacity-40" alt=""/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"/>
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-red-600 rounded-full text-white transition-all">
            <X size={20}/>
          </button>
          <div className="absolute bottom-6 left-8">
            <h2 className="text-3xl font-black text-white">{video.title}</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">{video.year} • Българско Аудио</p>
          </div>
        </div>
        
        <div className="p-8 text-center space-y-6">
          <div className="flex flex-col items-center gap-3">
             <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                <FileDown size={32}/>
             </div>
             <h3 className="text-xl font-bold text-white">Изтегли за гледане</h3>
             <p className="text-slate-500 text-sm px-4">
                Този филм е наличен само за изтегляне с висококачествен български дублаж.
             </p>
          </div>

          <a 
            href={video.downloadUrl} 
            target="_blank" 
            rel="noreferrer"
            className="block w-full text-white font-black py-5 rounded-2xl shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 text-lg"
            style={{ backgroundColor: '#22c55e' }} // Green for download
          >
            ИЗТЕГЛИ СЕГА <ExternalLink size={20}/>
          </a>

          <div className="space-y-1">
             <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Препоръчваме софтуер за торенти</p>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">qBittorrent • uTorrent • BitComet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- EMBED ПЛЕЙЪР ---
const EmbedPlayer = memo(({ video, onClose, settings }) => {
  const watermarkPosClasses = {
    'top-right': 'top-20 right-8',
    'top-left': 'top-20 left-8',
    'bottom-right': 'bottom-24 right-8',
    'bottom-left': 'bottom-24 left-8'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {settings.watermarkEnabled && (
        <div 
          className={`absolute ${watermarkPosClasses[settings.watermarkPosition] || 'top-20 right-8'} z-[70] pointer-events-none select-none`}
          style={{ opacity: settings.watermarkOpacity / 100 }}
        >
          <span className="text-white font-black text-2xl uppercase tracking-widest drop-shadow-lg">{settings.watermarkText}</span>
        </div>
      )}
      <button onClick={onClose} className="absolute top-6 right-6 z-[60] p-3 bg-white/10 hover:bg-red-600 rounded-full text-white transition-all shadow-lg backdrop-blur-md"><X size={24}/></button>
      <div className="absolute top-0 left-0 right-0 p-6 z-[60] bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <h2 className="text-white text-2xl font-bold flex items-center gap-2">
          {video.title} 
          <span className="text-xs px-2 py-0.5 rounded uppercase font-black" style={{ backgroundColor: settings.primaryColor }}>{settings.texts.playerLiveBadge}</span>
        </h2>
      </div>
      <iframe src={video.embedUrl} className="w-full h-full border-0" allowFullScreen allow="autoplay; fullscreen; picture-in-picture; encrypted-media" title={video.title} referrerPolicy="origin"/>
    </div>
  );
});

// --- ГЛАВНО ПРИЛОЖЕНИЕ ---
export default function App() {
  const [view, setView] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const [settings, setSettings] = useState({
    siteName: 'AnimationBG',
    logoUrl: '',
    useLogo: false,
    primaryColor: '#DC2626',
    visualEffect: 'none',
    watermarkEnabled: true,
    watermarkText: 'ANIMATIONBG STREAM',
    watermarkPosition: 'top-right',
    watermarkOpacity: 20,
    texts: DEFAULT_TEXTS
  });

  useEffect(() => {
    if (localStorage.getItem('adminSession') === 'true') setCurrentUser(MOCK_ADMIN);
    const savedVideos = localStorage.getItem('savedVideos');
    if (savedVideos) setVideos(JSON.parse(savedVideos));
    else { setVideos(DEFAULT_VIDEOS); localStorage.setItem('savedVideos', JSON.stringify(DEFAULT_VIDEOS)); }
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({ ...settings, ...parsed, texts: { ...DEFAULT_TEXTS, ...parsed.texts } });
    }
    const handleHash = () => {
      if (window.location.hash === '#/admin-secret-login-2026' && !currentUser) setView('login');
      else if (window.location.hash.includes('admin') && currentUser) setView('admin');
      else if (window.location.hash === '#/contact') setView('contact');
      else if (!window.location.hash) setView('home');
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentUser]);

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('siteSettings', JSON.stringify(updated));
  };

  const handleTextChange = (key, value) => {
    updateSettings({ texts: { ...settings.texts, [key]: value } });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email === 'admin@animaciqbg.net' && loginForm.password === 'admin123') {
      setCurrentUser(MOCK_ADMIN);
      localStorage.setItem('adminSession', 'true');
      window.location.hash = '#/admin-panel';
      setView('admin');
      addLog("Успешен вход", "success");
    } else alert("Невалидни данни!");
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setCurrentUser(null);
    window.location.hash = '';
    setView('home');
  };

  const addLog = (msg, type='info') => {
    setActivityLog(prev => [{id: Date.now(), msg: String(msg), type, date: new Date().toLocaleTimeString()}, ...prev]);
  };

  const handleAddVideo = (data) => {
    try {
      const newVideo = { ...data, id: Date.now().toString(), views: 0, likes: 0 };
      const updated = [newVideo, ...videos];
      setVideos(updated);
      localStorage.setItem('savedVideos', JSON.stringify(updated));
      addLog(`Добавен филм (${data.streamType}): ${data.title}`, "success");
      alert("Добавено успешно!");
    } catch (err) { alert("Грешка при запазване."); }
  };

  const handleDeleteVideo = (id) => {
    const filtered = videos.filter(vid => vid.id !== id);
    setVideos(filtered);
    localStorage.setItem('savedVideos', JSON.stringify(filtered));
    addLog(`Изтрито видео с ID: ${id}`, "warning");
  };

  const handleResetCatalog = () => {
    if (window.confirm("⚠️ СИГУРНИ ЛИ СТЕ? Нулиране на каталога?")) {
      localStorage.setItem('savedVideos', JSON.stringify(DEFAULT_VIDEOS));
      setVideos(DEFAULT_VIDEOS);
      addLog("Каталогът е нулиран", "warning");
    }
  };

  const handleResetTexts = () => {
    if (window.confirm("⚠️ СИГУРНИ ЛИ СТЕ? Това ще възстанови оригиналните текстове.")) {
      updateSettings({ texts: DEFAULT_TEXTS });
      addLog("Текстовете бяха нулирани", "warning");
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => updateSettings({ logoUrl: reader.result, useLogo: true });
    reader.readAsDataURL(file);
  };

  // --- NAVBAR ---
  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
         <div className="flex items-center gap-10">
           <button onClick={() => { window.location.hash = ''; setView('home'); }} className="flex items-center gap-3">
              {settings.useLogo && settings.logoUrl ? (
                 <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                 <span className="text-2xl font-black text-white tracking-tighter">
                    <span style={{ color: settings.primaryColor }}>{settings.siteName.slice(0, -2)}</span>{settings.siteName.slice(-2)}
                 </span>
              )}
           </button>
           <div className="hidden md:flex items-center gap-6">
             <button onClick={() => { window.location.hash = '#/contact'; setView('contact'); }} className={`transition-colors flex items-center gap-2 text-sm font-black uppercase tracking-wider ${view === 'contact' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
               <MessageSquare size={16} style={view === 'contact' ? { color: settings.primaryColor } : {}}/> Контакти
             </button>
           </div>
         </div>
         <div className="flex items-center gap-4">
           {currentUser && (
              <div className="flex items-center gap-3">
                 <button onClick={() => { window.location.hash = '#/admin-panel'; setAdminTab('dashboard'); setView('admin'); }} className="p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"><Settings size={18}/></button>
                 <button onClick={handleLogout} className="p-2 bg-red-900/30 text-red-500 rounded-full hover:bg-red-900/50 transition-colors"><LogOut size={18}/></button>
              </div>
           )}
         </div>
      </div>
    </nav>
  );

  // --- CONTACT VIEW ---
  const ContactView = () => {
    const [form, setForm] = useState({ name: '', message: '' });
    const [status, setStatus] = useState('idle'); 
    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatus('sending');
      try {
        const currentDate = new Date().toLocaleString('bg-BG');
        const emailBody = `Ново запитване от AnimationBG\n═══════════════════════════════════\nИМЕ: ${form.name}\nДАТА: ${currentDate}\n═══════════════════════════════════\nЗАПИТВАНЕ:\n${form.message}\n═══════════════════════════════════\nИзпратено от: animaciqbg.net`.trim();
        const mailtoLink = `mailto:AnimaciqBG@proton.me?subject=Запитване от ${form.name}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
        setStatus('success');
        setForm({ name: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } catch (err) { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
    };
    return (
      <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto min-h-screen">
        <div className="text-center mb-12"><h1 className="text-4xl font-black text-white mb-3 flex items-center justify-center gap-4"><MessageSquare style={{ color: settings.primaryColor }} size={40}/>Свържи се с нас</h1><p className="text-slate-500 text-lg font-medium">Имате въпрос или предложение? Пишете ни!</p></div>
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl"><form onSubmit={handleSubmit} className="space-y-6"><div><label className="block text-slate-400 text-xs font-black mb-2 uppercase tracking-[0.2em]">Вашето име</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Иван Иванов" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:ring-1 transition-all" style={{ '--tw-ring-color': settings.primaryColor }} disabled={status === 'sending'}/></div><div><label className="block text-slate-400 text-xs font-black mb-2 uppercase tracking-[0.2em]">Вашето запитване</label><textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Опишете вашето запитване или предложение..." rows={6} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:ring-1 resize-none transition-all" style={{ '--tw-ring-color': settings.primaryColor }} disabled={status === 'sending'}/></div><button type="submit" disabled={status === 'sending'} className="w-full text-white font-black py-4 rounded-xl shadow-lg hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2" style={{ backgroundColor: settings.primaryColor }}>{status === 'sending' ? <RefreshCw size={20} className="animate-spin"/> : <Send size={20}/>}{status === 'sending' ? 'ОТВАРЯНЕ НА ИМЕЙЛ...' : 'ИЗПРАТИ ЗАПИТВАНЕ'}</button>{status === 'success' && (<div className="p-4 bg-green-900/20 border border-green-700 rounded-xl text-green-400 text-center font-bold text-sm animate-in fade-in">✓ Вашият имейл клиент беше зареден. Моля кликнете "Изпрати" в него.</div>)}</form><div className="mt-8 pt-8 border-t border-slate-800 flex flex-col items-center gap-3"><div className="flex items-center gap-3 text-slate-400"><Mail size={18} style={{ color: settings.primaryColor }}/><a href="mailto:AnimaciqBG@proton.me" className="hover:text-white font-bold transition-colors">AnimaciqBG@proton.me</a></div><span className="text-[10px] text-slate-600 uppercase font-black tracking-widest text-center">Отговаряме в рамките на 24 часа</span></div></div>
        <div className="mt-12 p-8 bg-slate-900/40 border border-slate-800 rounded-3xl text-slate-500 text-sm leading-relaxed"><h3 className="font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider text-xs"><Shield size={16} className="text-blue-500"/> Disclaimer / DMCA</h3><p className="mb-4">AnimationBG не хоства видео съдържание на собствени сървъри. Всички видеа се зареждат от независими трети страни чрез стандартна embed технология.</p><p>Ако сте притежател на авторски права и считате, че даден линк нарушава вашите права, моля свържете се с нас на посочения имейл за незабавно премахване на съответния линк от нашия каталог.</p></div>
      </div>
    );
  };

  // --- ADMIN PANEL ---
  const AdminPanel = () => {
    const [form, setForm] = useState({ 
      title: '', year: '', streamType: 'embed', 
      embedUrl: '', downloadUrl: '', thumbnail: '', description: '' 
    });

    const TextInput = ({ label, field }) => (
      <div className="space-y-1.5"><label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{label}</label><input value={settings.texts[field]} onChange={e => handleTextChange(field, e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm outline-none focus:ring-1 transition-all" style={{ '--tw-ring-color': settings.primaryColor }}/></div>
    );

    return (
      <div className="pt-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
         <div className="md:w-64 shrink-0 space-y-2">
            {[ { id: 'dashboard', label: settings.texts.adminTabCatalog, icon: Film }, { id: 'settings', label: settings.texts.adminTabSettings, icon: Palette }, { id: 'texts', label: settings.texts.adminTabTexts, icon: Type }, { id: 'logs', label: settings.texts.adminTabLogs, icon: Activity } ].map(tab => (
               <button key={tab.id} onClick={() => setAdminTab(tab.id)} className={`w-full text-left p-4 rounded-xl font-bold transition-all flex items-center gap-3 ${adminTab === tab.id ? 'text-white' : 'text-slate-500 hover:bg-slate-800'}`} style={adminTab === tab.id ? { backgroundColor: settings.primaryColor } : {}}><tab.icon size={18}/> {tab.label}</button>
            ))}
         </div>

         <div className="flex-1 pb-20">
            {adminTab === 'dashboard' && (
              <div className="space-y-10">
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3"><Plus style={{ color: settings.primaryColor }}/> Добави анимация</h2>
                    <form onSubmit={e => { e.preventDefault(); handleAddVideo(form); setForm({ title: '', year: '', streamType: 'embed', embedUrl: '', downloadUrl: '', thumbnail: '', description: '' }); }} className="grid grid-cols-2 gap-6">
                       <input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Заглавие" className="col-span-2 bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:ring-1" style={{ '--tw-ring-color': settings.primaryColor }}/>
                       <input required value={form.year} onChange={e=>setForm({...form, year: e.target.value})} placeholder="Година" className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none"/>
                       <input required value={form.thumbnail} onChange={e=>setForm({...form, thumbnail: e.target.value})} placeholder="Thumbnail URL" className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none"/>
                       
                       <div className="col-span-2 p-6 bg-slate-950/50 border border-slate-800 rounded-3xl space-y-4">
                          <label className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] block mb-2">Тип на източника</label>
                          <div className="flex gap-8">
                             <label className="flex items-center gap-3 cursor-pointer group text-sm font-bold">
                                <input 
                                  type="radio" name="stype" checked={form.streamType === 'embed'} 
                                  onChange={() => setForm({...form, streamType: 'embed'})}
                                  className="w-5 h-5 accent-red-600"
                                />
                                <span className={form.streamType === 'embed' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}>Стрийминг (Player)</span>
                             </label>
                             <label className="flex items-center gap-3 cursor-pointer group text-sm font-bold">
                                <input 
                                  type="radio" name="stype" checked={form.streamType === 'download'} 
                                  onChange={() => setForm({...form, streamType: 'download'})}
                                  className="w-5 h-5 accent-red-600"
                                />
                                <span className={form.streamType === 'download' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}>Изтегляне (Download)</span>
                             </label>
                          </div>
                       </div>

                       {form.streamType === 'embed' ? (
                          <div className="col-span-2 space-y-4 animate-in slide-in-from-top-2 duration-300">
                             <div className="p-4 bg-blue-900/10 border border-blue-900/20 rounded-2xl">
                                <h4 className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><HelpCircle size={14}/> Как да намериш Embed URL:</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Напр. https://vidsrc.me/embed/movie/tt2294629</p>
                             </div>
                             <input required value={form.embedUrl} onChange={e=>setForm({...form, embedUrl: e.target.value})} placeholder="https://vidsrc.me/embed/movie/tt..." className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none font-mono text-xs"/>
                          </div>
                       ) : (
                          <div className="col-span-2 space-y-4 animate-in slide-in-from-top-2 duration-300">
                             <div className="p-4 bg-green-900/10 border border-green-900/20 rounded-2xl">
                                <h4 className="text-green-400 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><FileDown size={14}/> Относно линковете:</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Постави линк към Zamunda, Arena или директен magnet линк.</p>
                             </div>
                             <input required value={form.downloadUrl} onChange={e=>setForm({...form, downloadUrl: e.target.value})} placeholder="https://zamunda.net/... или magnet:?xt=..." className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none font-mono text-xs"/>
                          </div>
                       )}

                       <textarea required value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Описание..." className="col-span-2 bg-slate-950 border border-slate-800 p-4 rounded-xl text-white h-32 outline-none"/>
                       <button className="col-span-2 text-white font-black py-4 rounded-xl hover:brightness-110 transition-all shadow-xl" style={{ backgroundColor: settings.primaryColor }}>ПУБЛИКУВАЙ</button>
                    </form>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-3">
                    {videos.map(v => (
                      <div key={v.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 group hover:border-slate-600 transition-colors">
                         <div className="flex items-center gap-4"><img src={v.thumbnail} className="w-10 h-14 object-cover rounded" alt=""/><div className="text-white font-bold">{v.title} <span className="text-[9px] text-slate-500 uppercase ml-2">({v.streamType})</span></div></div>
                         <button onClick={() => handleDeleteVideo(v.id)} className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {adminTab === 'settings' && (
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-12 text-white">
                  <section><h2 className="text-xl font-black mb-6 flex items-center gap-3"><HardDrive style={{ color: settings.primaryColor }}/> Поддръжка</h2><div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl"><button onClick={handleResetCatalog} className="flex items-center gap-2 px-6 py-3 bg-red-900/20 text-red-500 border border-red-900 hover:bg-red-900 hover:text-white rounded-xl font-bold transition-all"><RotateCcw size={18}/> Нулиране на каталога</button></div></section>
                  <section className="pt-8 border-t border-slate-800"><h2 className="text-xl font-black mb-6 flex items-center gap-3"><Globe style={{ color: settings.primaryColor }}/> Идентичност</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="space-y-4"><label className="text-slate-400 text-xs font-bold uppercase block">Име на сайта</label><div className="flex gap-2"><input value={settings.siteName} onChange={e => updateSettings({ siteName: e.target.value })} className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" /><button onClick={() => updateSettings({ useLogo: !settings.useLogo })} className={`p-3 rounded-xl border ${settings.useLogo ? 'bg-white text-black' : 'border-slate-800'}`}>{settings.useLogo ? <ImageIcon size={20}/> : <Type size={20}/>}</button></div></div><div className="space-y-4"><label className="text-slate-400 text-xs font-bold uppercase block">Качване на лого</label><label className="flex items-center justify-center p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors"><UploadCloud size={20} className="mr-2"/> Избери файл<input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} /></label></div></div></section>
                  <section className="pt-8 border-t border-slate-800"><h2 className="text-xl font-black mb-6 flex items-center gap-3"><Palette style={{ color: settings.primaryColor }}/> Цветова схема</h2><div className="flex flex-wrap gap-4 items-center">{['#DC2626', '#2563EB', '#7C3AED', '#059669', '#F59E0B', '#EC4899'].map(c => (<button key={c} onClick={() => updateSettings({ primaryColor: c })} className={`w-12 h-12 rounded-full border-4 ${settings.primaryColor === c ? 'border-white' : 'border-transparent'}`} style={{backgroundColor: c}}/>))}<div className="flex items-center gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800"><span className="text-xs font-bold px-2">Custom:</span><input type="color" value={settings.primaryColor} onChange={e => updateSettings({ primaryColor: e.target.value })} className="w-8 h-8 bg-transparent cursor-pointer" /></div></div></section>
                  <section className="pt-8 border-t border-slate-800"><h2 className="text-xl font-black mb-6 flex items-center gap-3"><Sparkles style={{ color: settings.primaryColor }}/> Атмосфера</h2><div className="grid grid-cols-2 md:grid-cols-5 gap-4">{[ { id: 'none', label: 'Без ефект', icon: X }, { id: 'snow', label: 'Зима', icon: Snowflake }, { id: 'rain', label: 'Есен', icon: CloudRain }, { id: 'sakura', label: 'Пролет', icon: Flower }, { id: 'fireflies', label: 'Лято', icon: Sparkles } ].map(ef => (<button key={ef.id} onClick={() => updateSettings({ visualEffect: ef.id })} className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${settings.visualEffect === ef.id ? 'bg-white text-black' : 'bg-slate-950 border-slate-800 text-slate-500'}`}><ef.icon size={24} className="mb-2" /><span className="text-[10px] font-bold uppercase">{ef.label}</span></button>)) }</div></section>
                  <section className="pt-8 border-t border-slate-800"><h2 className="text-xl font-black mb-6 flex items-center gap-3"><Stamp style={{ color: settings.primaryColor }}/> Воден знак</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="space-y-6"><div className="flex items-center gap-3"><input type="checkbox" checked={settings.watermarkEnabled} onChange={e => updateSettings({ watermarkEnabled: e.target.checked })} className="w-5 h-5 accent-red-600" /><label className="font-bold">Активирай воден знак</label></div><input value={settings.watermarkText} onChange={e => updateSettings({ watermarkText: e.target.value })} placeholder="Текст" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" /></div><div className="space-y-6"><div><label className="text-slate-400 text-xs font-bold uppercase block mb-2">Позиция</label><select value={settings.watermarkPosition} onChange={e => updateSettings({ watermarkPosition: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none"><option value="top-right">Горе Вдясно</option><option value="top-left">Горе Вляво</option><option value="bottom-right">Долу Вдясно</option><option value="bottom-left">Долу Вляво</option></select></div><div><label className="text-slate-400 text-xs font-bold uppercase block mb-2">Прозрачност: {settings.watermarkOpacity}%</label><input type="range" min="10" max="50" value={settings.watermarkOpacity} onChange={e => updateSettings({ watermarkOpacity: e.target.value })} className="w-full" style={{ accentColor: settings.primaryColor }} /></div></div></div></section>
               </div>
            )}

            {adminTab === 'texts' && (
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-10 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex justify-between items-center"><h2 className="text-2xl font-black flex items-center gap-3"><Type style={{ color: settings.primaryColor }}/> Текстове</h2><button onClick={handleResetTexts} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><RotateCcw size={18}/></button></div>
                 <section className="space-y-6"><h3 className="text-xs font-black text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-2">Главна страница</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><TextInput label="Заглавие" field="homeTitle" /><TextInput label="Подзаглавие" field="homeSubtitle" /><TextInput label="Search placeholder" field="searchPlaceholder" /><TextInput label="Badge Стрийминг" field="videoBadgeStream" /><TextInput label="Badge Изтегляне" field="videoBadgeDownload" /></div></section>
                 <section className="space-y-6 pt-6"><h3 className="text-xs font-black text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-2">Плейър</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><TextInput label="Live Badge" field="playerLiveBadge" /><TextInput label="Loading" field="playerLoading" /></div></section>
                 <section className="space-y-6 pt-6"><h3 className="text-xs font-black text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-2">Footer</h3><TextInput label="Описание" field="footerDescription" /></section>
              </div>
            )}

            {adminTab === 'logs' && (
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl h-[600px] overflow-hidden flex flex-col text-white">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><Activity style={{ color: settings.primaryColor }}/> Логове</h2>
                  <div className="flex-1 overflow-y-auto pr-4 space-y-2">{activityLog.map(l => (<div key={l.id} className="p-3 bg-slate-950 border-l-4 rounded flex justify-between items-center" style={{ borderLeftColor: settings.primaryColor }}><span className="text-xs font-medium">{String(l.msg)}</span><span className="text-[10px] text-slate-600 font-mono">{l.date}</span></div>))}</div>
               </div>
            )}
         </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 selection:bg-red-600 selection:text-white" onContextMenu={e=>e.preventDefault()}>
      <VisualEffectLayer type={settings.visualEffect} />
      
      {activeVideo && activeVideo.streamType === 'embed' && <EmbedPlayer video={activeVideo} onClose={() => setActiveVideo(null)} settings={settings} />}
      {activeVideo && activeVideo.streamType === 'download' && <DownloadModal video={activeVideo} onClose={() => setActiveVideo(null)} settings={settings} />}

      <Navbar />

      <main>
        {view === 'home' && (
           <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
              <div className="mb-12">
                 <h1 className="text-4xl font-black text-white mb-2">{settings.texts.homeTitle}</h1>
                 <p className="text-slate-500 text-lg font-medium">{settings.texts.homeSubtitle}</p>
              </div>
              <div className="mb-10 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/>
                 <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={settings.texts.searchPlaceholder} className="w-full bg-slate-900 border border-slate-800 p-5 pl-14 rounded-2xl text-white focus:ring-1 outline-none transition-all shadow-xl" style={{ '--tw-ring-color': settings.primaryColor }}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {videos.filter(v=>v.title.toLowerCase().includes(searchQuery.toLowerCase())).map(v => (
                  <div key={v.id} onClick={() => setActiveVideo(v)} className="bg-slate-900 rounded-3xl overflow-hidden cursor-pointer hover:ring-2 transition-all group transform hover:-translate-y-2 shadow-2xl" style={{ '--tw-ring-color': v.streamType === 'download' ? '#22c55e' : settings.primaryColor }}>
                     <div className="aspect-[3/4] relative">
                        <img src={v.thumbnail} className="w-full h-full object-cover" alt={v.title}/>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                           <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform" style={{ backgroundColor: v.streamType === 'download' ? '#22c55e' : settings.primaryColor }}>
                              {v.streamType === 'download' ? <FileDown fill="white" className="text-white"/> : <Play fill="white" className="text-white ml-1" size={32}/>}
                           </div>
                        </div>
                        <div className="absolute top-4 right-4 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg" style={{ backgroundColor: v.streamType === 'download' ? '#22c55e' : settings.primaryColor }}>
                           {v.streamType === 'download' ? settings.texts.videoBadgeDownload : settings.texts.videoBadgeStream}
                        </div>
                     </div>
                     <div className="p-6"><h3 className="font-bold text-white text-lg truncate mb-1">{v.title}</h3><div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider"><span>{v.year}</span><span className="flex items-center gap-1"><Eye size={14}/> {v.views}</span></div></div>
                  </div>
                ))}
              </div>
           </div>
        )}
        {view === 'login' && (
           <div className="pt-40 flex justify-center px-6">
              <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
                 <h2 className="text-3xl font-black text-white mb-8 text-center uppercase tracking-widest">{settings.texts.loginTitle}</h2>
                 <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" required placeholder={settings.texts.loginEmailPlaceholder} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:ring-1" style={{ '--tw-ring-color': settings.primaryColor }} value={loginForm.email} onChange={e=>setLoginForm({...loginForm, email: e.target.value})}/>
                    <input type="password" required placeholder={settings.texts.loginPasswordPlaceholder} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:ring-1" style={{ '--tw-ring-color': settings.primaryColor }} value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password: e.target.value})}/>
                    <button className="w-full text-white font-black py-4 rounded-xl shadow-lg hover:brightness-110 transition-all" style={{ backgroundColor: settings.primaryColor }}>{settings.texts.loginButton}</button>
                 </form>
              </div>
           </div>
        )}
        {view === 'admin' && <AdminPanel />}
        {view === 'contact' && <ContactView />}
      </main>
      <footer className="py-20 border-t border-slate-900 px-6 mt-20">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div>
               <h3 className="text-2xl font-black text-white tracking-tighter mb-2">{settings.useLogo && settings.logoUrl ? <img src={settings.logoUrl} className="h-6" alt="Footer Logo" /> : settings.siteName}</h3>
               <p className="text-slate-600 text-sm font-medium">{settings.texts.footerDescription}</p>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
               <button onClick={() => { window.location.hash = '#/contact'; setView('contact'); }} className="hover:text-white transition-colors">DMCA</button>
               <button onClick={() => { window.location.hash = '#/contact'; setView('contact'); }} className="hover:text-white transition-colors">Поверителност</button>
               <button onClick={() => { window.location.hash = '#/contact'; setView('contact'); }} className="hover:text-white transition-colors">Условия</button>
            </div>
         </div>
      </footer>
    </div>
  );
}
