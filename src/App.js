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
  ExternalLink, FileDown, Layers, Info
} from 'lucide-react';

/**
 * ANIMATIONBG - ВЕРСИЯ 12.2 (FIXED IMAGE ATTRIBUTES)
 * * КОРЕКЦИИ:
 * - Добавен липсващ alt="" атрибут в CollectionsView (ред 206).
 * - Всички административни функции и CMS модули са запазени и активни.
 */

// --- КОНСТАНТИ ПО ПОДРАЗБИРАНЕ ---
const DEFAULT_VIDEOS = [
  {
    id: '1',
    title: 'Frozen (2013) - Анимация',
    thumbnail: 'https://images.unsplash.com/photo-1580136608260-42d1c4aa0153?q=80&w=1000&auto=format&fit=crop',
    streamType: 'embed',
    embedUrl: 'https://vidsrc.me/embed/movie/tt2294629',
    year: 2013,
    views: 0,
    likes: 0,
    dislikes: 0,
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
  adminTabInquiries: 'Запитвания',
  adminTabCollections: 'Колекции',
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
const DownloadModal = ({ video, onClose, settings }) => (
  <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
      <div className="relative aspect-video">
        <img src={video.thumbnail} className="w-full h-full object-cover opacity-50" alt=""/>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"/>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-red-600 rounded-full text-white transition-all">
          <X size={24}/>
        </button>
        <div className="absolute bottom-6 left-8 right-8">
          <h2 className="text-4xl font-black text-white drop-shadow-2xl">{video.title}</h2>
          <p className="text-slate-300 text-sm font-bold uppercase tracking-[0.3em] mt-2">{video.year} • БЪЛГАРСКИ ДУБЛАЖ</p>
        </div>
      </div>
      <div className="p-10 text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
           <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30">
              <FileDown size={40}/>
           </div>
           <p className="text-slate-400 font-medium leading-relaxed">
              Този филм е наличен само за изтегляне. Използвайте бутона по-долу, за да достъпите източника.
           </p>
        </div>
        <a 
          href={video.downloadUrl} target="_blank" rel="noreferrer"
          className="block w-full text-white font-black py-6 rounded-[1.5rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-xl uppercase tracking-wider"
          style={{ backgroundColor: '#22c55e' }}
        >
          ИЗТЕГЛИ СЕГА <ExternalLink size={24}/>
        </a>
      </div>
    </div>
  </div>
);

// --- EMBED ПЛЕЙЪР (IFRAME) ---
const EmbedPlayer = memo(({ video, onClose, settings, onStatUpdate }) => {
  const watermarkPosClasses = {
    'top-right': 'top-20 right-8', 'top-left': 'top-20 left-8', 'bottom-right': 'bottom-24 right-8', 'bottom-left': 'bottom-24 left-8'
  };

  useEffect(() => {
    onStatUpdate(video.id, 'views');
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {settings.watermarkEnabled && (
        <div className={`absolute ${watermarkPosClasses[settings.watermarkPosition] || 'top-20 right-8'} z-[70] pointer-events-none select-none`} style={{ opacity: settings.watermarkOpacity / 100 }}>
          <span className="text-white font-black text-2xl uppercase tracking-widest drop-shadow-lg">{settings.watermarkText}</span>
        </div>
      )}
      <button onClick={onClose} className="absolute top-6 right-6 z-[80] p-4 bg-white/10 hover:bg-red-600 rounded-full text-white transition-all shadow-2xl backdrop-blur-md"><X size={28}/></button>
      <div className="absolute top-0 left-0 right-0 p-8 z-[70] bg-gradient-to-b from-black/95 via-black/50 to-transparent pointer-events-none">
        <h2 className="text-white text-3xl font-black flex items-center gap-4">
          {video.title} 
          <span className="text-xs px-3 py-1 rounded-full uppercase font-black tracking-widest shadow-lg" style={{ backgroundColor: settings.primaryColor }}>{settings.texts.playerLiveBadge}</span>
        </h2>
      </div>
      <iframe src={video.embedUrl} className="w-full h-full border-0" allowFullScreen allow="autoplay; fullscreen" title={video.title} referrerPolicy="origin"/>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 p-2 px-6 rounded-full z-[80] opacity-0 hover:opacity-100 transition-opacity duration-300">
         <button onClick={() => onStatUpdate(video.id, 'likes')} className="flex items-center gap-2 text-white hover:text-green-400 transition-colors py-2"><ThumbsUp size={18}/> {video.likes || 0}</button>
         <div className="w-px h-4 bg-white/20"/>
         <button onClick={() => onStatUpdate(video.id, 'dislikes')} className="flex items-center gap-2 text-white hover:text-red-500 transition-colors py-2"><ThumbsDown size={18}/> {video.dislikes || 0}</button>
      </div>
    </div>
  );
});

// --- ГЛАВНО ПРИЛОЖЕНИЕ ---
export default function App() {
  const [view, setView] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null);
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

  // --- ANTI-INSPECT PROTECTION ---
  useEffect(() => {
    const handleProtection = (e) => {
      if (
        e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
        window.location.hash = '';
        setView('home');
        return false;
      }
    };
    window.addEventListener('keydown', handleProtection);
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    
    const consoleClear = setInterval(() => {
      if(!currentUser) console.clear();
    }, 1000);

    return () => {
      window.removeEventListener('keydown', handleProtection);
      clearInterval(consoleClear);
    };
  }, [currentUser]);

  // INITIAL LOAD & PERSISTENCE
  useEffect(() => {
    if (localStorage.getItem('adminSession') === 'true') setCurrentUser(MOCK_ADMIN);
    
    const savedVideos = localStorage.getItem('savedVideos');
    if (savedVideos) setVideos(JSON.parse(savedVideos));
    else { setVideos(DEFAULT_VIDEOS); localStorage.setItem('savedVideos', JSON.stringify(DEFAULT_VIDEOS)); }
    
    const savedInquiries = localStorage.getItem('savedInquiries');
    if (savedInquiries) setInquiries(JSON.parse(savedInquiries));

    const savedCollections = localStorage.getItem('savedCollections');
    if (savedCollections) setCollections(JSON.parse(savedCollections));

    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({ ...settings, ...parsed, texts: { ...DEFAULT_TEXTS, ...parsed.texts } });
    }

    const handleHash = () => {
      if (window.location.hash === '#/admin-secret-login-2026' && !currentUser) setView('login');
      else if (window.location.hash.includes('admin') && currentUser) setView('admin');
      else if (window.location.hash === '#/contact') setView('contact');
      else if (window.location.hash === '#/collections') setView('collections');
      else if (!window.location.hash) setView('home');
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentUser]);

  // --- LOGIC HANDLERS ---
  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('siteSettings', JSON.stringify(updated));
  };

  const handleTextChange = (key, value) => {
    const updatedTexts = { ...settings.texts, [key]: value };
    updateSettings({ texts: updatedTexts });
  };

  const handleStatUpdate = (id, field) => {
    const updatedVideos = videos.map(v => {
      if (v.id === id) return { ...v, [field]: (v[field] || 0) + 1 };
      return v;
    });
    setVideos(updatedVideos);
    localStorage.setItem('savedVideos', JSON.stringify(updatedVideos));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email === 'admin@animaciqbg.net' && loginForm.password === 'admin123') {
      setCurrentUser(MOCK_ADMIN);
      localStorage.setItem('adminSession', 'true');
      window.location.hash = '#/admin-panel';
      setView('admin');
      addLog("Успешен вход в административния панел", "success");
    } else alert("Невалидни данни!");
  };

  const addLog = (msg, type='info') => {
    setActivityLog(prev => [{id: Date.now(), msg: String(msg), type, date: new Date().toLocaleTimeString()}, ...prev]);
  };

  const handleAddVideo = (data) => {
    const newVideo = { ...data, id: Date.now().toString(), views: 0, likes: 0, dislikes: 0 };
    const updated = [newVideo, ...videos];
    setVideos(updated);
    localStorage.setItem('savedVideos', JSON.stringify(updated));
    addLog(`Добавен нов филм: ${data.title}`, "success");
    alert("Успешно добавяне!");
  };

  const handleDeleteVideo = (id) => {
    if (window.confirm("Сигурни ли сте, че искате да изтриете този филм?")) {
      const filtered = videos.filter(v => v.id !== id);
      setVideos(filtered);
      localStorage.setItem('savedVideos', JSON.stringify(filtered));
      addLog(`Изтрит филм с ID: ${id}`, "warning");
    }
  };

  const handleResetCatalog = () => {
    if (window.confirm("⚠️ ВНИМАНИЕ: Това ще нулира каталога до фабрични настройки. Продължавате ли?")) {
      setVideos(DEFAULT_VIDEOS);
      localStorage.setItem('savedVideos', JSON.stringify(DEFAULT_VIDEOS));
      addLog("Каталогът беше нулиран", "warning");
      alert("Каталогът е нулиран.");
    }
  };

  const handleResetTexts = () => {
    if (window.confirm("⚠️ Нулиране на всички текстове до оригиналните?")) {
      updateSettings({ texts: DEFAULT_TEXTS });
      addLog("Текстовете бяха нулирани", "warning");
    }
  };

  const handleInquirySubmit = (data) => {
    const newInquiry = { ...data, id: Date.now(), date: new Date().toLocaleString('bg-BG'), read: false };
    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    localStorage.setItem('savedInquiries', JSON.stringify(updated));
    addLog(`Получено ново запитване от ${data.name}`, "info");
    return true;
  };

  // --- NAVBAR ---
  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-[90] bg-black/60 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
         <div className="flex items-center gap-12">
           <button onClick={() => { window.location.hash = ''; setView('home'); setActiveCollection(null); }} className="flex items-center gap-3">
              {settings.useLogo && settings.logoUrl ? (
                 <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                 <span className="text-3xl font-black text-white tracking-tighter hover:scale-105 transition-transform">
                    <span style={{ color: settings.primaryColor }}>{settings.siteName.slice(0, -2)}</span>{settings.siteName.slice(-2)}
                 </span>
              )}
           </button>
           <div className="hidden lg:flex items-center gap-8">
             <button onClick={() => { window.location.hash = ''; setView('home'); setActiveCollection(null); }} className={`text-sm font-bold uppercase tracking-widest transition-colors ${view === 'home' && !activeCollection ? 'text-white' : 'text-slate-500 hover:text-white'}`}>Начало</button>
             <button onClick={() => { window.location.hash = '#/collections'; setView('collections'); }} className={`text-sm font-bold uppercase tracking-widest transition-colors ${view === 'collections' ? 'text-white' : 'text-slate-500 hover:text-white'}`}>Колекции</button>
             <button onClick={() => { window.location.hash = '#/contact'; setView('contact'); }} className={`text-sm font-bold uppercase tracking-widest transition-colors ${view === 'contact' ? 'text-white' : 'text-slate-500 hover:text-white'}`}>Контакти</button>
           </div>
         </div>
         <div className="flex items-center gap-4">
           {currentUser && (
              <div className="flex items-center gap-3 bg-white/5 p-1 rounded-full border border-white/10">
                 <button onClick={() => { window.location.hash = '#/admin-panel'; setAdminTab('dashboard'); setView('admin'); }} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"><Settings size={20}/></button>
                 <button onClick={() => { localStorage.removeItem('adminSession'); setCurrentUser(null); setView('home'); window.location.hash = ''; }} className="p-3 bg-red-600 rounded-full text-white shadow-lg shadow-red-600/20"><LogOut size={20}/></button>
              </div>
           )}
         </div>
      </div>
    </nav>
  );

  // --- VIEWS ---
  const HomeView = () => {
    const displayVideos = activeCollection 
      ? videos.filter(v => activeCollection.videoIds.includes(v.id))
      : videos;

    return (
      <div className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto min-h-screen">
        <div className="mb-16">
           <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">{activeCollection ? activeCollection.title : settings.texts.homeTitle}</h1>
           <p className="text-slate-400 text-xl font-medium max-w-2xl">{activeCollection ? activeCollection.description : settings.texts.homeSubtitle}</p>
        </div>
        <div className="mb-12 relative max-w-xl">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24}/>
           <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={settings.texts.searchPlaceholder} className="w-full bg-white/5 border border-white/10 p-6 pl-16 rounded-[2rem] text-white focus:ring-2 outline-none transition-all text-lg backdrop-blur-xl" style={{ '--tw-ring-color': settings.primaryColor }}/>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {displayVideos.filter(v=>v.title.toLowerCase().includes(searchQuery.toLowerCase())).map(v => (
            <div key={v.id} onClick={() => setActiveVideo(v)} className="group relative aspect-[2/3] bg-slate-900 rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:scale-[1.05] hover:z-10 ring-1 ring-white/5 hover:ring-white/20">
               <img src={v.thumbnail} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-40" alt=""/>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60"/>
               <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit mb-3 text-[10px] font-black uppercase tracking-widest border border-white/10" style={{ color: v.streamType === 'download' ? '#22c55e' : 'white' }}>
                    {v.streamType === 'download' ? settings.texts.videoBadgeDownload : settings.texts.videoBadgeStream}
                  </div>
                  <h3 className="font-black text-white text-xl line-clamp-2 leading-tight">{v.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-tighter">
                     <span className="flex items-center gap-1"><Clock size={12}/> {v.year}</span>
                     <span className="flex items-center gap-1 text-white/60"><Eye size={12}/> {v.views || 0}</span>
                  </div>
                  <button className="mt-6 w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-2">
                     {v.streamType === 'download' ? <FileDown size={18}/> : <Play size={18} fill="black"/>}
                     {v.streamType === 'download' ? 'Изтегли' : 'Гледай'}
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CollectionsView = () => (
    <div className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto min-h-screen">
       <h1 className="text-5xl font-black text-white mb-12 flex items-center gap-6"><Layers size={48} style={{ color: settings.primaryColor }}/> Филмови Колекции</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {collections.map(col => (
             <div key={col.id} onClick={() => { setActiveCollection(col); setView('home'); }} className="group relative bg-slate-900 aspect-video rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl ring-1 ring-white/10 hover:ring-white/30 transition-all">
                <div className="absolute inset-0 grid grid-cols-2 opacity-40 group-hover:scale-105 transition-transform duration-700">
                   {col.videoIds.slice(0, 4).map(vidId => {
                      const v = videos.find(x => x.id === vidId);
                      return <img key={vidId} src={v?.thumbnail} className="w-full h-full object-cover" alt=""/>;
                   })}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"/>
                <div className="absolute bottom-8 left-10 right-10">
                   <h3 className="text-3xl font-black text-white mb-2">{col.title}</h3>
                   <p className="text-slate-400 text-sm font-medium line-clamp-1">{col.description}</p>
                   <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-widest"><Film size={14}/> {col.videoIds.length} филма</div>
                </div>
             </div>
          ))}
          {collections.length === 0 && <p className="text-slate-500 py-20 text-center col-span-full">Все още няма създадени колекции.</p>}
       </div>
    </div>
  );

  const ContactView = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');
    const onSubmit = (e) => {
      e.preventDefault();
      setStatus('sending');
      setTimeout(() => {
        handleInquirySubmit(form);
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      }, 1000);
    };
    return (
      <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto min-h-screen">
        <div className="text-center mb-12"><h1 className="text-5xl font-black text-white mb-4 flex items-center justify-center gap-4"><MessageSquare style={{ color: settings.primaryColor }} size={48}/> Свържи се с нас</h1><p className="text-slate-500 text-lg">Вашето мнение е важно за нас.</p></div>
        <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-in zoom-in duration-300">
          <form onSubmit={onSubmit} className="space-y-6">
            <input type="text" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Вашето име" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}}/>
            <input type="email" required value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="Имейл адрес" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}}/>
            <textarea required value={form.message} onChange={e=>setForm({...form, message: e.target.value})} placeholder="Съобщение..." rows={6} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:ring-1 resize-none" style={{'--tw-ring-color': settings.primaryColor}}/>
            <button type="submit" className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3">
               {status === 'sending' ? <RefreshCw className="animate-spin"/> : <Send size={20}/>}
               {status === 'sending' ? 'Изпращане...' : 'Изпрати съобщение'}
            </button>
            {status === 'success' && <div className="p-4 bg-green-500/20 text-green-400 rounded-xl text-center font-bold text-sm">✓ Благодарим ви! Съобщението е записано.</div>}
          </form>
        </div>
      </div>
    );
  };

  // --- ADMIN PANEL COMPONENTS ---
  const AdminPanel = () => {
    const TextInput = ({ label, field }) => (
      <div className="space-y-1.5">
         <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{label}</label>
         <input 
           value={settings.texts[field]} 
           onChange={e => handleTextChange(field, e.target.value)}
           className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm outline-none focus:ring-1 transition-all"
           style={{ '--tw-ring-color': settings.primaryColor }}
         />
      </div>
    );

    return (
      <div className="pt-32 px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-10">
         <div className="lg:w-72 shrink-0 flex flex-col gap-2">
            {[
              { id: 'dashboard', label: settings.texts.adminTabCatalog, icon: Film },
              { id: 'collections', label: settings.texts.adminTabCollections, icon: Layers },
              { id: 'inquiries', label: settings.texts.adminTabInquiries, icon: MessageSquare, count: inquiries.filter(x=>!x.read).length },
              { id: 'settings', label: settings.texts.adminTabSettings, icon: Palette },
              { id: 'texts', label: settings.texts.adminTabTexts, icon: Type },
              { id: 'logs', label: settings.texts.adminTabLogs, icon: Activity }
            ].map(tab => (
               <button key={tab.id} onClick={() => setAdminTab(tab.id)} className={`w-full text-left p-5 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-between group ${adminTab === tab.id ? 'text-white' : 'text-slate-500 hover:bg-white/5'}`} style={adminTab === tab.id ? { backgroundColor: settings.primaryColor } : {}}>
                  <span className="flex items-center gap-4"><tab.icon size={18}/> {tab.label}</span>
                  {tab.count > 0 && <span className="bg-white text-black px-2 py-1 rounded-lg text-[9px]">{tab.count}</span>}
               </button>
            ))}
         </div>

         <div className="flex-1 pb-20">
            {/* 🎬 ТАБ КАТАЛОГ */}
            {adminTab === 'dashboard' && (
               <div className="space-y-10">
                  <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                     <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3"><Plus style={{ color: settings.primaryColor }}/> Добавяне на филм</h2>
                     <form onSubmit={e => {
                        e.preventDefault();
                        const d = new FormData(e.target);
                        handleAddVideo({
                           title: d.get('title'), year: d.get('year'), streamType: d.get('type'),
                           embedUrl: d.get('embed'), downloadUrl: d.get('download'),
                           thumbnail: d.get('thumb'), description: d.get('desc')
                        });
                        e.target.reset();
                     }} className="grid grid-cols-2 gap-6">
                        <input name="title" required placeholder="Заглавие" className="col-span-2 bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}}/>
                        <input name="year" required placeholder="Година" className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                        <input name="thumb" required placeholder="Thumbnail URL" className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                        <select name="type" className="col-span-2 bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none">
                           <option value="embed">Стрийминг</option>
                           <option value="download">Изтегляне</option>
                        </select>
                        <input name="embed" placeholder="Embed URL" className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                        <input name="download" placeholder="Download URL" className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                        <textarea name="desc" placeholder="Описание..." className="col-span-2 bg-black/40 border border-white/5 p-5 rounded-2xl text-white h-32 outline-none"/>
                        <button className="col-span-2 py-5 text-white font-black rounded-2xl uppercase tracking-widest shadow-2xl hover:brightness-125 transition-all" style={{ backgroundColor: settings.primaryColor }}>Публикувай</button>
                     </form>
                  </div>
                  <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-4">
                     <h3 className="text-white font-black uppercase text-xs tracking-widest mb-4">Инвентар</h3>
                     {videos.map(v => (
                        <div key={v.id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                           <div className="flex items-center gap-4">
                              <img src={v.thumbnail} className="w-10 h-14 object-cover rounded-lg" alt=""/>
                              <div><div className="text-white font-bold">{v.title}</div><div className="text-[10px] text-slate-500 font-bold uppercase">{v.views} Гледания</div></div>
                           </div>
                           <button onClick={()=>handleDeleteVideo(v.id)} className="p-3 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* 📚 ТАБ КОЛЕКЦИИ */}
            {adminTab === 'collections' && (
               <div className="space-y-10">
                  <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                     <h2 className="text-2xl font-black text-white mb-8">Създай Колекция</h2>
                     <form onSubmit={e => {
                        e.preventDefault();
                        const d = new FormData(e.target);
                        const sel = Array.from(e.target.vids.selectedOptions).map(o => o.value);
                        const newCol = { id: Date.now(), title: d.get('title'), description: d.get('desc'), videoIds: sel };
                        const updated = [...collections, newCol];
                        setCollections(updated);
                        localStorage.setItem('savedCollections', JSON.stringify(updated));
                        e.target.reset();
                        addLog(`Създадена колекция: ${newCol.title}`, "success");
                     }} className="space-y-6">
                        <input name="title" required placeholder="Заглавие на колекцията" className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                        <textarea name="desc" placeholder="Кратко описание..." className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none h-24"/>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Избери филми (задръж Ctrl)</label>
                           <select name="vids" multiple className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-white h-48 outline-none">
                              {videos.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                           </select>
                        </div>
                        <button className="w-full py-5 text-white font-black rounded-2xl uppercase tracking-widest shadow-2xl transition-all" style={{ backgroundColor: settings.primaryColor }}>СЪЗДАЙ</button>
                     </form>
                  </div>
               </div>
            )}

            {/* 💬 ТАБ ЗАПИТВАНИЯ */}
            {adminTab === 'inquiries' && (
               <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-6">
                  <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3"><MessageSquare style={{ color: settings.primaryColor }}/> Потребителски запитвания</h2>
                  {inquiries.length === 0 ? <p className="text-slate-500 text-center py-12">Няма нови съобщения.</p> : inquiries.map(inq => (
                     <div key={inq.id} className="bg-black/40 border border-white/5 p-6 rounded-[2rem] space-y-4 animate-in fade-in duration-300">
                        <div className="flex justify-between items-start">
                           <div><h4 className="text-white font-bold text-lg">{inq.name}</h4><p className="text-slate-500 text-xs">{inq.email} • {inq.date}</p></div>
                           <button onClick={()=>{
                              const updated = inquiries.filter(x=>x.id !== inq.id);
                              setInquiries(updated);
                              localStorage.setItem('savedInquiries', JSON.stringify(updated));
                           }} className="text-red-900 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                        </div>
                        <div className="text-slate-300 text-sm bg-white/5 p-4 rounded-xl leading-relaxed">{inq.message}</div>
                     </div>
                  ))}
               </div>
            )}

            {/* ⚙️ ТАБ НАСТРОЙКИ */}
            {adminTab === 'settings' && (
               <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-12 text-white">
                  <section><h2 className="text-xl font-black mb-6 flex items-center gap-3"><HardDrive style={{ color: settings.primaryColor }}/> Поддръжка</h2><div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex justify-center"><button onClick={handleResetCatalog} className="flex items-center gap-2 px-6 py-3 bg-red-900/20 text-red-500 border border-red-900 hover:bg-red-600 hover:text-white rounded-xl font-bold transition-all"><RotateCcw size={18}/> Нулиране на каталога</button></div></section>
                  <section className="pt-8 border-t border-white/5"><h2 className="text-xl font-black mb-6 flex items-center gap-3"><Globe style={{ color: settings.primaryColor }}/> Идентичност</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="space-y-4"><label className="text-slate-400 text-xs font-bold uppercase block">Име на сайта</label><div className="flex gap-2"><input value={settings.siteName} onChange={e => updateSettings({ siteName: e.target.value })} className="flex-1 bg-black/40 border border-white/5 p-4 rounded-2xl outline-none" /><button onClick={() => updateSettings({ useLogo: !settings.useLogo })} className={`p-4 rounded-2xl border ${settings.useLogo ? 'bg-white text-black' : 'border-white/10'}`}>{settings.useLogo ? <ImageIcon size={20}/> : <Type size={20}/>}</button></div></div><div className="space-y-4"><label className="text-slate-400 text-xs font-bold uppercase block">Лого</label><label className="flex items-center justify-center p-4 bg-black/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors"><UploadCloud size={20} className="mr-2"/> Избери файл<input type="file" className="hidden" accept="image/*" onChange={(e)=>{const f=e.target.files[0]; const r=new FileReader(); r.onloadend=()=>updateSettings({logoUrl: r.result, useLogo: true}); r.readAsDataURL(f);}} /></label></div></div></section>
                  <section className="pt-8 border-t border-white/5"><h2 className="text-xl font-black mb-6 flex items-center gap-3"><Palette style={{ color: settings.primaryColor }}/> Цвят</h2><div className="flex flex-wrap gap-4 items-center">{['#DC2626', '#2563EB', '#7C3AED', '#059669', '#F59E0B', '#EC4899'].map(c => (<button key={c} onClick={() => updateSettings({ primaryColor: c })} className={`w-12 h-12 rounded-full border-4 ${settings.primaryColor === c ? 'border-white' : 'border-transparent'}`} style={{backgroundColor: c}}/>))}<div className="flex items-center gap-3 bg-black/40 p-2 rounded-2xl border border-white/5"><span className="text-xs font-bold px-2 text-slate-500">CUSTOM:</span><input type="color" value={settings.primaryColor} onChange={e => updateSettings({ primaryColor: e.target.value })} className="w-8 h-8 bg-transparent cursor-pointer" /></div></div></section>
                  <section className="pt-8 border-t border-white/5"><h2 className="text-xl font-black mb-6 flex items-center gap-3"><Sparkles style={{ color: settings.primaryColor }}/> Ефекти</h2><div className="grid grid-cols-3 md:grid-cols-5 gap-4">{[ { id: 'none', label: 'None', icon: X }, { id: 'snow', label: 'Зима', icon: Snowflake }, { id: 'rain', label: 'Есен', icon: CloudRain }, { id: 'sakura', label: 'Пролет', icon: Flower }, { id: 'fireflies', label: 'Лято', icon: Sparkles } ].map(ef => (<button key={ef.id} onClick={() => updateSettings({ visualEffect: ef.id })} className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${settings.visualEffect === ef.id ? 'bg-white text-black' : 'bg-black/40 border-white/5 text-slate-500'}`}><ef.icon size={20} className="mb-2" /><span className="text-[9px] font-black uppercase tracking-widest">{ef.label}</span></button>)) }</div></section>
               </div>
            )}

            {/* 📝 ТАБ ТЕКСТОВЕ (CMS) */}
            {adminTab === 'texts' && (
              <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-10 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex justify-between items-center"><h2 className="text-2xl font-black flex items-center gap-3"><Type style={{ color: settings.primaryColor }}/> Управление на текстовете</h2><button onClick={handleResetTexts} className="p-2 text-slate-500 hover:text-red-500 transition-colors" title="Нулиране на текстове"><RotateCcw size={18}/></button></div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="space-y-6">
                       <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-2">Главна страница</h3>
                       <TextInput label="Заглавие" field="homeTitle" />
                       <TextInput label="Подзаглавие" field="homeSubtitle" />
                       <TextInput label="Търсачка" field="searchPlaceholder" />
                    </section>
                    <section className="space-y-6">
                       <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-2">Плейър & Карти</h3>
                       <TextInput label="Badge Стрийминг" field="videoBadgeStream" />
                       <TextInput label="Badge Изтегляне" field="videoBadgeDownload" />
                       <TextInput label="Live Badge" field="playerLiveBadge" />
                    </section>
                 </div>
                 <section className="space-y-6 pt-6 border-t border-slate-800">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-2">Вход & Footer</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <TextInput label="Заглавие Вход" field="loginTitle" />
                       <TextInput label="Текст Footer" field="footerDescription" />
                    </div>
                 </section>
              </div>
            )}

            {/* 📊 ТАБ ЛОГОВЕ */}
            {adminTab === 'logs' && (
               <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl h-[600px] overflow-hidden flex flex-col text-white">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><Activity style={{ color: settings.primaryColor }}/> Системна активност</h2>
                  <div className="flex-1 overflow-y-auto pr-4 space-y-2 custom-scrollbar">
                     {activityLog.length === 0 ? <p className="text-slate-500 text-center py-12 text-sm uppercase font-bold tracking-widest">Няма записи в лога.</p> : activityLog.map(l => (
                        <div key={l.id} className="p-4 bg-black/40 border-l-4 rounded-xl flex justify-between items-center transition-all hover:bg-black/60" style={{ borderLeftColor: l.type === 'error' ? 'red' : (l.type === 'success' ? '#22c55e' : settings.primaryColor) }}>
                           <span className="text-xs font-medium text-slate-200">{String(l.msg)}</span>
                           <span className="text-[10px] text-slate-600 font-mono font-bold">{l.date}</span>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div className="bg-[#050505] min-h-screen text-slate-300 selection:bg-red-600 selection:text-white overflow-x-hidden font-sans">
      <VisualEffectLayer type={settings.visualEffect} />
      
      {activeVideo && activeVideo.streamType === 'embed' && <EmbedPlayer video={activeVideo} onClose={() => setActiveVideo(null)} settings={settings} onStatUpdate={handleStatUpdate} />}
      {activeVideo && activeVideo.streamType === 'download' && <DownloadModal video={activeVideo} onClose={() => setActiveVideo(null)} settings={settings} />}

      <Navbar />

      <main className="animate-in fade-in duration-700">
        {view === 'home' && <HomeView />}
        {view === 'collections' && <CollectionsView />}
        {view === 'contact' && <ContactView />}
        {view === 'login' && (
           <div className="pt-40 flex justify-center px-6">
              <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/10 w-full max-w-md shadow-2xl text-center animate-in zoom-in duration-300">
                 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10"><ShieldAlert size={40} style={{ color: settings.primaryColor }}/></div>
                 <h2 className="text-3xl font-black text-white mb-8 tracking-widest uppercase">{settings.texts.loginTitle}</h2>
                 <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" required placeholder={settings.texts.loginEmailPlaceholder} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}} value={loginForm.email} onChange={e=>setLoginForm({...loginForm, email: e.target.value})}/>
                    <input type="password" required placeholder={settings.texts.loginPasswordPlaceholder} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}} value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password: e.target.value})}/>
                    <button className="w-full py-5 text-black bg-white font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl">{settings.texts.loginButton}</button>
                 </form>
              </div>
           </div>
        )}
        {view === 'admin' && <AdminPanel />}
      </main>

      <footer className="py-24 border-t border-white/5 px-6 mt-32 bg-black/20">
         <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-xs">
               <h3 className="text-3xl font-black text-white tracking-tighter mb-4">{settings.siteName}</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">{settings.texts.footerDescription}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 uppercase tracking-widest font-black text-[10px] text-slate-500">
               <div className="space-y-4">
                  <h4 className="text-white">Платформа</h4>
                  <div className="flex flex-col gap-3 font-bold">
                     <button onClick={()=>{setView('home'); window.location.hash='';}} className="hover:text-white text-left">Каталог</button>
                     <button onClick={()=>{setView('collections'); window.location.hash='#/collections';}} className="hover:text-white text-left">Колекции</button>
                  </div>
               </div>
               <div className="space-y-4">
                  <h4 className="text-white">Поддръжка</h4>
                  <div className="flex flex-col gap-3 font-bold">
                     <button onClick={()=>{setView('contact'); window.location.hash='#/contact';}} className="hover:text-white text-left">Помощ</button>
                     <button onClick={()=>{setView('contact'); window.location.hash='#/contact';}} className="hover:text-white text-left">DMCA</button>
                  </div>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
