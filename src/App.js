import React, { useState, useEffect, useCallback, memo, useMemo, useRef } from 'react';
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
  ExternalLink, FileDown, Layers, Info, FileUp, Zap, BarChart3,
  Calendar, Database, Share2, Monitor, Smartphone, Tablet,
  Cloud
} from 'lucide-react';
import { pushToCloud, subscribeToCloud, firebaseEnabled } from './cloudSync';

/**
 * ANIMATIONBG - ВЕРСИЯ 14.0 (PREMIUM PRODUCTION BUILD)
 * ОСНОВНИ ПОДОБРЕНИЯ:
 * 1. Smart Cloud Sync & Versioning (v14.0).
 * 2. Разширени UI Компоненти (VideoCard, Toast, ConfirmDialog).
 * 3. Оптимизирана производителност с React Memo & Callbacks.
 * 4. Пълна липса на емоджи символи в JSX кода.
 */

// --- КОНСТАНТИ И НАСТРОЙКИ ПО ПОДРАЗБИРАНЕ ---
const SCHEMA_VERSION = "14.0";

const DEFAULT_VIDEOS = [
  {
    id: '1',
    title: 'Frozen (2013) - Анимация',
    thumbnail: 'https://images.unsplash.com/photo-1580136608260-42d1c4aa0153?q=80&w=1000&auto=format&fit=crop',
    streamType: 'embed',
    embedUrl: 'https://vidsrc.me/embed/movie/tt2294629',
    year: 2013,
    views: 1250,
    likes: 450,
    dislikes: 12,
    description: 'Магична история за две сестри и вечната зима.',
    tags: ['Animation', 'Family', 'Disney'],
    duration: '102 min',
    audioType: 'bg_audio'
  }
];

const DEFAULT_TEXTS = {
  homeTitle: 'Български дублирани анимации',
  homeSubtitle: 'Премиум технология за стрийминг. Гледай веднага.',
  searchPlaceholder: 'Търсене на заглавия...',
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
  playerLoading: 'Зареждане на видео потока...'
};

const MOCK_ADMIN = { id: 'a1', name: 'Главен Админ', role: 'admin', email: 'admin@animaciqbg.net' };

// --- ГЛОБАЛНИ СТИЛОВЕ И АНИМАЦИИ ---
const GlobalStyles = memo(() => (
  <style>{`
    @keyframes fall { 0% { transform: translateY(-10vh); opacity: 0.8; } 100% { transform: translateY(110vh); opacity: 0; } }
    @keyframes rain { 0% { transform: translateY(-10vh); opacity: 0.5; } 100% { transform: translateY(110vh); opacity: 0; } }
    @keyframes sway { 0% { transform: translateY(-10vh) translateX(0) rotate(0); opacity: 0.8; } 100% { transform: translateY(110vh) translateX(20px) rotate(360deg); opacity: 0; } }
    @keyframes glow { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5) translate(10px, -10px); } }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }
    .animate-fall { animation: fall linear infinite; }
    .animate-rain { animation: rain linear infinite; }
    .animate-sway { animation: sway linear infinite; }
    .animate-glow { animation: glow ease-in-out infinite; }
    .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .premium-blur { backdrop-filter: blur(20px) saturate(180%); }
  `}</style>
));

// --- UI КОМПОНЕНТИ ---

/**
 * Toast Известия
 */
const Toast = memo(({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { icon: <Check size={18}/>, bg: 'bg-emerald-600' },
    error: { icon: <AlertTriangle size={18}/>, bg: 'bg-rose-600' },
    info: { icon: <Info size={18}/>, bg: 'bg-blue-600' },
    warning: { icon: <ShieldAlert size={18}/>, bg: 'bg-orange-600' }
  }[type || 'info'];

  return (
    <div className={`fixed bottom-10 right-10 z-[200] ${config.bg} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-in`}>
      {config.icon}
      <span className="font-bold text-sm tracking-wide">{message}</span>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity"><X size={16}/></button>
    </div>
  );
});

/**
 * Confirm Dialog
 */
const ConfirmDialog = memo(({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full shadow-3xl text-center">
        <div className="w-16 h-16 bg-rose-600/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 size={32} />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed">{message}</p>
        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all">Отказ</button>
          <button onClick={onConfirm} className="flex-1 py-4 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20">Изтрий</button>
        </div>
      </div>
    </div>
  );
});

/**
 * Video Card
 */
