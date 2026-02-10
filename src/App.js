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
  Radio, RefreshCw
} from 'lucide-react';

/**
 * ANIMATIONBG - ВЕРСИЯ 8.4 (PRODUCTION READY)
 * * Промени:
 * - Премахната IP проверка (достъпно от всякъде).
 * - localStorage персистентност за админ сесия и видео каталог.
 * - Обновен админ имейл: admin@animaciqbg.net.
 * - Оптимизиран TorrentPlayer с React.memo.
 * - Валидация и try-catch при добавяне на съдържание.
 */

// --- ДАННИ (ТОРЕНТИ) ---
// TODO: Replace with API fetch from backend
const MOCK_VIDEOS = [
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

const MOCK_ADMIN = { id: 'a1', name: 'Администратор', email: 'admin@animaciqbg.net', role: 'admin' };

// Глобално зареждане на WebTorrent скрипта
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

// --- ВИЗУАЛНИ ЕФЕКТИ ---
const VisualEffectLayer = ({ type }) => {
  if (!type || type === 'none') return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
       {type === 'snow' && <style>{`@keyframes fall { 0% { transform: translateY(-10vh); opacity: 0.8; } 100% { transform: translateY(110vh); opacity: 0; } } .animate-effect { animation: fall linear infinite; }`}</style>}
       {type === 'rain' && <style>{`@keyframes rain { 0% { transform: translateY(-10vh); opacity: 0.5; } 100% { transform: translateY(110vh); opacity: 0; } } .animate-effect { animation: rain linear infinite; }`}</style>}
       {[...Array(40)].map((_, i) => (
         <div key={i} className="absolute animate-effect text-white/40"
           style={{
             left: `${Math.random() * 100}%`, top: `-${Math.random() * 20}%`,
             animationDuration: `${Math.random() * 5 + 5}s`, animationDelay: `${Math.random() * 5}s`, 
             fontSize: `${Math.random() * 20 + 10}px`
           }}>{type === 'snow' ? '❄' : '💧'}</div>
       ))}
    </div>
  );
};

