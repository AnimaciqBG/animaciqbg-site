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
  Radio, RefreshCw, Sparkles, Type, RotateCcw, Layout
} from 'lucide-react';

/**
 * ANIMATIONBG - ВЕРСИЯ 9.2 (FULL CONTENT CMS)
 * * Промени:
 * - Пълна система за управление на текстовете (CMS) чрез Admin Panel.
 * - Всички стрингове в сайта вече са динамични и редактируеми.
 * - Нов таб "Текстове" в настройките, организиран по секции.
 * - Real-time преглед и запис в localStorage.
 * - Опция за Factory Reset само на текстовете.
 */

const DEFAULT_VIDEOS = [
  {
    id: '1',
    title: 'Пепеляшка (БГ Аудио) - Класика',
    thumbnail: 'https://images.unsplash.com/photo-1580136608260-42d1c4aa0153?q=80&w=1000&auto=format&fit=crop',
    magnetLink: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel', 
    duration: '1:15:00',
    year: 1950,
    views: 4500,
    likes: 320,
    description: 'Класическата история за Пепеляшка, озвучена на български език. Магия, тикви и изгубена пантофка.',
    tags: ['Classic', 'Family'],
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  }
];

const DEFAULT_TEXTS = {
  homeTitle: 'Български дублирани анимации',
  homeSubtitle: 'P2P Стрийминг технология. Гледай веднага.',
  searchPlaceholder: 'Търсене...',
  footerDescription: 'P2P Стрийминг Платформа © 2026',
  videoBadge: 'HD Stream',
  loginTitle: 'АДМИН ПАНЕЛ',
  loginEmailPlaceholder: 'Имейл',
  loginPasswordPlaceholder: 'Парола',
  loginButton: 'ВХОД',
  adminTabCatalog: 'Каталог',
  adminTabSettings: 'Настройки',
  adminTabTexts: 'Текстове',
  adminTabLogs: 'Логове',
  playerLiveBadge: 'СТРИЙМ НА ЖИВО',
  playerLoading: 'Свързване с P2P...',
  playerPeers: 'Peers',
  playerBuffered: 'Buffered'
};

const MOCK_ADMIN = { id: 'a1', name: 'Администратор', role: 'admin' };

const loadWebTorrentGlobal = (callback) => {
  if (window.WebTorrent) return callback();
  if (document.getElementById('webtorrent-script')) {
    const checkInterval = setInterval(() => {
      if (window.WebTorrent) {
        clearInterval(checkInterval);
        callback();
      }
    }, 100);
    return;
  }
  const script = document.createElement('script');
  script.id = 'webtorrent-script';
  script.src = "https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js";
  script.onload = callback;
  document.head.appendChild(script);
};

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

