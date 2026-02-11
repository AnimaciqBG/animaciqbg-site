import React, { useState, useEffect, useCallback, memo } from 'react';
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
  ExternalLink, FileDown, Layers, Info, FileUp, Zap
} from 'lucide-react';

/**
 * ANIMATIONBG - ВЕРСИЯ 13.3 (STORAGE FIX)
 * ФИКС: localStorage sync ВЕДНАГА след всяка промяна
 * - Директен localStorage.setItem() във всички handlers
 * - Премахнат проблемен useEffect
 * - Cross-device sync чрез Export/Import
 */

// --- КОНСТАНТИ ---
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

// --- ГЛОБАЛНИ СТИЛОВЕ ---
const GlobalStyles = () => (
  <style>{`
    @keyframes fall { 0% { transform: translateY(-10vh); opacity: 0.8; } 100% { transform: translateY(110vh); opacity: 0; } }
    @keyframes rain { 0% { transform: translateY(-10vh); opacity: 0.5; } 100% { transform: translateY(110vh); opacity: 0; } }
    @keyframes sway { 0% { transform: translateY(-10vh) translateX(0) rotate(0); opacity: 0.8; } 100% { transform: translateY(110vh) translateX(20px) rotate(360deg); opacity: 0; } }
    @keyframes glow { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5) translate(10px, -10px); } }
    .animate-fall { animation: fall linear infinite; }
    .animate-rain { animation: rain linear infinite; }
    .animate-sway { animation: sway linear infinite; }
    .animate-glow { animation: glow ease-in-out infinite; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

// --- VISUAL EFFECTS ---
const VisualEffectLayer = memo(({ type }) => {
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
});

// --- SEARCH BAR ---
const SearchBar = memo(({ value, onChange, placeholder, primaryColor }) => (
  <div className="mb-12 relative max-w-xl">
    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24}/>
    <input 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder} 
      className="w-full bg-white/5 border border-white/10 p-6 pl-16 rounded-[2rem] text-white focus:ring-2 outline-none transition-all text-lg backdrop-blur-xl" 
      style={{ '--tw-ring-color': primaryColor }}
    />
  </div>
));

// --- TRENDING SECTION ---
const TrendingSection = memo(({ videos, onVideoClick, settings }) => {
  const trendingVideos = [...videos]
    .filter(v => (v.views || 0) > 0)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  const displayVideos = trendingVideos.length > 0 
    ? trendingVideos 
    : [...videos].slice(0, 5);

  if (displayVideos.length < 1) return null;

  return (
    <div className="mb-20 animate-in fade-in slide-in-from-left duration-1000">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-4xl font-black text-red-600 uppercase tracking-tighter flex items-center gap-3">
          <Zap fill="currentColor" /> НАЙ-ГЛЕДАНИ
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-red-600/50 to-transparent" />
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
        {displayVideos.map((v) => (
          <div 
            key={v.id} 
            onClick={() => onVideoClick(v)}
            className="group relative flex-shrink-0 w-[300px] md:w-[450px] aspect-video rounded-[2.5rem] overflow-hidden cursor-pointer snap-start transition-all duration-500 hover:scale-[1.03] shadow-2xl ring-1 ring-white/10"
          >
            <img src={v.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={v.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            
            <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-white font-black text-sm">
               🔥 {(v.views || 0).toLocaleString()} <span className="text-[10px] opacity-60">ГЛЕДАНИЯ</span>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-white/10">
                  {v.year}
                </span>
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Premium Stream</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white line-clamp-1 drop-shadow-2xl">{v.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// --- EMBED PLAYER ---
const EmbedPlayer = memo(({ video, onClose, settings, onStatUpdate }) => {
  const watermarkPosClasses = {
    'top-right': 'top-24 right-10', 
    'top-left': 'top-24 left-10', 
    'bottom-right': 'bottom-28 right-10', 
    'bottom-left': 'bottom-28 left-10'
  };

  useEffect(() => { 
    onStatUpdate(video.id, 'views'); 
  }, [video.id, onStatUpdate]); 

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {settings.watermarkEnabled && (
        <div className={`absolute ${watermarkPosClasses[settings.watermarkPosition] || watermarkPosClasses['top-right']} z-[70] pointer-events-none select-none`}
             style={{ opacity: settings.watermarkOpacity / 100 }}>
          <span className="text-white font-black text-2xl uppercase tracking-[0.2em] drop-shadow-2xl">{settings.watermarkText}</span>
        </div>
      )}

      <button onClick={onClose} className="absolute top-6 right-6 z-[80] p-4 bg-white/10 hover:bg-red-600 rounded-full text-white transition-all backdrop-blur-md">
        <X size={28}/>
      </button>

      <div className="absolute top-0 left-0 right-0 p-10 z-[70] bg-gradient-to-b from-black/95 via-black/40 to-transparent pointer-events-none">
        <h2 className="text-white text-3xl font-black flex items-center gap-4">
          {video.title} 
          <span className="text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black" style={{ backgroundColor: settings.primaryColor }}>
            {settings.texts.playerLiveBadge}
          </span>
        </h2>
      </div>

      <iframe src={video.embedUrl} className="w-full h-full border-0" allowFullScreen allow="autoplay; fullscreen" title={video.title}/>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 backdrop-blur-2xl border border-white/10 p-3 px-8 rounded-full z-[80] opacity-0 hover:opacity-100 transition-all duration-300 transform translate-y-2 hover:translate-y-0 shadow-2xl">
         <button onClick={() => { onStatUpdate(video.id, 'likes'); }} className="flex items-center gap-2 text-white hover:text-green-400 transition-colors font-bold">
            <ThumbsUp size={20}/> {video.likes || 0}
         </button>
         <div className="w-px h-6 bg-white/20"/>
         <button onClick={() => { onStatUpdate(video.id, 'dislikes'); }} className="flex items-center gap-2 text-white hover:text-red-500 transition-colors font-bold">
            <ThumbsDown size={20}/> {video.dislikes || 0}
         </button>
      </div>
    </div>
  );
});

// --- DOWNLOAD MODAL ---
const DownloadModal = memo(({ video, onClose, settings }) => (
  <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
      <div className="relative aspect-video">
        <img src={video.thumbnail} className="w-full h-full object-cover opacity-50" alt=""/>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"/>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-red-600 rounded-full text-white transition-all"><X size={24}/></button>
        <div className="absolute bottom-6 left-8 right-8">
          <h2 className="text-4xl font-black text-white drop-shadow-2xl">{video.title}</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">{video.year} • {settings.texts.videoBadgeDownload}</p>
        </div>
      </div>
      <div className="p-10 text-center space-y-8">
         <p className="text-slate-400 font-medium">Този филм е наличен за изтегляне през нашия външен сървър.</p>
         <a href={video.downloadUrl} target="_blank" rel="noreferrer" className="block w-full text-white font-black py-6 rounded-[1.5rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-xl uppercase tracking-wider" style={{ backgroundColor: '#22c55e' }}>ИЗТЕГЛИ СЕГА <ExternalLink size={24}/></a>
      </div>
    </div>
  </div>
));

// --- NAVBAR ---
const Navbar = memo(({ currentUser, settings, setView, setAdminTab, onLogout }) => (
  <nav className="fixed top-0 left-0 right-0 z-[90] bg-black/60 backdrop-blur-2xl border-b border-white/5">
    <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
       <div className="flex items-center gap-12">
         <button onClick={() => { window.location.hash = ''; setView('home'); }} className="flex items-center gap-3">
            {settings.useLogo && settings.logoUrl ? (
               <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
               <span className="text-3xl font-black text-white tracking-tighter hover:scale-105 transition-transform">
                  <span style={{ color: settings.primaryColor }}>{settings.siteName.slice(0, -2)}</span>{settings.siteName.slice(-2)}
               </span>
            )}
         </button>
         <div className="hidden lg:flex items-center gap-8">
           <button onClick={() => { window.location.hash = ''; setView('home'); }} className="text-sm font-bold uppercase tracking-widest transition-colors text-slate-500 hover:text-white">Начало</button>
           <button onClick={() => { window.location.hash = '#/collections'; setView('collections'); }} className="text-sm font-bold uppercase tracking-widest transition-colors text-slate-500 hover:text-white">Колекции</button>
           <button onClick={() => { window.location.hash = '#/contact'; setView('contact'); }} className="text-sm font-bold uppercase tracking-widest transition-colors text-slate-500 hover:text-white">Контакти</button>
         </div>
       </div>
       <div className="flex items-center gap-4">
         {currentUser && (
            <div className="flex items-center gap-3 bg-white/5 p-1 rounded-full border border-white/10">
               <button onClick={() => { window.location.hash = '#/admin-panel'; setAdminTab('dashboard'); setView('admin'); }} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"><Settings size={20}/></button>
               <button onClick={onLogout} className="p-3 bg-red-600 rounded-full text-white shadow-lg shadow-red-600/20"><LogOut size={20}/></button>
            </div>
         )}
       </div>
    </div>
  </nav>
));

// --- VIEWS ---
const HomeView = memo(({ videos, activeCollection, searchQuery, setSearchQuery, setActiveVideo, settings }) => {
  const displayVideos = activeCollection 
    ? videos.filter(v => activeCollection.videoIds.includes(v.id))
    : videos;

  return (
    <div className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto min-h-screen">
      <div className="mb-16">
         <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">{activeCollection ? activeCollection.title : settings.texts.homeTitle}</h1>
         <p className="text-slate-400 text-xl font-medium max-w-2xl">{activeCollection ? activeCollection.description : settings.texts.homeSubtitle}</p>
      </div>

      <SearchBar 
        value={searchQuery} 
        onChange={setSearchQuery} 
        placeholder={settings.texts.searchPlaceholder} 
        primaryColor={settings.primaryColor} 
      />

      {!searchQuery && !activeCollection && (
        <TrendingSection videos={videos} onVideoClick={setActiveVideo} settings={settings} />
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {displayVideos.filter(v=>v.title.toLowerCase().includes(searchQuery.toLowerCase())).map(v => (
          <div key={v.id} onClick={() => setActiveVideo(v)} className="group relative aspect-[2/3] bg-slate-900 rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:scale-[1.05] hover:z-10 ring-1 ring-white/5 hover:ring-white/20">
             <img src={v.thumbnail} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-40" alt={v.title}/>
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
  const [editingVideoId, setEditingVideoId] = useState(null);

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

  // ANTI-INSPECT PROTECTION
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
    const consoleClear = setInterval(() => { if(!currentUser) console.clear(); }, 1000);
    return () => {
      window.removeEventListener('keydown', handleProtection);
      clearInterval(consoleClear);
    };
  }, [currentUser]);

  // INITIAL LOAD
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
      else if (!window.location.hash) { setView('home'); setActiveCollection(null); }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentUser]);

  // --- HANDLERS (ФИКСИРАН localStorage SYNC) ---
  const addLog = useCallback((msg, type='info') => {
    setActivityLog(prev => [{id: Date.now(), msg: String(msg), type, date: new Date().toLocaleTimeString()}, ...prev]);
  }, []);

  // ✅ ФИКС: handleStatUpdate със директен localStorage sync
  const handleStatUpdate = useCallback((id, field) => {
    setVideos(prev => {
      const updated = prev.map(v => {
        if (v.id === id) return { ...v, [field]: (v[field] || 0) + 1 };
        return v;
      });
      localStorage.setItem('savedVideos', JSON.stringify(updated)); // ✅ SYNC ВЕДНАГА!
      return updated;
    });
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('siteSettings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ✅ ФИКС: handleAddVideo със директен localStorage sync
  const handleAddVideo = useCallback((data) => {
    const newVideo = { ...data, id: Date.now().toString(), views: 0, likes: 0, dislikes: 0 };
    setVideos(prev => {
      const updated = [newVideo, ...prev];
      localStorage.setItem('savedVideos', JSON.stringify(updated)); // ✅ SYNC ВЕДНАГА!
      return updated;
    });
    addLog(`Добавен нов филм: ${data.title}`, "success");
    alert("✅ Успешно добавяне! Данните са запазени.");
  }, [addLog]);

  // ✅ ФИКС: handleEditVideo със директен localStorage sync
  const handleEditVideo = useCallback((id, data) => {
    setVideos(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, ...data } : v);
      localStorage.setItem('savedVideos', JSON.stringify(updated)); // ✅ SYNC ВЕДНАГА!
      return updated;
    });
    setEditingVideoId(null);
    addLog(`Обновен филм: ${data.title}`, "success");
    alert("Успешно добавяне! Данните са запазени.");
  }, [addLog]);

  // ✅ ФИКС: handleDeleteVideo със директен localStorage sync
  const handleDeleteVideo = useCallback((id) => {
    if (window.confirm("Сигурни ли сте, че искате да изтриете този филм?")) {
      setVideos(prev => {
        const filtered = prev.filter(v => v.id !== id);
        localStorage.setItem('savedVideos', JSON.stringify(filtered)); // ✅ SYNC ВЕДНАГА!
        return filtered;
      });
      addLog(`Изтрит филм с ID: ${id}`, "warning");
    }
  }, [addLog]);

  const onLogout = useCallback(() => {
    localStorage.removeItem('adminSession');
    setCurrentUser(null);
    setView('home');
    window.location.hash = '';
  }, []);

  // --- RENDERING ---
  return (
    <div className="bg-[#050505] min-h-screen text-slate-300 selection:bg-red-600 selection:text-white overflow-x-hidden font-sans">
      <GlobalStyles />
      <VisualEffectLayer type={settings.visualEffect} />
      
      {activeVideo && activeVideo.streamType === 'embed' && (
        <EmbedPlayer 
          video={activeVideo} 
          onClose={() => setActiveVideo(null)} 
          settings={settings} 
          onStatUpdate={handleStatUpdate} 
        />
      )}

      {activeVideo && activeVideo.streamType === 'download' && (
        <DownloadModal 
          video={activeVideo} 
          onClose={() => setActiveVideo(null)} 
          settings={settings} 
        />
      )}

      <Navbar 
        currentUser={currentUser} 
        settings={settings} 
        setView={setView} 
        setAdminTab={setAdminTab} 
        onLogout={onLogout} 
      />

      <main className="animate-in fade-in duration-700">
        {view === 'home' && (
          <HomeView 
            videos={videos} 
            activeCollection={activeCollection} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            setActiveVideo={setActiveVideo} 
            settings={settings} 
          />
        )}

        {view === 'collections' && (
          <div className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto min-h-screen">
            <h1 className="text-5xl font-black text-white mb-12 flex items-center gap-6"><Layers size={48} style={{ color: settings.primaryColor }}/> Филмови Колекции</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {collections.map(col => (
                 <div key={col.id} onClick={() => { setActiveCollection(col); setView('home'); }} className="group relative bg-slate-900 aspect-video rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl ring-1 ring-white/10 hover:ring-white/30 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10"/>
                    <div className="absolute bottom-8 left-10 right-10 z-20">
                       <h3 className="text-3xl font-black text-white mb-2">{col.title}</h3>
                       <p className="text-slate-400 text-sm font-medium line-clamp-1">{col.description}</p>
                       <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-[0.2em]"><Film size={14}/> {col.videoIds.length} ФИЛМА</div>
                    </div>
                 </div>
              ))}
            </div>
          </div>
        )}

        {view === 'contact' && (
          <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto min-h-screen">
             <h1 className="text-5xl font-black text-white text-center mb-12 flex items-center justify-center gap-4"><MessageSquare size={48} style={{ color: settings.primaryColor }}/> Свържи се с нас</h1>
             <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10">
               <form onSubmit={(e)=>{ e.preventDefault(); alert("Съобщението е изпратено!"); }} className="space-y-6">
                  <input required placeholder="Вашето име" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}}/>
                  <textarea required placeholder="Съобщение..." rows={6} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none resize-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}}/>
                  <button type="submit" className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">ИЗПРАТИ СЪОБЩЕНИЕ</button>
               </form>
             </div>
          </div>
        )}

        {view === 'login' && (
           <div className="pt-40 flex justify-center px-6">
              <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/10 w-full max-w-md shadow-2xl text-center">
                 <h2 className="text-3xl font-black text-white mb-8 tracking-widest uppercase">{settings.texts.loginTitle}</h2>
                 <form onSubmit={(e)=>{
                    e.preventDefault();
                    if(loginForm.email === 'admin@animaciqbg.net' && loginForm.password === 'admin123'){
                       setCurrentUser(MOCK_ADMIN);
                       localStorage.setItem('adminSession', 'true');
                       window.location.hash = '#/admin-panel';
                       setView('admin');
                       addLog("Успешен вход в административния панел", "success");
                    } else alert("Грешни данни!");
                 }} className="space-y-4">
                    <input type="email" required placeholder="Имейл" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}} value={loginForm.email} onChange={e=>setLoginForm({...loginForm, email: e.target.value})}/>
                    <input type="password" required placeholder="Парола" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}} value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password: e.target.value})}/>
                    <button className="w-full py-5 text-black bg-white font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">ВХОД</button>
                 </form>
              </div>
           </div>
        )}

        {view === 'admin' && currentUser && (
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
                  </button>
               ))}
            </div>

            <div className="flex-1 pb-20">
               {adminTab === 'dashboard' && (
                  <div className="space-y-10">
                     <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                        <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                           {editingVideoId ? <Edit style={{ color: settings.primaryColor }}/> : <Plus style={{ color: settings.primaryColor }}/>} 
                           {editingVideoId ? "Редактиране" : "Добавяне"}
                        </h2>
                        <form onSubmit={e => {
                           e.preventDefault();
                           const d = new FormData(e.target);
                           const videoData = {
                              title: d.get('title'), year: d.get('year'), streamType: d.get('type'),
                              embedUrl: d.get('embed'), downloadUrl: d.get('download'),
                              thumbnail: d.get('thumb'), description: d.get('desc')
                           };
                           if (editingVideoId) handleEditVideo(editingVideoId, videoData);
                           else handleAddVideo(videoData);
                           e.target.reset();
                        }} className="grid grid-cols-2 gap-6">
                           <input name="title" required defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.title : ""} placeholder="Заглавие" className="col-span-2 bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}}/>
                           <input name="year" required defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.year : ""} placeholder="Година" className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                           <input name="thumb" required defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.thumbnail : ""} placeholder="Thumbnail URL" className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                           <select name="type" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.streamType : "embed"} className="col-span-2 bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none">
                              <option value="embed">Стрийминг</option>
                              <option value="download">Изтегляне</option>
                           </select>
                           <input name="embed" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.embedUrl : ""} placeholder="Embed URL (напр: https://streamable.com/e/kwsdu0)" className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                           <input name="download" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.downloadUrl : ""} placeholder="Download URL" className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                           <textarea name="desc" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.description : ""} placeholder="Описание..." className="col-span-2 bg-black/40 border border-white/5 p-5 rounded-2xl text-white h-32 outline-none"/>
                           <div className="col-span-2 flex gap-4">
                              <button type="submit" className="flex-1 py-5 text-white font-black rounded-2xl uppercase tracking-widest shadow-2xl" style={{ backgroundColor: settings.primaryColor }}>
                                 {editingVideoId ? 'ЗАПАЗИ' : 'ПУБЛИКУВАЙ'}
                              </button>
                           </div>
                        </form>
                     </div>
                     <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-4">
                        <h3 className="text-white font-black uppercase text-sm mb-6">📦 ИНВЕНТАР ({videos.length} филма)</h3>
                        {videos.map(v => (
                           <div key={v.id} className="flex items-center justify-between p-4 rounded-2xl border bg-black/40 border-white/5">
                              <div className="flex items-center gap-4">
                                 <img src={v.thumbnail} className="w-10 h-14 object-cover rounded-lg shadow-lg" alt=""/>
                                 <div className="text-white font-bold">{v.title}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <button onClick={() => { setEditingVideoId(v.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 text-slate-400 hover:text-white"><Edit size={20}/></button>
                                 <button onClick={() => handleDeleteVideo(v.id)} className="p-3 text-slate-500 hover:text-red-500"><Trash2 size={20}/></button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {adminTab === 'settings' && (
                  <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-12 text-white">
                     <section className="space-y-8">
                       <h2 className="text-xl font-black mb-6 flex items-center gap-3"><Zap style={{ color: settings.primaryColor }}/> Синхронизация</h2>
                       <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                         <p className="text-blue-200 text-sm font-bold mb-2">💡 Как да синхронизираш между устройства:</p>
                         <ol className="text-blue-100 text-xs space-y-1 ml-4 list-decimal">
                           <li>Click ЕКСПОРТ на компютъра</li>
                           <li>Прехвърли .json файла на телефона (email/cloud)</li>
                           <li>Click ИМПОРТ на телефона и избери файла</li>
                           <li>Готово! Всички филми ще са на двете устройства ✅</li>
                         </ol>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <button onClick={() => {
                            const blob = new Blob([JSON.stringify({ version: "13.3", videos, collections, inquiries, settings }, null, 2)], { type: 'application/json' });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `animationbg-backup-${new Date().toISOString().split('T')[0]}.json`;
                            link.click();
                            alert('Файлът е изтеглен! Сега го прехвърли на другото устройство.');
                          }} className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-green-600 hover:bg-green-500 transition-all">
                             <Download size={32}/>
                             <span className="font-black uppercase tracking-widest">ЕКСПОРТ</span>
                             <span className="text-xs opacity-70">Изтегли данните</span>
                          </button>
                          <label className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer">
                             <input type="file" accept=".json" className="hidden" onChange={(e) => {
                                const file = e.target.files[0];
                                if(!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  try {
                                    const data = JSON.parse(ev.target.result);
                                    if(window.confirm("Замяна на данни с тези от файла?")) {
                                      setVideos(data.videos); 
                                      setCollections(data.collections || []);
                                      setInquiries(data.inquiries || []);
                                      setSettings(data.settings);
                                      localStorage.setItem('savedVideos', JSON.stringify(data.videos));
                                      localStorage.setItem('savedCollections', JSON.stringify(data.collections || []));
                                      localStorage.setItem('savedInquiries', JSON.stringify(data.inquiries || []));
                                      localStorage.setItem('siteSettings', JSON.stringify(data.settings));
                                      alert('Данните са заредени! Презареждане...');
                                      window.location.reload();
                                    }
                                  } catch { alert("Грешен файл!"); }
                                };
                                reader.readAsText(file);
                             }} />
                             <FileUp size={32}/>
                             <span className="font-black uppercase tracking-widest">ИМПОРТ</span>
                             <span className="text-xs opacity-70">Качи .json файл</span>
                          </label>
                       </div>
                     </section>
                  </div>
               )}

               {adminTab === 'logs' && (
                  <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl h-[600px] overflow-hidden flex flex-col text-white">
                     <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><Activity style={{ color: settings.primaryColor }}/> Логове</h2>
                     <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                        {activityLog.length === 0 ? (
                          <p className="text-slate-500 text-center py-12">Няма активност все още.</p>
                        ) : activityLog.map(l => (
                           <div key={l.id} className="p-4 bg-black/40 border-l-4 rounded-xl flex justify-between items-center" style={{ borderLeftColor: l.type === 'error' ? 'red' : (l.type === 'success' ? '#22c55e' : settings.primaryColor) }}>
                              <span className="text-xs">{l.msg}</span>
                              <span className="text-[10px] text-slate-600">{l.date}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-24 border-t border-white/5 px-6 mt-32 bg-black/20 text-center">
        <h3 className="text-3xl font-black text-white tracking-tighter mb-4">{settings.siteName}</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xl mx-auto">{settings.texts.footerDescription}</p>
        <div className="mt-8 text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">AnimationBG Platform v13.3 • Storage Fix</div>
      </footer>
    </div>
  );
}
```

---

## ✅ КАКВО ФИКСИХ:
```
1. ❌ ПРЕМАХНАТ проблемния useEffect (ред 440-442 в стария код)

2. ✅ handleAddVideo - localStorage.setItem ВЕДНАГА след state update

3. ✅ handleEditVideo - localStorage.setItem ВЕДНАГА след state update

4. ✅ handleDeleteVideo - localStorage.setItem ВЕДНАГА след state update

5. ✅ handleStatUpdate - localStorage.setItem ВЕДНАГА след state update

6. ✅ Import/Export с ПЪЛЕН sync на всички данни

7. ✅ Успех съобщения с ✅ emoji

8. ✅ Инструкции за синхронизация в Admin Panel
```

---

## 🎯 ТЕСТВАНЕ:
```
ТЕСТ 1: Локално запазване
1. Добави филм
2. Refresh страницата (F5)
3. Филмът Е ТАМ ✅

ТЕСТ 2: Cross-device sync
1. Desktop: Експорт → Download .json
2. Изпрати файла на телефона (email/WhatsApp)
3. Телефон: Импорт → Upload .json
4. Всички филми са на телефона ✅