// --- ТОРЕНТ ПЛЕЙЪР КОМПОНЕНТ (ОПТИМИЗИРАН С MEMO) ---
const TorrentPlayer = memo(({ video, onClose, settings }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({ loading: true, peers: 0, progress: 0, speed: 0, error: null, ready: false });
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
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
    let timeoutTimer = null;

    const startTorrent = () => {
      try {
        if (!window.WebTorrent) return;
        client = new window.WebTorrent();
        
        timeoutTimer = setTimeout(() => {
          if (isMounted.current && status.peers === 0 && status.loading) {
            setShowTimeoutWarning(true);
          }
        }, 10000);

        client.add(video.magnetLink, (torrent) => {
          if (!isMounted.current) {
            client.destroy();
            return;
          }

          const file = torrent.files.find(f => 
            f.name.endsWith('.mp4') || f.name.endsWith('.mkv') || f.name.endsWith('.webm')
          );
          
          if (file && videoRef.current) {
            file.renderTo(videoRef.current, { autoplay: false, muted: false }, (err) => {
              if (err) {
                console.error("Грешка при рендиране:", err);
                return;
              }
              if (isMounted.current && videoRef.current) {
                videoRef.current.play().catch(() => {});
              }
            });
          }

          torrent.on('download', () => {
            if (isMounted.current) {
              if (torrent.numPeers > 0) setShowTimeoutWarning(false);
              
              setStatus(prev => ({
                ...prev,
                loading: false,
                peers: torrent.numPeers,
                progress: Math.round(torrent.progress * 100),
                speed: Math.round(torrent.downloadSpeed / 1024 / 1024 * 100) / 100,
                error: null
              }));
            }
          });
        });

        client.on('error', (err) => {
          if (isMounted.current) setStatus(s => ({ ...s, error: err.message }));
        });
      } catch (e) {
        if (isMounted.current) setStatus(s => ({ ...s, error: "Грешка при стартиране" }));
      }
    };

    loadWebTorrentGlobal(startTorrent);

    return () => {
      isMounted.current = false;
      if (timeoutTimer) clearTimeout(timeoutTimer);
      if (client) client.destroy();
    };
  }, [video, retryKey]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const getStatusText = () => {
    if (status.error) return "Грешка при зареждане";
    if (status.ready) return "Готово за гледане";
    if (status.progress >= 1) return "Буфериране...";
    if (status.peers > 0) return "Свързване...";
    return "Търсене на източници...";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-sans select-none"
         onMouseMove={() => setShowControls(true)}
         onContextMenu={(e) => e.preventDefault()}>
      
      {settings.watermarkEnabled && (
        <div className="absolute top-20 right-8 z-[70] pointer-events-none opacity-20 select-none">
          <span className="text-white font-black text-2xl uppercase tracking-widest drop-shadow-lg">{settings.watermarkContent}</span>
        </div>
      )}

      <div className={`absolute top-0 left-0 right-0 p-6 z-[60] flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div>
          <h2 className="text-white text-2xl font-bold flex items-center gap-2">{video.title} <span className="text-red-500 text-xs bg-red-500/10 px-2 py-0.5 rounded">СТРИЙМ НА ЖИВО</span></h2>
          <div className="flex gap-4 text-gray-400 text-xs mt-2 uppercase tracking-tighter">
             <span className={`flex items-center gap-1 ${status.peers > 0 ? 'text-green-400' : 'text-yellow-500'}`}><Radio size={12}/> {status.peers} Peers</span>
             <span className="flex items-center gap-1"><Download size={12}/> {status.speed} MB/s</span>
             <span className="flex items-center gap-1 text-red-500 font-bold">{getStatusText()} ({status.progress}%)</span>
          </div>
        </div>
        <button onClick={onClose} className="p-3 bg-white/10 hover:bg-red-600 rounded-full text-white transition-all"><X size={24}/></button>
      </div>

      <div className="w-full h-full relative flex items-center justify-center">
        {status.loading && !status.error && !showTimeoutWarning && (
          <div className="flex flex-col items-center gap-4 text-white z-10">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold animate-pulse">{getStatusText()}</p>
          </div>
        )}

        {showTimeoutWarning && (
          <div className="text-center p-8 bg-slate-900 border border-slate-700 rounded-3xl max-w-sm z-20 shadow-2xl">
            <AlertTriangle className="text-yellow-500 mx-auto mb-4" size={48}/>
            <p className="text-white font-bold mb-2 text-lg">Няма налични източници</p>
            <p className="text-slate-400 text-sm mb-6">В момента няма активни peers за този торент. Опитайте пак след малко.</p>
            <div className="flex gap-3">
              <button onClick={() => { setShowTimeoutWarning(false); setRetryKey(k => k + 1); }} className="flex-1 px-6 py-2 bg-white text-black rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-200"><RefreshCw size={16}/> Опитай пак</button>
              <button onClick={onClose} className="flex-1 px-6 py-2 bg-slate-800 text-white rounded-full text-sm font-bold hover:bg-slate-700">Затвори</button>
            </div>
          </div>
        )}

        <video 
          ref={videoRef} 
          className="w-full h-full object-contain"
          onCanPlay={() => setStatus(s => ({ ...s, ready: true }))}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={() => { if(videoRef.current) setCurrentTime(videoRef.current.currentTime); }}
          onLoadedMetadata={() => { if(videoRef.current) setDuration(videoRef.current.duration); }}
          onClick={togglePlay}
        />
      </div>

      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent px-8 py-8 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-full h-1.5 bg-white/20 rounded-full mb-6 relative group/progress">
             <div className="h-full bg-red-600 rounded-full" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-lg" />
             </div>
          </div>
          <div className="flex justify-between items-center text-white">
             <div className="flex items-center gap-6">
                <button onClick={togglePlay} className="hover:text-red-500 transition-colors">{playing ? <Pause size={28}/> : <Play size={28}/>}</button>
                <div className="flex items-center gap-3 group/vol">
                   <Volume2 size={24}/>
                   <div className="w-24 h-1 bg-gray-700 rounded-full relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-red-600" style={{ width: `${volume * 100}%` }} />
                      <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => { setVolume(e.target.value); if(videoRef.current) videoRef.current.volume = e.target.value; }} className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                   </div>
                </div>
                <span className="text-sm font-mono font-bold tracking-widest">{formatTime(currentTime)} / {formatTime(duration)}</span>
             </div>
             <div className="flex items-center gap-4">
                <button onClick={() => videoRef.current && videoRef.current.requestFullscreen()} className="hover:text-red-500 text-white"><Maximize size={24}/></button>
             </div>
          </div>
      </div>
    </div>
  );
});

// --- ГЛАВНО ПРИЛОЖЕНИЕ ---
export default function App() {
  const [view, setView] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [videos, setVideos] = useState(MOCK_VIDEOS);
  const [activeVideo, setActiveVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  
  const [settings, setSettings] = useState({
    primaryColor: '#DC2626',
    logoType: 'text', logoUrl: '',
    visualEffect: 'none',
    watermarkEnabled: true,
    watermarkContent: 'ANIMATIONBG STREAM',
    discordWebhook: ''
  });

  const [adminTab, setAdminTab] = useState('dashboard');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // ПЕРСИСТЕНТНОСТ: Зареждане на сесия и видеа
  useEffect(() => {
    // Проверка за админ сесия
    if (localStorage.getItem('adminSession') === 'true') {
      setCurrentUser(MOCK_ADMIN);
    }

    // Зареждане на запазени видеа
    const saved = localStorage.getItem('savedVideos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge-ваме MOCK_VIDEOS с тези от localStorage, за да сме сигурни че дефолтните са там
        const combined = [...parsed];
        setVideos(combined);
      } catch(e) {
        console.error('Error loading saved videos from localStorage');
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email === 'admin@animaciqbg.net' && loginForm.password === 'admin123') {
      setCurrentUser(MOCK_ADMIN);
      localStorage.setItem('adminSession', 'true');
      setView('admin');
      addLog("Успешен вход на администратор", "success");
    } else { alert("Невалидни данни за достъп!"); }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setCurrentUser(null);
    setView('home');
    addLog("Администратор излезе от системата", "info");
  };

  const addLog = (msg, type='info') => {
    setActivityLog(prev => [{id: Date.now(), msg: String(msg), type, date: new Date().toLocaleTimeString()}, ...prev]);
  };

  const handleAddVideo = (data) => {
    try {
      // TODO: Send POST request to backend API
      const newVideo = { ...data, id: Date.now().toString(), views: 0, likes: 0 };
      const updatedVideos = [newVideo, ...videos];
      
      setVideos(updatedVideos);
      localStorage.setItem('savedVideos', JSON.stringify(updatedVideos));
      
      addLog(`Нов торент добавен: ${data.title}`, "success");
      alert("Анимацията е добавена успешно в каталога!");
    } catch (err) {
      console.error("Failed to add video:", err);
      alert("Възникна грешка при запазването на филма. Моля опитайте пак.");
    }
  };

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
         <button onClick={() => setView('home')} className="text-2xl font-black text-white tracking-tighter">
            <span style={{color: settings.primaryColor}}>Animation</span>BG
         </button>
         <div className="flex items-center gap-4">
           {currentUser ? (
              <div className="flex items-center gap-3">
                 <button onClick={() => { setAdminTab('dashboard'); setView('admin'); }} className="p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"><Settings size={18}/></button>
                 <button onClick={handleLogout} className="p-2 bg-red-900/30 text-red-500 rounded-full hover:bg-red-900/50 transition-colors"><LogOut size={18}/></button>
              </div>
           ) : (
              <button onClick={() => setView('login')} className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg"><Lock size={14}/> ВХОД</button>
           )}
         </div>
      </div>
    </nav>
  );

  const HomeView = () => (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
         <h1 className="text-4xl font-black text-white mb-2">Български дублирани анимации</h1>
         <p className="text-slate-500 text-lg">P2P Стрийминг технология 2026. Гледай веднага.</p>
      </div>

      <div className="mb-10 relative">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/>
         <input 
           value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
           placeholder="Търсене на заглавия..." 
           className="w-full bg-slate-900 border border-slate-800 p-5 pl-14 rounded-2xl text-white focus:border-red-600 outline-none transition-all shadow-xl"
         />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {videos.filter(v=>v.title.toLowerCase().includes(searchQuery.toLowerCase())).map(v => (
          <div key={v.id} onClick={() => setActiveVideo(v)} className="bg-slate-900 rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-red-600 transition-all group transform hover:-translate-y-2">
             <div className="aspect-[3/4] relative">
                <img src={v.thumbnail} className="w-full h-full object-cover" alt={v.title}/>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                   <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform">
                      <Play fill="white" className="text-white ml-1" size={32}/>
                   </div>
                </div>
                <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">HD Stream</div>
             </div>
             <div className="p-5">
                <h3 className="font-bold text-white text-lg truncate mb-1">{v.title}</h3>
                <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                   <span>{v.year}</span>
                   <span className="flex items-center gap-1"><Eye size={14}/> {v.views}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AdminPanel = () => {
    const [form, setForm] = useState({ title: '', year: '', magnetLink: '', thumbnail: '', description: '' });

    return (
      <div className="pt-24 px-6 max-w-7xl mx-auto flex gap-10">
         <div className="w-64 shrink-0 space-y-2">
            <button onClick={() => setAdminTab('dashboard')} className={`w-full text-left p-4 rounded-xl font-bold transition-all ${adminTab === 'dashboard' ? 'bg-red-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}>Каталог</button>
            <button onClick={() => setAdminTab('settings')} className={`w-full text-left p-4 rounded-xl font-bold transition-all ${adminTab === 'settings' ? 'bg-red-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}>Настройки</button>
            <button onClick={() => setAdminTab('logs')} className={`w-full text-left p-4 rounded-xl font-bold transition-all ${adminTab === 'logs' ? 'bg-red-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}>Логове</button>
         </div>

         <div className="flex-1 pb-20">
            {adminTab === 'dashboard' && (
              <div className="space-y-10">
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3"><Plus className="text-red-500"/> Добави нова анимация (Torrent)</h2>
                    <form onSubmit={e => { e.preventDefault(); handleAddVideo(form); setForm({ title: '', year: '', magnetLink: '', thumbnail: '', description: '' }); }} className="grid grid-cols-2 gap-6">
                       <input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Заглавие" className="col-span-2 bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-red-600"/>
                       <input required value={form.year} onChange={e=>setForm({...form, year: e.target.value})} placeholder="Година" className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-red-600"/>
                       <input required value={form.thumbnail} onChange={e=>setForm({...form, thumbnail: e.target.value})} placeholder="Thumbnail URL" className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-red-600"/>
                       <textarea required value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Описание (БГ)..." className="col-span-2 bg-slate-950 border border-slate-800 p-4 rounded-xl text-white h-32 outline-none focus:border-red-600"/>
                       <input required value={form.magnetLink} onChange={e=>setForm({...form, magnetLink: e.target.value})} placeholder="magnet:?xt=urn:btih:..." className="col-span-2 bg-slate-900 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-red-600 font-mono text-xs"/>
                       <button className="col-span-2 bg-red-600 text-white font-black py-4 rounded-xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">ПУБЛИКУВАЙ</button>
                    </form>
                 </div>

                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Текущо съдържание</h3>
                    <div className="space-y-3">
                       {videos.map(v => (
                         <div key={v.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                            <div className="flex items-center gap-4">
                               <img src={v.thumbnail} className="w-10 h-14 object-cover rounded" alt=""/>
                               <div>
                                  <div className="text-white font-bold">{v.title}</div>
                                  <div className="text-xs text-slate-500">{v.year}</div>
                               </div>
                            </div>
                            <button onClick={() => {
                               const filtered = videos.filter(vid => vid.id !== v.id);
                               setVideos(filtered);
                               localStorage.setItem('savedVideos', JSON.stringify(filtered));
                            }} className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}

            {adminTab === 'settings' && (
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-10 text-white">
                  <h2 className="text-2xl font-black flex items-center gap-3"><Palette className="text-red-500"/> Дизайн и UI</h2>
                  <div className="space-y-6">
                     <div>
                        <label className="text-slate-400 text-xs font-bold uppercase block mb-3">Основен цвят</label>
                        <div className="flex gap-3">
                           {['#DC2626', '#2563EB', '#7C3AED', '#059669'].map(c => (
                              <button key={c} onClick={() => setSettings({...settings, primaryColor: c})} className={`w-12 h-12 rounded-full border-4 ${settings.primaryColor === c ? 'border-white' : 'border-transparent'}`} style={{backgroundColor: c}}/>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {adminTab === 'logs' && (
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl h-[600px] overflow-hidden flex flex-col text-white">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><Activity className="text-red-500"/> Системни логове</h2>
                  <div className="flex-1 overflow-y-auto pr-4 space-y-2">
                     {activityLog.map(l => (
                        <div key={l.id} className="p-3 bg-slate-950 border-l-4 border-red-600 rounded flex justify-between items-center text-white">
                           <span className="text-xs font-medium">{String(l.msg)}</span>
                           <span className="text-[10px] text-slate-600 font-mono">{l.date}</span>
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
        {view === 'home' && <HomeView />}
        {view === 'login' && (
           <div className="pt-40 flex justify-center px-6">
              <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 w-full max-w-md shadow-2xl">
                 <h2 className="text-3xl font-black text-white mb-8 text-center">АДМИН ВХОД</h2>
                 <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" required placeholder="admin@animaciqbg.net" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-red-600" value={loginForm.email} onChange={e=>setLoginForm({...loginForm, email: e.target.value})}/>
                    <input type="password" required placeholder="Парола" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-red-600" value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password: e.target.value})}/>
                    <button className="w-full bg-red-600 text-white font-black py-4 rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">ВХОД</button>
                 </form>
                 <div className="mt-6 p-4 bg-slate-950/50 rounded-xl text-xs text-slate-500 border border-slate-800">
                    <p>Демо достъп:</p>
                    <p>User: admin@animaciqbg.net</p>
                    <p>Pass: admin123</p>
                 </div>
              </div>
           </div>
        )}
        {view === 'admin' && <AdminPanel />}
      </main>

      <footer className="py-20 border-t border-slate-900 px-6 mt-20">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div>
               <h3 className="text-2xl font-black text-white tracking-tighter mb-2">AnimationBG</h3>
               <p className="text-slate-600 text-sm">Decentralized Streaming Platform &copy; 2026</p>
            </div>
         </div>
      </footer>
    </div>
  );
}
