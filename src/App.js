import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
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
 * ANIMATIONBG - ВЕРСИЯ 13.4 (CLEAN PRODUCTION BUILD)
 * ФИКСОВЕ:
 * 1. Премахнати всички невалидни символи (❌, ✅), причиняващи грешки при build.
 * 2. Пълна имплементация на всички административни модули.
 * 3. Оптимизирана стабилност на Search Bar и Player.
 */

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

// --- SEARCH BAR (MEMOIZED) ---
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
  const trendingVideos = useMemo(() => {
    return [...videos]
      .filter(v => (v.views || 0) > 0)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10);
  }, [videos]);

  const displayVideos = trendingVideos.length > 0 ? trendingVideos : [...videos].slice(0, 5);
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
          <div key={v.id} onClick={() => onVideoClick(v)} className="group relative flex-shrink-0 w-[300px] md:w-[450px] aspect-video rounded-[2.5rem] overflow-hidden cursor-pointer snap-start transition-all duration-500 hover:scale-[1.03] shadow-2xl ring-1 ring-white/10">
            <img src={v.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={v.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-white font-black text-sm">
               🔥 {(v.views || 0).toLocaleString()} <span className="text-[10px] opacity-60">ГЛЕДАНИЯ</span>
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-white/10">{v.year}</span>
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
    'top-right': 'top-24 right-10', 'top-left': 'top-24 left-10', 'bottom-right': 'bottom-28 right-10', 'bottom-left': 'bottom-28 left-10'
  };
  useEffect(() => { onStatUpdate(video.id, 'views'); }, [video.id, onStatUpdate]); 
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {settings.watermarkEnabled && (
        <div className={`absolute ${watermarkPosClasses[settings.watermarkPosition] || 'top-24 right-10'} z-[70] pointer-events-none select-none`}
             style={{ opacity: settings.watermarkOpacity / 100 }}>
          <span className="text-white font-black text-2xl uppercase tracking-[0.2em] drop-shadow-2xl">{settings.watermarkText}</span>
        </div>
      )}
      <button onClick={onClose} className="absolute top-6 right-6 z-[80] p-4 bg-white/10 hover:bg-red-600 rounded-full text-white transition-all backdrop-blur-md"><X size={28}/></button>
      <div className="absolute top-0 left-0 right-0 p-10 z-[70] bg-gradient-to-b from-black/95 via-black/40 to-transparent pointer-events-none">
        <h2 className="text-white text-3xl font-black flex items-center gap-4">
          {video.title} 
          <span className="text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black" style={{ backgroundColor: settings.primaryColor }}>{settings.texts.playerLiveBadge}</span>
        </h2>
      </div>
      <iframe src={video.embedUrl} className="w-full h-full border-0" allowFullScreen allow="autoplay; fullscreen" title={video.title}/>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 backdrop-blur-2xl border border-white/10 p-3 px-8 rounded-full z-[80] opacity-0 hover:opacity-100 transition-all duration-300 transform translate-y-2 hover:translate-y-0">
         <button onClick={() => onStatUpdate(video.id, 'likes')} className="flex items-center gap-2 text-white hover:text-green-400 font-bold"><ThumbsUp size={20}/> {video.likes || 0}</button>
         <div className="w-px h-6 bg-white/20"/>
         <button onClick={() => onStatUpdate(video.id, 'dislikes')} className="flex items-center gap-2 text-white hover:text-red-500 font-bold"><ThumbsDown size={20}/> {video.dislikes || 0}</button>
      </div>
    </div>
  );
});

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
           <button onClick={() => setView('home')} className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Начало</button>
           <button onClick={() => setView('collections')} className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Колекции</button>
           <button onClick={() => setView('contact')} className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Контакти</button>
         </div>
       </div>
       <div className="flex items-center gap-4">
         {currentUser && (
            <div className="flex items-center gap-3 bg-white/5 p-1 rounded-full border border-white/10">
               <button onClick={() => { setAdminTab('dashboard'); setView('admin'); }} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"><Settings size={20}/></button>
               <button onClick={onLogout} className="p-3 bg-red-600 rounded-full text-white shadow-lg shadow-red-600/20"><LogOut size={20}/></button>
            </div>
         )}
       </div>
    </div>
  </nav>
));

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
    siteName: 'AnimationBG', logoUrl: '', useLogo: false, primaryColor: '#DC2626',
    visualEffect: 'none', watermarkEnabled: true, watermarkText: 'ANIMATIONBG STREAM',
    watermarkPosition: 'top-right', watermarkOpacity: 20, texts: DEFAULT_TEXTS
  });

  useEffect(() => {
    if (localStorage.getItem('adminSession') === 'true') setCurrentUser(MOCK_ADMIN);
    const savedVideos = localStorage.getItem('savedVideos');
    setVideos(savedVideos ? JSON.parse(savedVideos) : DEFAULT_VIDEOS);
    const savedInquiries = localStorage.getItem('savedInquiries');
    if (savedInquiries) setInquiries(JSON.parse(savedInquiries));
    const savedCollections = localStorage.getItem('savedCollections');
    if (savedCollections) setCollections(JSON.parse(savedCollections));
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    const handleHash = () => {
      const h = window.location.hash;
      if (h === '#/admin-secret-login-2026' && !currentUser) setView('login');
      else if (h.includes('admin') && currentUser) setView('admin');
      else if (h === '#/contact') setView('contact');
      else if (h === '#/collections') setView('collections');
      else if (!h) { setView('home'); setActiveCollection(null); }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentUser]);

  useEffect(() => { localStorage.setItem('savedVideos', JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem('savedInquiries', JSON.stringify(inquiries)); }, [inquiries]);
  useEffect(() => { localStorage.setItem('savedCollections', JSON.stringify(collections)); }, [collections]);

  const addLog = useCallback((msg, type='info') => {
    setActivityLog(prev => [{id: Date.now(), msg: String(msg), type, date: new Date().toLocaleTimeString()}, ...prev]);
  }, []);

  const handleStatUpdate = useCallback((id, field) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, [field]: (v[field] || 0) + 1 } : v));
  }, []);

  const handleAddVideo = useCallback((data) => {
    const newVideo = { ...data, id: Date.now().toString(), views: 0, likes: 0, dislikes: 0 };
    setVideos(prev => [newVideo, ...prev]);
    addLog(`Добавен: ${data.title}`, "success");
    alert("Добавен успешно!");
  }, [addLog]);

  const handleEditVideo = useCallback((id, data) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
    setEditingVideoId(null);
    addLog(`Обновен: ${data.title}`, "success");
    alert("Запазено!");
  }, [addLog]);

  const onLogout = useCallback(() => {
    localStorage.removeItem('adminSession'); setCurrentUser(null); setView('home'); window.location.hash = '';
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-slate-300 overflow-x-hidden font-sans">
      <GlobalStyles />
      <VisualEffectLayer type={settings.visualEffect} />
      
      {activeVideo && activeVideo.streamType === 'embed' && (
        <EmbedPlayer video={activeVideo} onClose={() => setActiveVideo(null)} settings={settings} onStatUpdate={handleStatUpdate} />
      )}

      {activeVideo && activeVideo.streamType === 'download' && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[3rem] overflow-hidden">
              <div className="relative aspect-video">
                 <img src={activeVideo.thumbnail} className="w-full h-full object-cover opacity-50" alt=""/>
                 <button onClick={()=>setActiveVideo(null)} className="absolute top-6 right-6 p-2 bg-black/40 rounded-full text-white"><X/></button>
                 <div className="absolute bottom-6 left-8"><h2 className="text-4xl font-black text-white">{activeVideo.title}</h2></div>
              </div>
              <div className="p-10 text-center"><a href={activeVideo.downloadUrl} target="_blank" rel="noreferrer" className="block w-full text-white font-black py-6 rounded-2xl bg-green-600">ИЗТЕГЛИ СЕГА</a></div>
           </div>
        </div>
      )}

      <Navbar currentUser={currentUser} settings={settings} setView={setView} setAdminTab={setAdminTab} onLogout={onLogout} />

      <main className="animate-in fade-in duration-700">
        {view === 'home' && (
          <div className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto min-h-screen">
            <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">{activeCollection ? activeCollection.title : settings.texts.homeTitle}</h1>
            <p className="text-slate-400 text-xl font-medium mb-12">{activeCollection ? activeCollection.description : settings.texts.homeSubtitle}</p>
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={settings.texts.searchPlaceholder} primaryColor={settings.primaryColor} />
            {!searchQuery && !activeCollection && <TrendingSection videos={videos} onVideoClick={setActiveVideo} settings={settings} />}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {videos.filter(v => (activeCollection ? activeCollection.videoIds.includes(v.id) : true) && v.title.toLowerCase().includes(searchQuery.toLowerCase())).map(v => (
                <div key={v.id} onClick={() => setActiveVideo(v)} className="group relative aspect-[2/3] bg-slate-900 rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl transition-all hover:scale-[1.05] ring-1 ring-white/5">
                   <img src={v.thumbnail} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={v.title}/>
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60"/>
                   <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit mb-3 text-[10px] font-black uppercase tracking-widest">{v.streamType === 'download' ? 'ИЗТЕГЛЯНЕ' : 'СТРИЙМ'}</div>
                      <h3 className="font-black text-white text-xl line-clamp-2">{v.title}</h3>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-tighter"><span>{v.year}</span><span>{v.views || 0} views</span></div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'collections' && (
          <div className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto min-h-screen">
            <h1 className="text-5xl font-black text-white mb-12 flex items-center gap-6"><Layers size={48} style={{ color: settings.primaryColor }}/> Колекции</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {collections.map(col => (
                 <div key={col.id} onClick={() => { setActiveCollection(col); setView('home'); }} className="group relative bg-slate-900 aspect-video rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl ring-1 ring-white/10 hover:ring-white/30 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10"/>
                    <div className="absolute bottom-8 left-10 right-10 z-20"><h3 className="text-3xl font-black text-white mb-2">{col.title}</h3><p className="text-slate-400 text-sm font-medium line-clamp-1">{col.description}</p></div>
                 </div>
              ))}
            </div>
          </div>
        )}

        {view === 'contact' && (
          <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto min-h-screen">
             <h1 className="text-5xl font-black text-white text-center mb-12 flex items-center justify-center gap-4"><MessageSquare size={48} style={{ color: settings.primaryColor }}/> Контакти</h1>
             <form className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-6">
                <input required placeholder="Име" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}}/>
                <textarea required placeholder="Съобщение..." rows={6} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none resize-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}}/>
                <button type="submit" className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">ИЗПРАТИ</button>
             </form>
          </div>
        )}

        {view === 'login' && (
           <div className="pt-40 flex justify-center px-6">
              <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/10 w-full max-w-md shadow-2xl text-center">
                 <h2 className="text-3xl font-black text-white mb-8 tracking-widest uppercase tracking-[0.2em]">{settings.texts.loginTitle}</h2>
                 <form onSubmit={(e)=>{ e.preventDefault(); if(loginForm.email === 'admin@animaciqbg.net' && loginForm.password === 'admin123'){ setCurrentUser(MOCK_ADMIN); localStorage.setItem('adminSession', 'true'); setView('admin'); addLog("Вход", "success"); } else alert("Грешка!"); }} className="space-y-4">
                    <input type="email" required placeholder="Имейл" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none" value={loginForm.email} onChange={e=>setLoginForm({...loginForm, email: e.target.value})}/>
                    <input type="password" required placeholder="Парола" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none" value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password: e.target.value})}/>
                    <button className="w-full py-5 text-black bg-white font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">ВХОД</button>
                 </form>
              </div>
           </div>
        )}

        {view === 'admin' && currentUser && (
          <div className="pt-32 px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-10">
            <div className="lg:w-72 shrink-0 flex flex-col gap-2">
               {['dashboard', 'collections', 'inquiries', 'settings', 'texts', 'logs'].map(id => (
                  <button key={id} onClick={() => setAdminTab(id)} className={`w-full text-left p-5 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all ${adminTab === id ? 'text-white' : 'text-slate-500 hover:bg-white/5'}`} style={adminTab === id ? { backgroundColor: settings.primaryColor } : {}}>
                     {id.toUpperCase()}
                  </button>
               ))}
            </div>

            <div className="flex-1 pb-20">
               {adminTab === 'dashboard' && (
                  <div className="space-y-10">
                     <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                        <h2 className="text-2xl font-black text-white mb-8">{editingVideoId ? "Редактиране" : "Добавяне"}</h2>
                        <form onSubmit={e => {
                           e.preventDefault(); const d = new FormData(e.target);
                           const vData = { title: d.get('title'), year: d.get('year'), streamType: d.get('type'), embedUrl: d.get('embed'), downloadUrl: d.get('download'), thumbnail: d.get('thumb'), description: d.get('desc') };
                           if (editingVideoId) handleEditVideo(editingVideoId, vData); else handleAddVideo(vData);
                           e.target.reset();
                        }} className="grid grid-cols-2 gap-6">
                           <input name="title" required defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.title : ""} placeholder="Заглавие" className="col-span-2 bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:ring-1" style={{'--tw-ring-color': settings.primaryColor}}/>
                           <input name="year" required defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.year : ""} placeholder="Година" className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                           <input name="thumb" required defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.thumbnail : ""} placeholder="Thumbnail URL" className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                           <select name="type" className="col-span-2 bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none">
                              <option value="embed">Стрийминг</option><option value="download">Изтегляне</option>
                           </select>
                           <input name="embed" placeholder="Embed URL" className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                           <input name="download" placeholder="Download URL" className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none"/>
                           <button type="submit" className="col-span-2 py-5 text-white font-black rounded-2xl uppercase tracking-widest shadow-2xl" style={{ backgroundColor: settings.primaryColor }}>ЗАПАЗИ</button>
                        </form>
                     </div>
                     <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-4">
                        {videos.map(v => (
                           <div key={v.id} className="flex items-center justify-between p-4 rounded-2xl border bg-black/40 border-white/5 transition-all hover:border-white/20">
                              <div className="flex items-center gap-4"><img src={v.thumbnail} className="w-10 h-14 object-cover rounded-lg" alt=""/><div className="text-white font-bold">{v.title}</div></div>
                              <div className="flex items-center gap-2"><button onClick={() => { setEditingVideoId(v.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 text-slate-400 hover:text-white"><Edit size={20}/></button><button onClick={() => { if(window.confirm("Изтриване?")) { setVideos(prev=>prev.filter(x=>x.id!==v.id)); addLog("Изтрит", "warning"); } }} className="p-3 text-slate-500 hover:text-red-500"><Trash2 size={20}/></button></div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {adminTab === 'settings' && (
                  <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-12 text-white">
                     <section className="space-y-8">
                       <h2 className="text-xl font-black mb-6 flex items-center gap-3"><Zap style={{ color: settings.primaryColor }}/> Синхронизация</h2>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <button onClick={() => { const blob = new Blob([JSON.stringify({ version: "13.4", videos, collections, inquiries, settings }, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `backup.json`; link.click(); }} className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-green-600"><Download size={32}/><span className="font-black">ЕКСПОРТ</span></button>
                          <label className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-blue-600 cursor-pointer"><input type="file" accept=".json" className="hidden" onChange={(e) => { const file = e.target.files[0]; if(!file) return; const reader = new FileReader(); reader.onload = (ev) => { try { const data = JSON.parse(ev.target.result); if(window.confirm("Замяна?")) { setVideos(data.videos); setSettings(data.settings); setCollections(data.collections || []); setInquiries(data.inquiries || []); window.location.reload(); } } catch { alert("Грешка!"); } }; reader.readAsText(file); }} /><FileUp size={32}/><span className="font-black">ИМПОРТ</span></label>
                       </div>
                     </section>
                  </div>
               )}

               {adminTab === 'collections' && (
                  <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                     <h2 className="text-2xl font-black text-white">Колекции</h2>
                     <form onSubmit={e => { e.preventDefault(); const d = new FormData(e.target); const sel = Array.from(e.target.vids.selectedOptions).map(o => o.value); const newCol = { id: Date.now(), title: d.get('title'), description: d.get('desc'), videoIds: sel }; setCollections([...collections, newCol]); e.target.reset(); }} className="space-y-6">
                        <input name="title" required placeholder="Заглавие" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none"/>
                        <select name="vids" multiple className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white h-48 outline-none">
                           {videos.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                        </select>
                        <button type="submit" className="w-full py-5 text-white font-black rounded-2xl uppercase tracking-widest" style={{ backgroundColor: settings.primaryColor }}>СЪЗДАЙ</button>
                     </form>
                  </div>
               )}

               {adminTab === 'inquiries' && (
                  <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-6">
                     <h2 className="text-2xl font-black text-white mb-6">Запитвания</h2>
                     {inquiries.length === 0 ? <p className="text-slate-500">Няма съобщения.</p> : inquiries.map(inq => (
                        <div key={inq.id} className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                           <div className="flex justify-between">
                              <div><h4 className="text-white font-bold">{inq.name}</h4><p className="text-slate-500 text-xs">{inq.email}</p></div>
                              <button onClick={()=>setInquiries(prev=>prev.filter(x=>x.id!==inq.id))} className="text-red-900 hover:text-red-500"><Trash2 size={18}/></button>
                           </div>
                           <div className="text-slate-300 text-sm mt-4">{inq.message}</div>
                        </div>
                     ))}
                  </div>
               )}

               {adminTab === 'texts' && (
                  <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-10 text-white">
                      <div className="flex justify-between items-center"><h2 className="text-2xl font-black flex items-center gap-3"><Type style={{ color: settings.primaryColor }}/> Текстове</h2></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {Object.keys(settings.texts).map(key => (
                            <div key={key} className="space-y-2">
                               <label className="text-[10px] uppercase font-black text-slate-500">{key}</label>
                               <input value={settings.texts[key]} onChange={e => { const nt = {...settings.texts, [key]: e.target.value}; setSettings(prev=>({...prev, texts: nt})); }} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm outline-none"/>
                            </div>
                         ))}
                      </div>
                  </div>
               )}

               {adminTab === 'logs' && (
                  <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl h-[600px] overflow-hidden flex flex-col text-white">
                     <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><Activity style={{ color: settings.primaryColor }}/> Логове</h2>
                     <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                        {activityLog.map(l => (
                           <div key={l.id} className="p-4 bg-black/40 border-l-4 rounded-xl flex justify-between items-center" style={{ borderLeftColor: l.type === 'error' ? 'red' : settings.primaryColor }}><span className="text-xs">{l.msg}</span><span className="text-[10px] text-slate-600">{l.date}</span></div>
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
        <div className="mt-8 text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">AnimationBG Platform v13.4</div>
      </footer>
    </div>
  );
}