// --- ТОРЕНТ ПЛЕЙЪР ---
const TorrentPlayer = memo(({ video, onClose, settings }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({ loading: true, peers: 0, progress: 0, speed: 0, error: null, ready: false });
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const isMounted = useRef(true);

  const formatTime = (t) => {
    if (isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    isMounted.current = true;
    let client = null;
    const startTorrent = () => {
      try {
        if (!window.WebTorrent) return;
        client = new window.WebTorrent();
        client.add(video.magnetLink, (torrent) => {
          if (!isMounted.current) { client.destroy(); return; }
          const file = torrent.files.find(f => f.name.endsWith('.mp4') || f.name.endsWith('.mkv') || f.name.endsWith('.webm'));
          if (file && videoRef.current) {
            file.renderTo(videoRef.current, { autoplay: false, muted: false }, (err) => {
              if (!err && isMounted.current && videoRef.current) videoRef.current.play().catch(() => {});
            });
          }
          torrent.on('download', () => {
            if (isMounted.current) {
              setStatus(prev => ({
                ...prev, loading: false, peers: torrent.numPeers, progress: Math.round(torrent.progress * 100),
                speed: Math.round(torrent.downloadSpeed / 1024 / 1024 * 100) / 100, error: null
              }));
            }
          });
        });
        client.on('error', (err) => isMounted.current && setStatus(s => ({ ...s, error: err.message })));
      } catch (e) { isMounted.current && setStatus(s => ({ ...s, error: "Грешка при стрийминг" })); }
    };
    loadWebTorrentGlobal(startTorrent);
    return () => { isMounted.current = false; if (client) client.destroy(); };
  }, [video]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
    else { videoRef.current.pause(); setPlaying(false); }
  };

  const watermarkPosClasses = {
    'top-right': 'top-20 right-8', 'top-left': 'top-20 left-8', 'bottom-right': 'bottom-24 right-8', 'bottom-left': 'bottom-24 left-8'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-sans select-none"
         onMouseMove={() => setShowControls(true)} onContextMenu={(e) => e.preventDefault()}>
      
      {settings.watermarkEnabled && (
        <div className={`absolute ${watermarkPosClasses[settings.watermarkPosition] || 'top-20 right-8'} z-[70] pointer-events-none select-none`}
             style={{ opacity: settings.watermarkOpacity / 100 }}>
          <span className="text-white font-black text-2xl uppercase tracking-widest drop-shadow-lg">{settings.watermarkText}</span>
        </div>
      )}

      <div className={`absolute top-0 left-0 right-0 p-6 z-[60] flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div>
          <h2 className="text-white text-2xl font-bold flex items-center gap-2">{video.title} <span className="text-red-500 text-xs bg-red-500/10 px-2 py-0.5 rounded uppercase">{settings.texts.playerLiveBadge}</span></h2>
          <div className="flex gap-4 text-gray-400 text-xs mt-2 uppercase tracking-tighter font-bold">
             <span className="flex items-center gap-1 text-green-400"><Radio size={12}/> {status.peers} {settings.texts.playerPeers}</span>
             <span className="flex items-center gap-1"><Download size={12}/> {status.speed} MB/s</span>
             <span className="flex items-center gap-1 text-white">{settings.texts.playerBuffered}: {status.progress}%</span>
          </div>
        </div>
        <button onClick={onClose} className="p-3 bg-white/10 hover:bg-red-600 rounded-full text-white transition-all"><X size={24}/></button>
      </div>

      <div className="w-full h-full relative flex items-center justify-center">
        {status.loading && !status.error && (
          <div className="flex flex-col items-center gap-4 text-white z-10">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: settings.primaryColor, borderTopColor: 'transparent' }}></div>
            <p className="text-sm font-bold animate-pulse">{settings.texts.playerLoading}</p>
          </div>
        )}
        <video 
          ref={videoRef} className="w-full h-full object-contain"
          onCanPlay={() => setStatus(s => ({ ...s, ready: true }))}
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
          onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
          onClick={togglePlay}
        />
      </div>

      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent px-8 py-8 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-full h-1.5 bg-white/20 rounded-full mb-6 relative group/progress">
             <div className="h-full rounded-full transition-all" style={{ width: `${(currentTime / (duration || 1)) * 100}%`, backgroundColor: settings.primaryColor }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-lg" />
             </div>
             <input type="range" min="0" max={duration || 1} step="0.01" value={currentTime} onChange={(e) => videoRef.current.currentTime = e.target.value} className="absolute inset-0 w-full opacity-0 cursor-pointer" />
          </div>
          <div className="flex justify-between items-center text-white">
             <div className="flex items-center gap-6">
                <button onClick={togglePlay} className="transition-colors scale-110" style={{ color: settings.primaryColor }}>{playing ? <Pause size={28}/> : <Play size={28}/>}</button>
                <div className="flex items-center gap-3 group/vol">
                   <Volume2 size={24}/>
                   <div className="w-24 h-1 bg-gray-700 rounded-full relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full" style={{ width: `${volume * 100}%`, backgroundColor: settings.primaryColor }} />
                      <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => { setVolume(e.target.value); if(videoRef.current) videoRef.current.volume = e.target.value; }} className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                   </div>
                </div>
                <span className="text-sm font-mono font-bold tracking-widest">{formatTime(currentTime)} / {formatTime(duration)}</span>
             </div>
             <button onClick={() => videoRef.current?.requestFullscreen()} className="hover:text-white"><Maximize size={24}/></button>
          </div>
      </div>
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
      // Осигуряваме, че новите текстови полета ще присъстват дори при стари настройки
      setSettings({ ...settings, ...parsed, texts: { ...DEFAULT_TEXTS, ...parsed.texts } });
    }
    const handleHash = () => {
      if (window.location.hash === '#/admin-secret-login-2026' && !currentUser) setView('login');
      else if (window.location.hash.includes('admin') && currentUser) setView('admin');
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
      addLog(`Добавен торент: ${data.title}`, "success");
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
    if (window.confirm("⚠️ СИГУРНИ ЛИ СТЕ? Това ще възстанови оригиналните текстове на сайта.")) {
      updateSettings({ texts: DEFAULT_TEXTS });
      addLog("Текстовете бяха нулирани до оригиналните", "warning");
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => updateSettings({ logoUrl: reader.result, useLogo: true });
    reader.readAsDataURL(file);
  };

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
         <button onClick={() => { window.location.hash = ''; setView('home'); }} className="flex items-center gap-3">
            {settings.useLogo && settings.logoUrl ? (
               <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
            ) : (
               <span className="text-2xl font-black text-white tracking-tighter">
                  <span style={{ color: settings.primaryColor }}>{settings.siteName.slice(0, -2)}</span>{settings.siteName.slice(-2)}
               </span>
            )}
         </button>
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

  const AdminPanel = () => {
    const [form, setForm] = useState({ title: '', year: '', magnetLink: '', thumbnail: '', description: '' });

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
      <div className="pt-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
         <div className="md:w-64 shrink-0 space-y-2">
            {[
              { id: 'dashboard', label: settings.texts.adminTabCatalog, icon: Film },
              { id: 'settings', label: settings.texts.adminTabSettings, icon: Palette },
              { id: 'texts', label: settings.texts.adminTabTexts, icon: Type },
              { id: 'logs', label: settings.texts.adminTabLogs, icon: Activity }
            ].map(tab => (
               <button key={tab.id} onClick={() => setAdminTab(tab.id)} className={`w-full text-left p-4 rounded-xl font-bold transition-all flex items-center gap-3 ${adminTab === tab.id ? 'text-white' : 'text-slate-500 hover:bg-slate-800'}`} style={adminTab === tab.id ? { backgroundColor: settings.primaryColor } : {}}>
                  <tab.icon size={18}/> {tab.label}
               </button>
            ))}
         </div>

         <div className="flex-1 pb-20">
            {adminTab === 'dashboard' && (
              <div className="space-y-10">
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3"><Plus style={{ color: settings.primaryColor }}/> Добави анимация</h2>
                    <form onSubmit={e => { e.preventDefault(); handleAddVideo(form); setForm({ title: '', year: '', magnetLink: '', thumbnail: '', description: '' }); }} className="grid grid-cols-2 gap-6">
                       <input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Заглавие" className="col-span-2 bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:ring-1" style={{ '--tw-ring-color': settings.primaryColor }}/>
                       <input required value={form.year} onChange={e=>setForm({...form, year: e.target.value})} placeholder="Година" className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none"/>
                       <input required value={form.thumbnail} onChange={e=>setForm({...form, thumbnail: e.target.value})} placeholder="Thumbnail URL" className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none"/>
                       <textarea required value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Описание..." className="col-span-2 bg-slate-950 border border-slate-800 p-4 rounded-xl text-white h-32 outline-none"/>
                       <input required value={form.magnetLink} onChange={e=>setForm({...form, magnetLink: e.target.value})} placeholder="magnet:?xt=urn:..." className="col-span-2 bg-slate-900 border border-slate-800 p-4 rounded-xl text-white outline-none font-mono text-xs"/>
                       <button className="col-span-2 text-white font-black py-4 rounded-xl hover:brightness-110 transition-all" style={{ backgroundColor: settings.primaryColor }}>ПУБЛИКУВАЙ</button>
                    </form>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-3">
                    {videos.map(v => (
                      <div key={v.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 group hover:border-slate-600 transition-colors">
                         <div className="flex items-center gap-4"><img src={v.thumbnail} className="w-10 h-14 object-cover rounded" alt=""/><div className="text-white font-bold">{v.title}</div></div>
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
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black flex items-center gap-3"><Type style={{ color: settings.primaryColor }}/> Управление на съдържанието</h2>
                    <button onClick={handleResetTexts} className="p-2 text-slate-500 hover:text-red-500 transition-colors" title="Нулиране на текстове"><RotateCcw size={18}/></button>
                 </div>

                 {/* HomePage Section */}
                 <section className="space-y-6">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] border-b border-slate-800 pb-2 flex items-center gap-2"><Home size={14}/> Главна страница</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <TextInput label="Главно заглавие" field="homeTitle" />
                       <TextInput label="Подзаглавие" field="homeSubtitle" />
                       <TextInput label="Search placeholder" field="searchPlaceholder" />
                       <TextInput label="Video Badge (напр. HD)" field="videoBadge" />
                    </div>
                 </section>

                 {/* Video Player Section */}
                 <section className="space-y-6 pt-6">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] border-b border-slate-800 pb-2 flex items-center gap-2"><Video size={14}/> Видео плейър</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <TextInput label="Live Badge текст" field="playerLiveBadge" />
                       <TextInput label="Loading текст" field="playerLoading" />
                       <TextInput label="Етикет Peers" field="playerPeers" />
                       <TextInput label="Етикет Buffered" field="playerBuffered" />
                    </div>
                 </section>

                 {/* Login Section */}
                 <section className="space-y-6 pt-6">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] border-b border-slate-800 pb-2 flex items-center gap-2"><Lock size={14}/> Вход (Admin Login)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <TextInput label="Заглавие на формата" field="loginTitle" />
                       <TextInput label="Текст на бутона" field="loginButton" />
                       <TextInput label="Placeholder Имейл" field="loginEmailPlaceholder" />
                       <TextInput label="Placeholder Парола" field="loginPasswordPlaceholder" />
                    </div>
                 </section>

                 {/* Admin Tabs Section */}
                 <section className="space-y-6 pt-6">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] border-b border-slate-800 pb-2 flex items-center gap-2"><Layout size={14}/> Админ панел (Меню)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <TextInput label="Таб Каталог" field="adminTabCatalog" />
                       <TextInput label="Таб Настройки" field="adminTabSettings" />
                       <TextInput label="Таб Логове" field="adminTabLogs" />
                       <TextInput label="Таб Текстове" field="adminTabTexts" />
                    </div>
                 </section>

                 {/* Footer Section */}
                 <section className="space-y-6 pt-6">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] border-b border-slate-800 pb-2 flex items-center gap-2"><ImageIcon size={14}/> Footer</h3>
                    <TextInput label="Описание / Copyright текст" field="footerDescription" />
                 </section>
              </div>
            )}

            {adminTab === 'logs' && (
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl h-[600px] overflow-hidden flex flex-col text-white">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><Activity style={{ color: settings.primaryColor }}/> Системни логове</h2>
                  <div className="flex-1 overflow-y-auto pr-4 space-y-2">
                     {activityLog.map(l => (
                        <div key={l.id} className="p-3 bg-slate-950 border-l-4 rounded flex justify-between items-center" style={{ borderLeftColor: settings.primaryColor }}>
                           <span className="text-xs font-medium">{String(l.msg)}</span><span className="text-[10px] text-slate-600 font-mono">{l.date}</span>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 selection:bg-red-600 selection:text-white" onContextMenu={e=>e.preventDefault()}>
      <VisualEffectLayer type={settings.visualEffect} />
      {activeVideo && <TorrentPlayer video={activeVideo} onClose={() => setActiveVideo(null)} settings={settings} />}
      <Navbar />
      <main>
        {view === 'home' && (
           <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
              <div className="mb-12">
                 <h1 className="text-4xl font-black text-white mb-2">{settings.texts.homeTitle}</h1>
                 <p className="text-slate-500 text-lg">{settings.texts.homeSubtitle}</p>
              </div>
              <div className="mb-10 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/>
                 <input 
                   value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                   placeholder={settings.texts.searchPlaceholder} 
                   className="w-full bg-slate-900 border border-slate-800 p-5 pl-14 rounded-2xl text-white focus:ring-1 outline-none transition-all shadow-xl"
                   style={{ '--tw-ring-color': settings.primaryColor }}
                 />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {videos.filter(v=>v.title.toLowerCase().includes(searchQuery.toLowerCase())).map(v => (
                  <div key={v.id} onClick={() => setActiveVideo(v)} className="bg-slate-900 rounded-2xl overflow-hidden cursor-pointer hover:ring-2 transition-all group transform hover:-translate-y-2" style={{ '--tw-ring-color': settings.primaryColor }}>
                     <div className="aspect-[3/4] relative">
                        <img src={v.thumbnail} className="w-full h-full object-cover" alt={v.title}/>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                           <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform" style={{ backgroundColor: settings.primaryColor }}>
                              <Play fill="white" className="text-white ml-1" size={32}/>
                           </div>
                        </div>
                        <div className="absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter" style={{ backgroundColor: settings.primaryColor }}>{settings.texts.videoBadge}</div>
                     </div>
                     <div className="p-5"><h3 className="font-bold text-white text-lg truncate mb-1">{v.title}</h3><div className="flex justify-between items-center text-xs text-slate-500"><span>{v.year}</span><span className="flex items-center gap-1"><Eye size={14}/> {v.views}</span></div></div>
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
      </main>
      <footer className="py-20 border-t border-slate-900 px-6 mt-20">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div>
               <h3 className="text-2xl font-black text-white tracking-tighter mb-2">{settings.useLogo && settings.logoUrl ? <img src={settings.logoUrl} className="h-6" alt="Footer Logo" /> : settings.siteName}</h3>
               <p className="text-slate-600 text-sm">{settings.texts.footerDescription}</p>
            </div>
         </div>
      </footer>
    </div>
  );
}
