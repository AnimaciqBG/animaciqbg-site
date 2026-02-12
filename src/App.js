import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { pushToCloud, subscribeToCloud, firebaseEnabled } from './cloudSync';
import { DEFAULT_VIDEOS, DEFAULT_TEXTS, MOCK_ADMIN, SCHEMA_VERSION } from './utils/constants';

// Components
import GlobalStyles from './components/GlobalStyles';
import SiteProtection from './components/SiteProtection';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import VisualEffectLayer from './components/VisualEffectLayer';
import VideoInfoModal from './components/VideoInfoModal';
import PlayerOverlay from './components/PlayerOverlay';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Views
import HomeView from './views/HomeView';
import CollectionsView from './views/CollectionsView';
import ContactView from './views/ContactView';
import LoginView from './views/LoginView';
import AdminView from './views/AdminView';

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
  const [likedVideos, setLikedVideos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('v14_liked') || '[]'); } catch { return []; }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [videoInfoModal, setVideoInfoModal] = useState(null);
  const [trendingIndex, setTrendingIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const VIDEOS_PER_PAGE = 12;
  const likeCooldownRef = useRef({});
  const inactivityTimerRef = useRef(null);

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
    showTrending: true, showRecentlyAdded: true, cardStyle: 'rounded',
    heroSize: 'large', likeSoundEnabled: true,
    version: SCHEMA_VERSION
  });

  // Cloud Sync refs
  const cloudUpdateRef = useRef(false);
  const pushTimerRef = useRef(null);
  const initialSyncDoneRef = useRef(!firebaseEnabled);
  // eslint-disable-next-line no-unused-vars
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

      if (!initialSyncDoneRef.current) {
        console.log('[CloudSync] Initial sync complete - cloud data loaded');
        initialSyncDoneRef.current = true;
      }

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
    localStorage.setItem('v14_videos', JSON.stringify(videos));
    localStorage.setItem('v14_inquiries', JSON.stringify(inquiries));
    localStorage.setItem('v14_collections', JSON.stringify(collections));
    localStorage.setItem('v14_settings', JSON.stringify(settings));

    if (firebaseEnabled && !cloudUpdateRef.current && initialSyncDoneRef.current) {
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
      pushTimerRef.current = setTimeout(() => {
        pushToCloud({ videos, inquiries, collections, settings });
      }, 1500);
    }
  }, [videos, inquiries, collections, settings]);

  // Persist liked videos
  useEffect(() => {
    localStorage.setItem('v14_liked', JSON.stringify(likedVideos));
  }, [likedVideos]);

  // Auto-logout after 30 min inactivity
  useEffect(() => {
    if (!currentUser) return;
    const resetTimer = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        localStorage.removeItem('adminSession');
        setCurrentUser(null);
        setView('home');
        window.location.hash = '';
      }, 30 * 60 * 1000);
    };
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(ev => window.addEventListener(ev, resetTimer));
    resetTimer();
    return () => {
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [currentUser]);

  // Actions
  const handleLike = useCallback((id) => {
    const now = Date.now();
    if (likeCooldownRef.current[id] && now - likeCooldownRef.current[id] < 2000) {
      return;
    }
    likeCooldownRef.current[id] = now;
    setLikedVideos(prev => {
      if (prev.includes(id)) {
        setVideos(vids => vids.map(v => v.id === id ? { ...v, likes: Math.max((v.likes || 0) - 1, 0) } : v));
        return prev.filter(vid => vid !== id);
      }
      setVideos(vids => vids.map(v => v.id === id ? { ...v, likes: (v.likes || 0) + 1 } : v));
      return [...prev, id];
    });
  }, []);

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
    let result = videos.filter(v => {
      const matchSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCol = activeCollection ? activeCollection.videoIds.includes(v.id) : true;
      const matchFilter = filter === 'all' ? true : v.type === filter;
      return matchSearch && matchCol && matchFilter;
    });
    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => {
        const dA = a.created ? new Date(a.created).getTime() : 0;
        const dB = b.created ? new Date(b.created).getTime() : 0;
        return dB - dA;
      });
    } else if (sortBy === 'most_viewed') {
      result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'most_liked') {
      result = [...result].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return result;
  }, [videos, searchQuery, activeCollection, filter, sortBy]);

  const trendingVideos = useMemo(() => {
    return [...videos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  }, [videos]);

  const recentlyAdded = useMemo(() => {
    return [...videos].sort((a, b) => {
      const dA = a.created ? new Date(a.created).getTime() : 0;
      const dB = b.created ? new Date(b.created).getTime() : 0;
      return dB - dA;
    }).slice(0, 10);
  }, [videos]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCollection, filter, sortBy]);

  // Reset trending index when trending videos change
  useEffect(() => {
    setTrendingIndex(0);
  }, [trendingVideos]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * VIDEOS_PER_PAGE,
    currentPage * VIDEOS_PER_PAGE
  );

  return (
    <div className="bg-[#050505] min-h-screen text-slate-300 overflow-x-hidden font-sans selection:bg-red-500/30">
      <GlobalStyles />
      <SiteProtection />
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

      <VideoInfoModal
        video={videoInfoModal}
        onClose={() => setVideoInfoModal(null)}
        onPlay={(v) => { setActiveVideo(v); setVideoInfoModal(null); }}
        primaryColor={settings.primaryColor}
      />

      <PlayerOverlay
        video={activeVideo}
        settings={settings}
        onClose={() => setActiveVideo(null)}
        onLoad={() => handleStatUpdate(activeVideo?.id, 'views')}
      />

      <Navigation
        view={view}
        setView={setView}
        currentUser={currentUser}
        settings={settings}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={onLogout}
        setAdminTab={setAdminTab}
      />

      <main className="animate-in fade-in duration-1000">
        {view === 'home' && (
          <HomeView
            settings={settings}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            activeCollection={activeCollection}
            setActiveCollection={setActiveCollection}
            trendingVideos={trendingVideos}
            trendingIndex={trendingIndex}
            setTrendingIndex={setTrendingIndex}
            recentlyAdded={recentlyAdded}
            filteredVideos={filteredVideos}
            paginatedVideos={paginatedVideos}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            likedVideos={likedVideos}
            handleLike={handleLike}
            setVideoInfoModal={setVideoInfoModal}
          />
        )}

        {view === 'collections' && (
          <CollectionsView
            collections={collections}
            videos={videos}
            settings={settings}
            collectionSearch={collectionSearch}
            setCollectionSearch={setCollectionSearch}
            setActiveCollection={setActiveCollection}
            setView={setView}
          />
        )}

        {view === 'contact' && (
          <ContactView
            settings={settings}
            showToast={showToast}
            setInquiries={setInquiries}
          />
        )}

        {view === 'login' && (
          <LoginView
            settings={settings}
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            setCurrentUser={setCurrentUser}
            setView={setView}
            addLog={addLog}
            showToast={showToast}
          />
        )}

        {view === 'admin' && currentUser && (
          <AdminView
            currentUser={currentUser}
            settings={settings}
            setSettings={setSettings}
            videos={videos}
            setVideos={setVideos}
            inquiries={inquiries}
            setInquiries={setInquiries}
            collections={collections}
            setCollections={setCollections}
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            activityLog={activityLog}
            setActivityLog={setActivityLog}
            editingVideoId={editingVideoId}
            setEditingVideoId={setEditingVideoId}
            editingCollection={editingCollection}
            setEditingCollection={setEditingCollection}
            handleVideoAction={handleVideoAction}
            addLog={addLog}
            showToast={showToast}
            setDeleteConfirm={setDeleteConfirm}
          />
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}