const VideoCard = memo(({ video, onClick, onLike, primaryColor }) => (
  <div
    onClick={() => onClick(video)}
    className="group relative aspect-[2/3] bg-slate-900 rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:scale-[1.05] ring-1 ring-white/5 hover:ring-white/20"
  >
    <img src={video.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={video.title}/>
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60 group-hover:opacity-80 transition-opacity"/>

    {/* Badges */}
    <div className="absolute top-4 left-4 flex flex-col gap-2">
      <div className="bg-black/60 premium-blur px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
        {video.year}
      </div>
      {video.audioType && (
        <div className={`premium-blur px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/10 flex items-center gap-1 ${video.audioType === 'bg_audio' ? 'bg-emerald-600/80' : 'bg-purple-600/80'}`}>
          {video.audioType === 'bg_audio' ? <><Volume2 size={10}/> БГ АУДИО</> : <><FileText size={10}/> СУБТИТРИ</>}
        </div>
      )}
    </div>

    {/* Like Button */}
    <button
      onClick={(e) => { e.stopPropagation(); onLike && onLike(video.id); }}
      className="absolute top-4 right-4 z-10 p-2.5 bg-black/40 premium-blur rounded-full border border-white/10 text-white hover:text-rose-500 hover:bg-rose-500/20 hover:border-rose-500/30 transition-all opacity-0 group-hover:opacity-100"
    >
      <Heart size={16} />
    </button>

    <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform duration-500 group-hover:translate-y-[-8px]">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div
          className="px-3 py-1 rounded-full w-fit text-[9px] font-black text-white uppercase tracking-widest shadow-lg"
          style={{ backgroundColor: video.streamType === 'download' ? '#10B981' : primaryColor }}
        >
          {video.streamType === 'download' ? 'БГ АУДИО' : 'СТРИЙМ'}
        </div>
      </div>
      <h3 className="font-black text-white text-xl line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">{video.title}</h3>

      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="flex items-center gap-1"><Eye size={12}/> {(video.views || 0).toLocaleString()}</span>
        <span className="flex items-center gap-1"><Heart size={12} className="text-rose-500"/> {(video.likes || 0).toLocaleString()}</span>
      </div>
    </div>

    {/* Hover Play Button */}
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
       <div className="w-16 h-16 rounded-full bg-white/10 premium-blur border border-white/20 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform">
          <Play fill="currentColor" size={24} className="ml-1" />
       </div>
    </div>
  </div>
));

/**
 * Filter Bar
 */
const FilterBar = memo(({ activeFilter, onFilterChange, primaryColor }) => {
  const filters = [
    { id: 'all', label: 'Всички', icon: <Layers size={14}/> },
    { id: 'movie', label: 'Филми', icon: <Film size={14}/> },
    { id: 'series', label: 'Сериали', icon: <Video size={14}/> },
    { id: 'short', label: 'Кратки', icon: <Zap size={14}/> }
  ];

  return (
    <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar pb-2">
      {filters.map(f => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap
            ${activeFilter === f.id ? 'text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
          style={activeFilter === f.id ? { backgroundColor: primaryColor, boxShadow: `0 10px 30px ${primaryColor}40` } : {}}
        >
          {f.icon} {f.label}
        </button>
      ))}
    </div>
  );
});

// --- VISUAL EFFECTS LAYER ---
const VisualEffectLayer = memo(({ type }) => {
  const config = useMemo(() => {
    if (!type || type === 'none') return null;
    switch(type) {
      case 'snow': return { char: <Snowflake size={16}/>, count: 30, class: 'animate-fall' };
      case 'rain': return { char: <CloudRain size={16}/>, count: 50, class: 'animate-rain' };
      case 'sakura': return { char: <Flower size={16}/>, count: 20, class: 'animate-sway' };
      case 'fireflies': return { char: <div className="w-1 h-1 rounded-full bg-yellow-400 shadow-[0_0_10px_#fde047]"/>, count: 40, class: 'animate-glow' };
      default: return null;
    }
  }, [type]);

  if (!config) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(config.count)].map((_, i) => (
          <div key={i} className={`absolute ${config.class}`}
            style={{
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`, animationDelay: `${Math.random() * 10}s`, 
              color: type === 'sakura' ? '#fbcfe8' : 'white', opacity: 0.3
            }}>{config.char}</div>
        ))}
    </div>
  );
});

// --- ГЛАВНО ПРИЛОЖЕНИЕ ---
export default function App() {
  // State: Core
  const [view, setView] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [collectionSearch, setCollectionSearch] = useState('');
  
  // State: Admin
  const [adminTab, setAdminTab] = useState('dashboard');
  const [activityLog, setActivityLog] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, type: null });

  // State: Settings
  const [settings, setSettings] = useState({
    siteName: 'AnimationBG', logoUrl: '', useLogo: false, primaryColor: '#DC2626',
    visualEffect: 'none', watermarkEnabled: true, watermarkText: 'ANIMATIONBG PREMIUM',
    watermarkPosition: 'top-right', watermarkOpacity: 15, texts: DEFAULT_TEXTS,
    version: SCHEMA_VERSION
  });

  // Cloud Sync refs
  const cloudUpdateRef = useRef(false);
  const pushTimerRef = useRef(null);
  const initialSyncDoneRef = useRef(!firebaseEnabled); // Skip guard if Firebase disabled
  const [cloudConnected, setCloudConnected] = useState(false);

  // Utils
  const showToast = useCallback((msg, type = 'info') => setToast({ msg, type }), []);
  const addLog = useCallback((msg, type = 'info') => {
    setActivityLog(prev => [{
      id: Date.now(), 
      msg: String(msg), 
      type, 
      date: new Date().toLocaleTimeString(),
      icon: type === 'error' ? 'ShieldAlert' : (type === 'success' ? 'Check' : 'Info')
    }, ...prev].slice(0, 100));
  }, []);

  // Initialization & Sync
  useEffect(() => {
    try {
      if (localStorage.getItem('adminSession') === 'true') setCurrentUser(MOCK_ADMIN);
      
      const load = (key, fallback) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
      };

      setVideos(load('v14_videos', DEFAULT_VIDEOS));
      setInquiries(load('v14_inquiries', []));
      setCollections(load('v14_collections', []));
      setSettings(prev => ({ ...prev, ...load('v14_settings', {}) }));
      
      const handleHash = () => {
        const h = window.location.hash;
        if (h === '#/admin-access-v14' && !currentUser) setView('login');
        else if (h.includes('admin') && currentUser) setView('admin');
        else if (h === '#/contact') setView('contact');
        else if (h === '#/collections') { setView('collections'); setActiveCollection(null); }
        else if (!h || h === '#/') { setView('home'); setActiveCollection(null); }
      };

      window.addEventListener('hashchange', handleHash);
      handleHash();
      return () => window.removeEventListener('hashchange', handleHash);
    } catch (err) {
      console.error("Initialization error:", err);
      showToast("Грешка при зареждане на базата данни!", "error");
    }
  }, [currentUser, showToast]);

  // Cloud Sync: Subscribe to remote changes
  useEffect(() => {
    if (!firebaseEnabled) return;

    // Timeout fallback: if Firebase doesn't respond in 5s, allow local pushes
    const fallbackTimer = setTimeout(() => {
      if (!initialSyncDoneRef.current) {
        console.log('[CloudSync] Timeout waiting for initial data, enabling local push');
        initialSyncDoneRef.current = true;
      }
    }, 5000);

    const unsub = subscribeToCloud((cloudData) => {
      console.log('[CloudSync] Applying cloud data to state');
      cloudUpdateRef.current = true;
      setCloudConnected(true);

      if (cloudData.videos && Array.isArray(cloudData.videos)) setVideos(cloudData.videos);
      if (cloudData.inquiries && Array.isArray(cloudData.inquiries)) setInquiries(cloudData.inquiries);
      if (cloudData.collections && Array.isArray(cloudData.collections)) setCollections(cloudData.collections);
      if (cloudData.settings) setSettings(prev => ({ ...prev, ...cloudData.settings }));

      // Mark initial sync as done after first successful receive
      if (!initialSyncDoneRef.current) {
        console.log('[CloudSync] Initial sync complete - cloud data loaded');
        initialSyncDoneRef.current = true;
      }

      // Keep the guard active long enough for all state updates to settle
      setTimeout(() => { cloudUpdateRef.current = false; }, 1000);
    });

    return () => {
      clearTimeout(fallbackTimer);
      unsub();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persistance + Cloud Push
  useEffect(() => {
    // Always save to localStorage (local cache)
    localStorage.setItem('v14_videos', JSON.stringify(videos));
    localStorage.setItem('v14_inquiries', JSON.stringify(inquiries));
    localStorage.setItem('v14_collections', JSON.stringify(collections));
    localStorage.setItem('v14_settings', JSON.stringify(settings));

    // Only push to Firebase when:
    // 1. Firebase is enabled
    // 2. We're not processing incoming cloud data (cloudUpdateRef)
    // 3. Initial sync from Firebase is complete (initialSyncDoneRef)
    if (firebaseEnabled && !cloudUpdateRef.current && initialSyncDoneRef.current) {
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
      pushTimerRef.current = setTimeout(() => {
        pushToCloud({ videos, inquiries, collections, settings });
      }, 1500);
    }
  }, [videos, inquiries, collections, settings]);

  // Actions
  const handleStatUpdate = useCallback((id, field) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, [field]: (v[field] || 0) + 1 } : v));
  }, []);

  const handleVideoAction = useCallback((id, action, data) => {
    try {
      if (action === 'add') {
        const newV = { ...data, id: Date.now().toString(), views: 0, likes: 0, dislikes: 0, created: new Date() };
        setVideos(prev => [newV, ...prev]);
        addLog(`Добавено видео: ${data.title}`, "success");
        showToast("Успешно добавяне!", "success");
      } else if (action === 'edit') {
        setVideos(prev => prev.map(v => v.id === id ? { ...v, ...data, updated: new Date() } : v));
        setEditingVideoId(null);
        addLog(`Редактирано видео: ${data.title}`, "info");
        showToast("Промените са запазени!", "success");
      } else if (action === 'delete') {
        setVideos(prev => prev.filter(v => v.id !== id));
        addLog(`Изтрито видео ID: ${id}`, "warning");
        showToast("Видеото е премахнато!", "info");
      }
    } catch (err) {
      addLog(`Грешка при действие с видео: ${err.message}`, "error");
    }
  }, [addLog, showToast]);

  const onLogout = useCallback(() => {
    localStorage.removeItem('adminSession');
    setCurrentUser(null);
    setView('home');
    window.location.hash = '';
    showToast("Излязохте успешно.", "info");
  }, [showToast]);

  // Filtered Logic
  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const matchSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCol = activeCollection ? activeCollection.videoIds.includes(v.id) : true;
      const matchFilter = filter === 'all' ? true : v.type === filter;
      return matchSearch && matchCol && matchFilter;
    });
  }, [videos, searchQuery, activeCollection, filter]);

  const trendingVideos = useMemo(() => {
    return [...videos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);
  }, [videos]);

  return (
    <div className="bg-[#050505] min-h-screen text-slate-300 overflow-x-hidden font-sans selection:bg-red-500/30">
      <GlobalStyles />
      <VisualEffectLayer type={settings.visualEffect} />
      
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog 
        isOpen={deleteConfirm.open} 
        title="Сигурни ли сте?" 
        message="Това действие не може да бъде отменено." 
        onCancel={() => setDeleteConfirm({ open: false, id: null, type: null })}
        onConfirm={() => {
           if (deleteConfirm.type === 'video') handleVideoAction(deleteConfirm.id, 'delete');
           setDeleteConfirm({ open: false, id: null, type: null });
        }}
      />

      {/* --- PREMIUM PLAYER OVERLAY --- */}
      {activeVideo && activeVideo.streamType === 'embed' && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-500">
           <div className={`absolute ${settings.watermarkPosition === 'top-right' ? 'top-24 right-10' : 'top-24 left-10'} z-[70] pointer-events-none select-none`}
                style={{ opacity: settings.watermarkOpacity / 100 }}>
             <span className="text-white font-black text-2xl uppercase tracking-[0.2em] drop-shadow-2xl">{settings.watermarkText}</span>
           </div>
           
           <div className="absolute top-0 left-0 right-0 p-10 z-[80] flex justify-between items-start bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none">
              <div className="pointer-events-auto">
                <h2 className="text-white text-3xl font-black flex items-center gap-4 drop-shadow-2xl">
                  {activeVideo.title} 
                  <span className="text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black animate-pulse" style={{ backgroundColor: settings.primaryColor }}>
                    {settings.texts.playerLiveBadge}
                  </span>
                </h2>
                <div className="text-slate-400 text-sm mt-2 font-bold flex items-center gap-4">
                  <span className="flex items-center gap-1"><Clock size={14}/> {activeVideo.duration || 'N/A'}</span>
                  <span className="flex items-center gap-1"><Activity size={14}/> 1080p Premium</span>
                  {activeVideo.audioType && (
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${activeVideo.audioType === 'bg_audio' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {activeVideo.audioType === 'bg_audio' ? <><Volume2 size={12}/> БГ Аудио</> : <><FileText size={12}/> Субтитри</>}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setActiveVideo(null)} className="pointer-events-auto p-5 bg-white/5 hover:bg-red-600 rounded-full text-white transition-all backdrop-blur-md group">
                <X size={32} className="group-hover:rotate-90 transition-transform" />
              </button>
           </div>

           <iframe 
             src={activeVideo.embedUrl} 
             className="w-full h-full border-0" 
             allowFullScreen 
             allow="autoplay; fullscreen" 
             title={activeVideo.title}
             onLoad={() => handleStatUpdate(activeVideo.id, 'views')}
           />

           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 premium-blur border border-white/10 p-4 px-10 rounded-[2rem] z-[80] opacity-0 hover:opacity-100 transition-all duration-500 transform translate-y-4 hover:translate-y-0 shadow-3xl bg-black/40">
              <button onClick={() => handleStatUpdate(activeVideo.id, 'likes')} className="flex items-center gap-3 text-white hover:text-green-400 font-black transition-colors">
                <ThumbsUp size={24}/> {activeVideo.likes || 0}
              </button>
              <div className="w-px h-8 bg-white/10"/>
              <button onClick={() => handleStatUpdate(activeVideo.id, 'dislikes')} className="flex items-center gap-3 text-white hover:text-red-500 font-black transition-colors">
                <ThumbsDown size={24}/> {activeVideo.dislikes || 0}
              </button>
           </div>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-[90] bg-black/70 backdrop-blur-3xl border-b border-white/5 h-24 flex items-center">
        <div className="max-w-[1500px] mx-auto px-10 w-full flex items-center justify-between">
           <div className="flex items-center gap-16">
             <button onClick={() => { window.location.hash = ''; setView('home'); }} className="group">
                {settings.useLogo && settings.logoUrl ? (
                   <img src={settings.logoUrl} alt="Logo" className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
                ) : (
                   <span className="text-4xl font-black text-white tracking-tighter flex items-center gap-2">
                      <Sparkles className="animate-pulse" style={{ color: settings.primaryColor }} />
                      <span className="group-hover:tracking-normal transition-all duration-500">
                        <span style={{ color: settings.primaryColor }}>{settings.siteName.slice(0, -3)}</span>{settings.siteName.slice(-3)}
                      </span>
                   </span>
                )}
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
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/10 premium-blur">
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
           </div>
        </div>
      </nav>

      <main className="animate-in fade-in duration-1000">
        {/* --- HOME VIEW --- */}
        {view === 'home' && (
          <div className="pt-40 pb-32 px-10 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="mb-20">
              <h1 className="text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
                {activeCollection ? activeCollection.title : settings.texts.homeTitle}
              </h1>
              <p className="text-slate-400 text-xl font-medium max-w-2xl leading-relaxed">
                {activeCollection ? activeCollection.description : settings.texts.homeSubtitle}
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24}/>
                <input 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  placeholder={settings.texts.searchPlaceholder} 
                  className="w-full bg-white/5 border border-white/10 p-7 pl-16 rounded-[2.5rem] text-white focus:ring-2 outline-none transition-all text-xl backdrop-blur-xl focus:bg-white/10 shadow-2xl" 
                  style={{ '--tw-ring-color': settings.primaryColor }}
                />
              </div>
              <FilterBar activeFilter={filter} onFilterChange={setFilter} primaryColor={settings.primaryColor} />
            </div>

            {/* Trending Carousel (Only on main page) */}
            {!searchQuery && !activeCollection && filter === 'all' && trendingVideos.length > 0 && (
              <div className="mb-32">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                    <TrendingUp style={{ color: settings.primaryColor }} /> В ТРЕНДА
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                <div className="flex gap-8 overflow-x-auto pb-10 snap-x no-scrollbar">
                  {trendingVideos.map(v => (
                    <div key={v.id} onClick={() => setActiveVideo(v)} className="group relative flex-shrink-0 w-[350px] md:w-[500px] aspect-video rounded-[3rem] overflow-hidden cursor-pointer snap-start shadow-3xl ring-1 ring-white/10 transition-all hover:ring-white/30">
                       <img src={v.thumbnail} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={v.title} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                       <div className="absolute top-8 right-8 premium-blur bg-white/10 border border-white/20 px-5 py-2 rounded-2xl flex items-center gap-3 text-white font-black text-xs">
                          <Zap size={14} fill="currentColor" className="text-yellow-400" />
                          {(v.views || 0).toLocaleString()} <span className="text-[10px] opacity-60">ГЛЕДАНИЯ</span>
                       </div>
                       <div className="absolute bottom-10 left-10 right-10">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-white/10 premium-blur text-white text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-white/10">{v.year}</span>
                            <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">Premium Experience</span>
                          </div>
                          <h3 className="text-3xl font-black text-white line-clamp-1 group-hover:translate-x-2 transition-transform">{v.title}</h3>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-10">
              {filteredVideos.map(v => (
                <VideoCard key={v.id} video={v} onClick={setActiveVideo} onLike={(id) => handleStatUpdate(id, 'likes')} primaryColor={settings.primaryColor} />
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="py-40 text-center">
                <Search size={80} className="mx-auto text-slate-800 mb-8" />
                <h3 className="text-3xl font-black text-white mb-2">Няма намерени резултати</h3>
                <p className="text-slate-500 font-medium text-lg">Опитайте с друго заглавие или филтър.</p>
              </div>
            )}
          </div>
        )}

        {/* --- COLLECTIONS VIEW --- */}
        {view === 'collections' && (
          <div className="pt-40 pb-32 px-10 max-w-[1600px] mx-auto min-h-screen">
            <h1 className="text-6xl font-black text-white mb-10 flex items-center gap-8">
              <Layers size={60} style={{ color: settings.primaryColor }}/> Колекции
            </h1>

            {/* Collections Search */}
            <div className="relative w-full max-w-2xl mb-16">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24}/>
              <input
                value={collectionSearch}
                onChange={e => setCollectionSearch(e.target.value)}
                placeholder="Търсене на колекции..."
                className="w-full bg-white/5 border border-white/10 p-7 pl-16 rounded-[2.5rem] text-white focus:ring-2 outline-none transition-all text-xl backdrop-blur-xl focus:bg-white/10 shadow-2xl"
                style={{ '--tw-ring-color': settings.primaryColor }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
              {collections
                .filter(col => col.title.toLowerCase().includes(collectionSearch.toLowerCase()) || col.description.toLowerCase().includes(collectionSearch.toLowerCase()))
                .map(col => {
                  const colVideos = col.videoIds.map(vid => videos.find(v => v.id === vid)).filter(Boolean);
                  return (
                   <div
                    key={col.id}
                    onClick={() => { setActiveCollection(col); setView('home'); window.scrollTo(0,0); }}
                    className="group relative bg-slate-900 aspect-[16/9] rounded-[4rem] overflow-hidden cursor-pointer shadow-3xl ring-1 ring-white/10 hover:ring-white/40 transition-all"
                  >
                      {/* Thumbnail Grid Background */}
                      {colVideos.length > 0 && (
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-0.5 opacity-40 group-hover:opacity-60 transition-opacity">
                          {colVideos.slice(0, 6).map((v, i) => (
                            <div key={v.id} className="overflow-hidden">
                              <img src={v.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt=""/>
                            </div>
                          ))}
                          {colVideos.length < 6 && [...Array(6 - Math.min(colVideos.length, 6))].map((_, i) => (
                            <div key={`empty-${i}`} className="bg-slate-800"/>
                          ))}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30 z-10"/>
                      <div className="absolute bottom-10 left-10 right-10 z-20">
                        <div className="w-12 h-1.5 rounded-full mb-5 opacity-60" style={{ backgroundColor: settings.primaryColor }} />
                        <h3 className="text-3xl font-black text-white mb-3 group-hover:translate-x-3 transition-transform">{col.title}</h3>
                        <p className="text-slate-400 text-sm font-medium line-clamp-2 max-w-md">{col.description}</p>
                        <div className="mt-6 flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
                          <span className="flex items-center gap-2"><Film size={14}/> {col.videoIds.length} Заглавия</span>
                          {/* Thumbnail avatars */}
                          <div className="flex -space-x-3 ml-2">
                            {colVideos.slice(0, 4).map(v => (
                              <div key={v.id} className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden">
                                <img src={v.thumbnail} className="w-full h-full object-cover" alt=""/>
                              </div>
                            ))}
                            {colVideos.length > 4 && (
                              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[9px] font-bold text-white">
                                +{colVideos.length - 4}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                   </div>
                  );
                })}
              {collections.filter(col => col.title.toLowerCase().includes(collectionSearch.toLowerCase()) || col.description.toLowerCase().includes(collectionSearch.toLowerCase())).length === 0 && collectionSearch && (
                <div className="col-span-full py-32 text-center">
                  <Search size={60} className="mx-auto text-slate-800 mb-6" />
                  <h3 className="text-2xl font-black text-white mb-2">Няма намерени колекции</h3>
                  <p className="text-slate-500 font-medium">Опитайте с друго име на колекция.</p>
                </div>
              )}
              <div className="border-4 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center p-12 text-center group hover:border-white/10 transition-all aspect-[16/9]">
                <HelpCircle size={48} className="text-slate-800 mb-6" />
                <h4 className="text-slate-500 font-black uppercase tracking-widest text-sm">Очаквайте още колекции скоро</h4>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTACT VIEW --- */}
        {view === 'contact' && (
          <div className="pt-40 pb-32 px-10 max-w-4xl mx-auto min-h-screen">
             <div className="text-center mb-20">
               <h1 className="text-7xl font-black text-white mb-6 tracking-tighter">Свържи се с нас</h1>
               <p className="text-slate-500 text-xl font-medium">Имаш предложение или проблем? Ние сме тук.</p>
             </div>
             <form 
              onSubmit={(e) => {
                e.preventDefault();
                const d = new FormData(e.target);
                const newInq = { id: Date.now(), name: d.get('name'), email: d.get('email'), message: d.get('message'), date: new Date().toLocaleDateString() };
                setInquiries(prev => [newInq, ...prev]);
                showToast("Съобщението е изпратено!", "success");
                e.target.reset();
              }}
              className="bg-white/5 premium-blur p-16 rounded-[4rem] border border-white/10 space-y-8 shadow-3xl"
            >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Твоето Име</label>
                    <input required name="name" placeholder="Йоан Доу" className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white outline-none focus:ring-2 transition-all" style={{'--tw-ring-color': settings.primaryColor}}/>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Имейл Адрес</label>
                    <input required name="email" type="email" placeholder="email@example.com" className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white outline-none focus:ring-2 transition-all" style={{'--tw-ring-color': settings.primaryColor}}/>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Твоето Съобщение</label>
                  <textarea required name="message" placeholder="Пиши ни тук..." rows={6} className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white outline-none resize-none focus:ring-2 transition-all" style={{'--tw-ring-color': settings.primaryColor}}/>
                </div>
                <button type="submit" className="w-full py-7 bg-white text-black font-black uppercase tracking-[0.3em] rounded-3xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4">
                  ИЗПРАТИ СЪОБЩЕНИЕТО <Send size={20}/>
                </button>
             </form>
          </div>
        )}

        {/* --- LOGIN VIEW --- */}
        {view === 'login' && (
           <div className="pt-48 flex justify-center px-10">
              <div className="bg-white/5 premium-blur p-16 rounded-[4rem] border border-white/10 w-full max-w-xl shadow-3xl text-center">
                 <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-white/10">
                    <Shield size={48} style={{ color: settings.primaryColor }} />
                 </div>
                 <h2 className="text-4xl font-black text-white mb-4 tracking-[0.1em] uppercase">{settings.texts.loginTitle}</h2>
                 <p className="text-slate-500 mb-12 font-medium">Само за оторизиран персонал.</p>
                 <form onSubmit={(e)=>{ 
                   e.preventDefault(); 
                   if(loginForm.email === 'admin@animaciqbg.net' && loginForm.password === 'admin123'){ 
                     setCurrentUser(MOCK_ADMIN); 
                     localStorage.setItem('adminSession', 'true'); 
                     setView('admin'); 
                     addLog("Вход в административен панел", "success");
                     showToast("Добре дошли, Админ!", "success");
                   } else {
                     showToast("Невалидни данни!", "error");
                   }
                 }} className="space-y-6">
                    <input type="email" required placeholder={settings.texts.loginEmailPlaceholder} className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}} value={loginForm.email} onChange={e=>setLoginForm({...loginForm, email: e.target.value})}/>
                    <input type="password" required placeholder={settings.texts.loginPasswordPlaceholder} className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}} value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password: e.target.value})}/>
                    <button className="w-full py-7 text-black bg-white font-black uppercase tracking-[0.2em] rounded-3xl hover:scale-105 transition-all shadow-2xl mt-4">
                      {settings.texts.loginButton}
                    </button>
                 </form>
              </div>
           </div>
        )}

        {/* --- ADMIN VIEW --- */}
        {view === 'admin' && currentUser && (
          <div className="pt-40 px-10 max-w-[1700px] mx-auto flex flex-col xl:flex-row gap-16">
            {/* Sidebar Navigation */}
            <div className="xl:w-80 shrink-0 flex flex-col gap-3">
               <div className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-white/5 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">A</div>
                    <div>
                      <h4 className="text-white font-black text-sm">{currentUser.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{currentUser.role}</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/5 w-full mb-4" />
                  <div className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-2">
                    <Database size={12}/> DB VERSION: {settings.version}
                  </div>
               </div>

               {[
                {id: 'dashboard', icon: <Layout size={18}/>, label: 'Дашборд'},
                {id: 'catalog', icon: <Film size={18}/>, label: 'Каталог'},
                {id: 'collections', icon: <Layers size={18}/>, label: 'Колекции'},
                {id: 'inquiries', icon: <Mail size={18}/>, label: 'Запитвания'},
                {id: 'settings', icon: <Settings size={18}/>, label: 'Настройки'},
                {id: 'texts', icon: <Type size={18}/>, label: 'Текстове'},
                {id: 'logs', icon: <Activity size={18}/>, label: 'Логове'}
               ].map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => setAdminTab(tab.id)} 
                    className={`w-full text-left p-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center gap-4 transition-all
                      ${adminTab === tab.id ? 'text-white shadow-xl' : 'text-slate-500 hover:bg-white/5'}`} 
                    style={adminTab === tab.id ? { backgroundColor: settings.primaryColor, boxShadow: `0 10px 30px ${settings.primaryColor}30` } : {}}
                  >
                     {tab.icon} {tab.label}
                  </button>
               ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 pb-32">
               {adminTab === 'dashboard' && (
                  <div className="space-y-12">
                     {/* Stats Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                          { label: 'Общо Видеа', val: videos.length, icon: <Film className="text-blue-500"/> },
                          { label: 'Общо Гледания', val: videos.reduce((a,b)=>a+(b.views||0), 0), icon: <Eye className="text-emerald-500"/> },
                          { label: 'Запитвания', val: inquiries.length, icon: <Mail className="text-yellow-500"/> },
                          { label: 'Лайкове', val: videos.reduce((a,b)=>a+(b.likes||0), 0), icon: <ThumbsUp className="text-rose-500"/> }
                        ].map((s, i) => (
                          <div key={i} className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                             <div className="flex justify-between items-start mb-4">
                               <div className="p-3 bg-white/5 rounded-2xl">{s.icon}</div>
                               <BarChart3 size={16} className="text-slate-700"/>
                             </div>
                             <h4 className="text-4xl font-black text-white mb-1">{s.val.toLocaleString()}</h4>
                             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                          </div>
                        ))}
                     </div>

                     <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-3xl">
                        <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                          <Activity style={{ color: settings.primaryColor }} /> Последна Активност
                        </h2>
                        <div className="space-y-4">
                          {activityLog.slice(0, 5).map(l => (
                             <div key={l.id} className="p-5 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                                    <Clock size={16} className="text-slate-500" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-white">{l.msg}</p>
                                    <p className="text-[10px] text-slate-600 uppercase font-black">{l.date}</p>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${l.type === 'error' ? 'text-red-500 border-red-500/20' : 'text-blue-500 border-blue-500/20'}`}>
                                  {l.type.toUpperCase()}
                                </span>
                             </div>
                          ))}
                        </div>
                     </div>
                  </div>
               )}

               {adminTab === 'catalog' && (
                  <div className="space-y-12">
                     <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-white/5 shadow-3xl">
                        <h2 className="text-3xl font-black text-white mb-10">{editingVideoId ? "Редактиране на Видео" : "Добавяне на Ново Видео"}</h2>
                        <form onSubmit={e => {
                           e.preventDefault(); const d = new FormData(e.target);
                           const vData = {
                             title: d.get('title'),
                             year: d.get('year'),
                             streamType: d.get('type'),
                             embedUrl: d.get('embed'),
                             downloadUrl: d.get('download'),
                             thumbnail: d.get('thumb'),
                             description: d.get('desc'),
                             type: d.get('category'),
                             duration: d.get('duration'),
                             audioType: d.get('audioType')
                           };
                           if (editingVideoId) handleVideoAction(editingVideoId, 'edit', vData); 
                           else handleVideoAction(null, 'add', vData);
                           e.target.reset();
                        }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           <div className="lg:col-span-2 space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Заглавие</label>
                             <input name="title" required defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.title : ""} className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}}/>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Година</label>
                             <input name="year" required defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.year : ""} className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-white outline-none"/>
                           </div>
                           <div className="lg:col-span-2 space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Thumbnail URL</label>
                             <input name="thumb" required defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.thumbnail : ""} className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-white outline-none"/>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Категория</label>
                             <select name="category" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.type : "movie"} className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-white outline-none">
                                <option value="movie">Филм</option><option value="series">Сериал</option><option value="short">Кратка Анимация</option>
                             </select>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Тип Стрийм</label>
                             <select name="type" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.streamType : "embed"} className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-white outline-none">
                                <option value="embed">Стрийминг (Embed)</option><option value="download">Изтегляне (Link)</option>
                             </select>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Embed URL</label>
                             <input name="embed" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.embedUrl : ""} className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-white outline-none"/>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Времетраене</label>
                             <input name="duration" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.duration : ""} placeholder="напр. 95 min" className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-white outline-none"/>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Аудио Тип</label>
                             <select name="audioType" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.audioType : "bg_audio"} className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-white outline-none">
                                <option value="bg_audio">БГ Аудио</option>
                                <option value="subtitles">Субтитри</option>
                             </select>
                           </div>
                           <div className="lg:col-span-3 space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Описание</label>
                             <textarea name="desc" rows={4} defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.description : ""} className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-white outline-none resize-none"/>
                           </div>
                           <div className="lg:col-span-3 pt-6 flex gap-4">
                             <button type="submit" className="flex-1 py-7 text-white font-black rounded-3xl uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all" style={{ backgroundColor: settings.primaryColor }}>
                                {editingVideoId ? "ЗАПАЗИ ПРОМЕНИТЕ" : "ДОБАВИ В КАТАЛОГА"}
                             </button>
                             {editingVideoId && (
                               <button type="button" onClick={() => setEditingVideoId(null)} className="px-10 py-7 bg-white/5 text-white font-black rounded-3xl uppercase tracking-widest hover:bg-white/10 transition-all">ОТКАЗ</button>
                             )}
                           </div>
                        </form>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between mb-4 px-4">
                          <h3 className="text-xl font-black text-white">Инвентар ({videos.length})</h3>
                          <div className="flex gap-2">
                            <button className="p-3 bg-white/5 text-slate-500 rounded-xl hover:text-white transition-colors"><RefreshCw size={18}/></button>
                          </div>
                        </div>
                        {videos.map(v => (
                           <div key={v.id} className="flex items-center justify-between p-6 rounded-[2rem] border bg-slate-900/50 border-white/5 transition-all hover:bg-slate-800/50 group">
                              <div className="flex items-center gap-6">
                                <div className="relative w-16 h-20 rounded-2xl overflow-hidden shadow-xl">
                                  <img src={v.thumbnail} className="w-full h-full object-cover" alt=""/>
                                  <div className="absolute inset-0 bg-black/20" />
                                </div>
                                <div>
                                  <h4 className="text-white font-black text-lg group-hover:text-red-500 transition-colors">{v.title}</h4>
                                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                                    <span className="flex items-center gap-1"><Calendar size={12}/> {v.year}</span>
                                    <span className="flex items-center gap-1"><Eye size={12}/> {v.views}</span>
                                    <span className={`px-2 py-0.5 rounded-md ${v.streamType === 'download' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>{v.streamType}</span>
                                    {v.audioType && <span className={`px-2 py-0.5 rounded-md ${v.audioType === 'bg_audio' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'}`}>{v.audioType === 'bg_audio' ? 'БГ Аудио' : 'Субтитри'}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <button onClick={() => { setEditingVideoId(v.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-14 h-14 flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all shadow-lg">
                                   <Edit size={22}/>
                                 </button>
                                 <button onClick={() => setDeleteConfirm({ open: true, id: v.id, type: 'video' })} className="w-14 h-14 flex items-center justify-center bg-white/5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all shadow-lg">
                                   <Trash2 size={22}/>
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {adminTab === 'settings' && (
                  <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-white/5 shadow-3xl space-y-16 text-white">
                     <section className="space-y-10">
                       <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
                         <Database style={{ color: settings.primaryColor }}/> Cloud Sync & Backup
                       </h2>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <button 
                            onClick={() => { 
                              const blob = new Blob([JSON.stringify({ version: SCHEMA_VERSION, videos, collections, inquiries, settings, exportDate: new Date() }, null, 2)], { type: 'application/json' }); 
                              const link = document.createElement('a'); 
                              link.href = URL.createObjectURL(blob); 
                              link.download = `animationbg_v14_backup_${Date.now()}.json`; 
                              link.click(); 
                              showToast("Архивът е готов!", "success");
                            }} 
                            className="flex flex-col items-center gap-6 p-12 rounded-[3rem] bg-emerald-600 hover:bg-emerald-700 transition-all shadow-2xl group"
                          >
                            <div className="p-5 bg-white/20 rounded-full group-hover:scale-110 transition-transform"><FileDown size={40}/></div>
                            <div className="text-center">
                              <span className="block font-black text-xl tracking-widest uppercase">ЕКСПОРТ ДАННИ</span>
                              <span className="text-[10px] font-bold opacity-60">Свали пълен архив на платформата</span>
                            </div>
                          </button>
                          
                          <label className="flex flex-col items-center gap-6 p-12 rounded-[3rem] bg-blue-600 hover:bg-blue-700 transition-all shadow-2xl group cursor-pointer">
                             <input type="file" accept=".json" className="hidden" onChange={(e) => { 
                               const file = e.target.files[0]; 
                               if(!file) return; 
                               const reader = new FileReader(); 
                               reader.onload = (ev) => { 
                                 try { 
                                   const data = JSON.parse(ev.target.result); 
                                   if (data.version !== SCHEMA_VERSION) {
                                      if (!window.confirm("Версията на архива е различна! Продължаване?")) return;
                                   }
                                   if(window.confirm("ВНИМАНИЕ: Това ще заличи текущите данни! Потвърди импорт?")) { 
                                      setVideos(data.videos || []); 
                                      setSettings(prev => ({ ...prev, ...(data.settings || {}) })); 
                                      setCollections(data.collections || []); 
                                      setInquiries(data.inquiries || []); 
                                      showToast("Данните са синхронизирани!", "success");
                                      setTimeout(() => window.location.reload(), 1500);
                                   } 
                                 } catch { 
                                   showToast("Невалиден файл!", "error");
                                 } 
                               }; 
                               reader.readAsText(file); 
                             }} />
                             <div className="p-5 bg-white/20 rounded-full group-hover:scale-110 transition-transform"><FileUp size={40}/></div>
                             <div className="text-center">
                               <span className="block font-black text-xl tracking-widest uppercase">ИМПОРТ ДАННИ</span>
                               <span className="text-[10px] font-bold opacity-60">Зареди данни от външен архив</span>
                             </div>
                          </label>
                       </div>
                     </section>

                     <section className="space-y-10 border-t border-white/5 pt-16">
                        <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
                          <Palette style={{ color: settings.primaryColor }}/> Визуален Дизайн
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Основен Цвят на Платформата</label>
                              <div className="flex gap-4">
                                <input type="color" value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="w-20 h-16 bg-transparent border-0 rounded-2xl cursor-pointer shadow-xl"/>
                                <input value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="flex-1 bg-black/40 border border-white/10 p-4 rounded-2xl text-white font-mono uppercase text-center focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}}/>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Визуален Ефект (Particles)</label>
                              <select value={settings.visualEffect} onChange={e => setSettings({...settings, visualEffect: e.target.value})} className="w-full bg-black/40 border border-white/10 p-5 rounded-3xl text-white outline-none">
                                <option value="none">Без ефект</option>
                                <option value="snow">Сняг (Зима)</option>
                                <option value="rain">Дъжд (Есен)</option>
                                <option value="sakura">Сакура (Пролет)</option>
                                <option value="fireflies">Светулки (Лято)</option>
                              </select>
                           </div>
                        </div>
                     </section>
                  </div>
               )}

               {adminTab === 'inquiries' && (
                  <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-white/5 shadow-3xl space-y-10">
                     <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-black text-white flex items-center gap-4">
                          <MessageSquare style={{ color: settings.primaryColor }} /> Входяща Кутия
                        </h2>
                        <span className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 border border-white/10 uppercase tracking-widest">{inquiries.length} СЪОБЩЕНИЯ</span>
                     </div>
                     {inquiries.length === 0 ? (
                        <div className="py-32 text-center opacity-20">
                          <Mail size={80} className="mx-auto mb-6" />
                          <p className="text-xl font-black uppercase tracking-widest">Няма нови запитвания</p>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 gap-6">
                           {inquiries.map(inq => (
                              <div key={inq.id} className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] hover:border-white/20 transition-all shadow-xl">
                                 <div className="flex justify-between items-start mb-8">
                                    <div className="flex gap-5 items-center">
                                       <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center font-black text-2xl text-white">
                                          {inq.name[0]}
                                       </div>
                                       <div>
                                          <h4 className="text-xl font-black text-white">{inq.name}</h4>
                                          <p className="text-slate-500 font-bold flex items-center gap-2 mt-1">
                                            <Mail size={14} style={{ color: settings.primaryColor }}/> {inq.email}
                                          </p>
                                       </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{inq.date}</span>
                                       <button onClick={() => { setInquiries(prev => prev.filter(x => x.id !== inq.id)); showToast("Съобщението е изтрито.", "warning"); }} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                          <Trash2 size={20}/>
                                       </button>
                                    </div>
                                 </div>
                                 <div className="bg-slate-950/50 p-8 rounded-3xl text-slate-300 leading-relaxed font-medium italic border border-white/5">
                                    "{inq.message}"
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               )}

               {adminTab === 'texts' && (
                  <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-white/5 shadow-3xl space-y-12 text-white">
                      <h2 className="text-3xl font-black flex items-center gap-4">
                        <Type style={{ color: settings.primaryColor }}/> Управление на Текстове
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         {Object.keys(settings.texts).map(key => (
                            <div key={key} className="space-y-4 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all">
                               <label className="text-[11px] uppercase font-black text-slate-500 ml-2 tracking-[0.2em]">{key.replace(/([A-Z])/g, ' $1')}</label>
                               <textarea 
                                  value={settings.texts[key]} 
                                  rows={2}
                                  onChange={e => {
                                    const nt = {...settings.texts, [key]: e.target.value}; 
                                    setSettings(prev=>({...prev, texts: nt}));
                                  }} 
                                  className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-white text-sm outline-none focus:ring-2 resize-none"
                                  style={{'--tw-ring-color': settings.primaryColor}}
                               />
                            </div>
                         ))}
                      </div>
                  </div>
               )}

               {adminTab === 'logs' && (
                  <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-white/5 shadow-3xl h-[800px] overflow-hidden flex flex-col text-white">
                     <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-black flex items-center gap-4">
                          <Activity style={{ color: settings.primaryColor }}/> Системни Логове
                        </h2>
                        <button onClick={() => setActivityLog([])} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-500 transition-colors">Изчисти всички</button>
                     </div>
                     <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-2">
                        {activityLog.length === 0 ? (
                           <p className="text-center py-20 text-slate-700 font-black uppercase tracking-widest">Няма активни логове</p>
                        ) : activityLog.map(l => (
                           <div key={l.id} className="p-6 bg-black/40 border-l-4 rounded-2xl flex justify-between items-center shadow-lg hover:bg-black/60 transition-all" 
                                style={{ borderLeftColor: l.type === 'error' ? '#EF4444' : (l.type === 'success' ? '#10B981' : settings.primaryColor) }}>
                              <div className="flex items-center gap-5">
                                 <div className="p-2 bg-white/5 rounded-lg">
                                    {l.type === 'error' ? <ShieldAlert size={16} className="text-rose-500"/> : (l.type === 'success' ? <Check size={16} className="text-emerald-500"/> : <Info size={16} className="text-blue-500"/>)}
                                 </div>
                                 <span className="text-sm font-bold tracking-tight">{l.msg}</span>
                              </div>
                              <span className="text-[10px] font-black text-slate-600 uppercase tabular-nums">{l.date}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {adminTab === 'collections' && (
                 <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-white/5 shadow-3xl space-y-12">
                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                      <Layers style={{ color: settings.primaryColor }} /> Управление на Колекции
                    </h2>
                    
                    <form onSubmit={e => {
                      e.preventDefault();
                      const d = new FormData(e.target);
                      const selected = Array.from(e.target.vids.selectedOptions).map(o => o.value);
                      if (editingCollection) {
                        setCollections(prev => prev.map(c => c.id === editingCollection.id ? { ...c, title: d.get('title'), description: d.get('desc'), videoIds: selected } : c));
                        showToast("Колекцията е обновена!", "success");
                        setEditingCollection(null);
                      } else {
                        const newCol = { id: Date.now(), title: d.get('title'), description: d.get('desc'), videoIds: selected };
                        setCollections(prev => [...prev, newCol]);
                        showToast("Колекцията е създадена!", "success");
                      }
                      e.target.reset();
                    }} className="space-y-8 bg-black/40 p-10 rounded-[3rem] border border-white/5">
                       {editingCollection && (
                         <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-2xl border border-white/10">
                           <span className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><Edit size={16} style={{ color: settings.primaryColor }}/> Редактиране: {editingCollection.title}</span>
                           <button type="button" onClick={() => setEditingCollection(null)} className="p-2 text-slate-400 hover:text-white transition-colors"><X size={18}/></button>
                         </div>
                       )}
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Име на Колекцията</label>
                            <input name="title" required placeholder="напр. Класически Анимации" defaultValue={editingCollection?.title || ''} key={editingCollection?.id || 'new'} className="w-full bg-slate-950 border border-white/5 p-6 rounded-3xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}}/>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Избери Видеа (Shift+Click)</label>
                            <select name="vids" multiple required defaultValue={editingCollection?.videoIds || []} key={(editingCollection?.id || 'new') + '-vids'} className="w-full bg-slate-950 border border-white/5 p-4 rounded-3xl text-white h-48 outline-none focus:ring-2 no-scrollbar" style={{'--tw-ring-color': settings.primaryColor}}>
                               {videos.map(v => <option key={v.id} value={v.id} className="p-3 border-b border-white/5 text-sm font-bold">{v.title}</option>)}
                            </select>
                          </div>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-500 ml-4">Описание</label>
                         <textarea name="desc" placeholder="Кратко представяне на колекцията..." defaultValue={editingCollection?.description || ''} key={(editingCollection?.id || 'new') + '-desc'} className="w-full bg-slate-950 border border-white/5 p-6 rounded-3xl text-white outline-none h-32 resize-none"/>
                       </div>
                       <div className="flex gap-4">
                         <button type="submit" className="flex-1 py-7 text-white font-black rounded-3xl uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all" style={{ backgroundColor: settings.primaryColor }}>
                            {editingCollection ? 'ЗАПАЗИ ПРОМЕНИТЕ' : 'СЪЗДАЙ КОЛЕКЦИЯ'}
                         </button>
                         {editingCollection && (
                           <button type="button" onClick={() => setEditingCollection(null)} className="px-10 py-7 text-slate-400 font-black rounded-3xl uppercase tracking-[0.3em] border border-white/10 hover:bg-slate-800 transition-all">
                             ОТКАЗ
                           </button>
                         )}
                       </div>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {collections.map(col => (
                          <div key={col.id} className="p-8 bg-black/20 rounded-[2.5rem] border border-white/5 flex flex-col justify-between group">
                             <div>
                                <div className="flex justify-between items-start mb-4">
                                   <h4 className="text-xl font-black text-white uppercase group-hover:text-red-500 transition-all">{col.title}</h4>
                                   <div className="flex gap-1">
                                     <button onClick={() => { setEditingCollection(col); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 text-slate-600 hover:text-blue-400 transition-colors">
                                        <Edit size={20}/>
                                     </button>
                                     <button onClick={() => { setCollections(prev => prev.filter(c => c.id !== col.id)); showToast("Колекцията е премахната.", "warning"); }} className="p-3 text-slate-600 hover:text-rose-500 transition-colors">
                                        <Trash2 size={20}/>
                                     </button>
                                   </div>
                                </div>
                                <p className="text-slate-500 text-sm font-medium line-clamp-2">{col.description}</p>
                             </div>
                             <div className="mt-8 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{col.videoIds.length} ВИДЕА</span>
                                <div className="flex -space-x-4">
                                   {col.videoIds.slice(0, 5).map(vid => (
                                      <div key={vid} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden">
                                         <img src={videos.find(v=>v.id===vid)?.thumbnail} className="w-full h-full object-cover" alt=""/>
                                      </div>
                                   ))}
                                   {col.videoIds.length > 5 && (
                                      <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                                         +{col.videoIds.length - 5}
                                      </div>
                                   )}
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-32 border-t border-white/5 px-10 mt-32 bg-slate-950/20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-10 opacity-50" style={{ backgroundImage: `linear-gradient(to right, transparent, ${settings.primaryColor}, transparent)` }} />
          <h3 className="text-5xl font-black text-white tracking-tighter mb-6">{settings.siteName}</h3>
          <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            {settings.texts.footerDescription}
          </p>
          <div className="flex justify-center gap-10 mb-16">
             <button className="text-slate-600 hover:text-white transition-colors"><Monitor size={24}/></button>
             <button className="text-slate-600 hover:text-white transition-colors"><Tablet size={24}/></button>
             <button className="text-slate-600 hover:text-white transition-colors"><Smartphone size={24}/></button>
          </div>
          <div className="text-[10px] font-black text-slate-800 uppercase tracking-[0.8em]">
            AnimationBG Platform v14.0 • Cloud Sync • Smart Features
          </div>
          {firebaseEnabled && (
            <div className="mt-6 flex items-center justify-center gap-2 text-xs">
              <Cloud size={14} className={cloudConnected ? 'text-emerald-500' : 'text-slate-600'} />
              <span className={cloudConnected ? 'text-emerald-500/70' : 'text-slate-700'}>
                {cloudConnected ? 'Cloud Sync Active' : 'Connecting...'}
              </span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
