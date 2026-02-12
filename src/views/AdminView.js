import React, { useState } from 'react';
import {
  Film, Eye, Mail, ThumbsUp, Heart, Clock, Activity,
  Settings, Layers, Layout, Type, Plus, Edit, Trash2,
  Check, Search, Calendar, Database, BarChart3,
  MessageSquare, FileDown, FileUp, Globe, Palette,
  Stamp, Volume2, Lock, Info, ShieldAlert, X
} from 'lucide-react';
import { SCHEMA_VERSION } from '../utils/constants';
import { playLikeSound } from '../utils/sounds';

const AdminView = ({
  currentUser, settings, setSettings, videos, setVideos,
  inquiries, setInquiries, collections, setCollections,
  adminTab, setAdminTab, activityLog, setActivityLog,
  editingVideoId, setEditingVideoId, editingCollection, setEditingCollection,
  handleVideoAction, addLog, showToast, setDeleteConfirm
}) => {
  const [adminCatalogSearch, setAdminCatalogSearch] = useState('');
  const [selectedVideos, setSelectedVideos] = useState([]);

  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-10 sm:pt-32 lg:pt-40 max-w-[1700px] mx-auto flex flex-col xl:flex-row gap-6 sm:gap-8 lg:gap-16">
      {/* Sidebar */}
      <div className="xl:w-80 shrink-0 flex flex-col gap-2 sm:gap-3">
         <div className="bg-slate-900/50 p-4 sm:p-5 lg:p-6 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-white/5 mb-4 sm:mb-6">
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
          {id: 'catalog', icon: <Film size={18}/>, label: 'Каталог', badge: videos.length},
          {id: 'collections', icon: <Layers size={18}/>, label: 'Колекции'},
          {id: 'inquiries', icon: <Mail size={18}/>, label: 'Запитвания', badge: inquiries.filter(i => !i.status || i.status === 'unread').length},
          {id: 'settings', icon: <Settings size={18}/>, label: 'Настройки'},
          {id: 'texts', icon: <Type size={18}/>, label: 'Текстове'},
          {id: 'logs', icon: <Activity size={18}/>, label: 'Логове'}
         ].map(tab => (
            <button key={tab.id} onClick={() => setAdminTab(tab.id)}
              className={`w-full text-left p-4 sm:p-5 lg:p-6 rounded-[1.5rem] sm:rounded-[1.75rem] lg:rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center gap-3 sm:gap-4 transition-all relative ${adminTab === tab.id ? 'text-white shadow-xl' : 'text-slate-500 hover:bg-white/5'}`}
              style={adminTab === tab.id ? { backgroundColor: settings.primaryColor, boxShadow: `0 10px 30px ${settings.primaryColor}30` } : {}}>
               {tab.icon} {tab.label}
               {tab.badge > 0 && (<span className={`ml-auto text-[9px] font-black px-2.5 py-1 rounded-full ${tab.id === 'inquiries' && adminTab !== tab.id ? 'bg-rose-500 text-white' : 'bg-white/10 text-slate-400'}`}>{tab.badge}</span>)}
            </button>
         ))}
      </div>

      {/* Content */}
      <div className="flex-1 pb-16 sm:pb-20 lg:pb-32">
         {adminTab === 'dashboard' && (
            <div className="space-y-12">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8">
                  {[
                    { label: 'Общо Видеа', val: videos.length, icon: <Film className="text-blue-500"/> },
                    { label: 'Общо Гледания', val: videos.reduce((a,b)=>a+(b.views||0), 0), icon: <Eye className="text-emerald-500"/> },
                    { label: 'Запитвания', val: inquiries.length, icon: <Mail className="text-yellow-500"/> },
                    { label: 'Лайкове', val: videos.reduce((a,b)=>a+(b.likes||0), 0), icon: <ThumbsUp className="text-rose-500"/> }
                  ].map((s, i) => (
                    <div key={i} className="bg-slate-900 p-4 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-white/5 shadow-2xl">
                       <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-white/5 rounded-2xl">{s.icon}</div>
                         <BarChart3 size={16} className="text-slate-700"/>
                       </div>
                       <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1">{s.val.toLocaleString()}</h4>
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                    </div>
                  ))}
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  <button onClick={() => { setAdminTab('catalog'); setEditingVideoId(null); window.scrollTo(0,0); }} className="p-4 sm:p-5 lg:p-6 bg-slate-900 rounded-[1.5rem] sm:rounded-[1.75rem] lg:rounded-[2rem] border border-white/5 hover:border-white/20 transition-all flex items-center gap-3 sm:gap-4 group">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors"><Plus size={20} className="text-emerald-500"/></div>
                    <div className="text-left"><p className="text-white font-black text-sm">Добави Видео</p><p className="text-slate-600 text-[10px] font-bold uppercase">Към каталога</p></div>
                  </button>
                  <button onClick={() => setAdminTab('inquiries')} className="p-4 sm:p-5 lg:p-6 bg-slate-900 rounded-[1.5rem] sm:rounded-[1.75rem] lg:rounded-[2rem] border border-white/5 hover:border-white/20 transition-all flex items-center gap-3 sm:gap-4 group">
                    <div className="p-3 rounded-2xl bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors"><MessageSquare size={20} className="text-yellow-500"/></div>
                    <div className="text-left"><p className="text-white font-black text-sm">Запитвания</p><p className="text-slate-600 text-[10px] font-bold uppercase">{inquiries.filter(i => !i.status || i.status === 'unread').length} непрочетени</p></div>
                  </button>
                  <button onClick={() => setAdminTab('collections')} className="p-4 sm:p-5 lg:p-6 bg-slate-900 rounded-[1.5rem] sm:rounded-[1.75rem] lg:rounded-[2rem] border border-white/5 hover:border-white/20 transition-all flex items-center gap-3 sm:gap-4 group">
                    <div className="p-3 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors"><Layers size={20} className="text-blue-500"/></div>
                    <div className="text-left"><p className="text-white font-black text-sm">Колекции</p><p className="text-slate-600 text-[10px] font-bold uppercase">{collections.length} създадени</p></div>
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <div className="bg-slate-900 p-5 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <h3 className="text-base sm:text-lg font-black text-white mb-4 sm:mb-6 flex items-center gap-3"><Eye size={18} className="text-emerald-500"/> Топ 5 Най-гледани</h3>
                    <div className="space-y-3">
                      {[...videos].sort((a,b) => (b.views||0) - (a.views||0)).slice(0, 5).map((v, i) => (
                        <div key={v.id} className="flex items-center gap-4 p-3 bg-black/30 rounded-xl">
                          <span className="text-lg font-black text-slate-600 w-8 text-center">{i+1}</span>
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"><img src={v.thumbnail} className="w-full h-full object-cover" alt=""/></div>
                          <div className="flex-1 min-w-0"><p className="text-white font-bold text-sm truncate">{v.title}</p></div>
                          <span className="text-emerald-400 text-xs font-black">{(v.views||0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-900 p-5 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <h3 className="text-base sm:text-lg font-black text-white mb-4 sm:mb-6 flex items-center gap-3"><Heart size={18} className="text-rose-500"/> Топ 5 Най-харесвани</h3>
                    <div className="space-y-3">
                      {[...videos].sort((a,b) => (b.likes||0) - (a.likes||0)).slice(0, 5).map((v, i) => (
                        <div key={v.id} className="flex items-center gap-4 p-3 bg-black/30 rounded-xl">
                          <span className="text-lg font-black text-slate-600 w-8 text-center">{i+1}</span>
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"><img src={v.thumbnail} className="w-full h-full object-cover" alt=""/></div>
                          <div className="flex-1 min-w-0"><p className="text-white font-bold text-sm truncate">{v.title}</p></div>
                          <span className="text-rose-400 text-xs font-black">{(v.likes||0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
               <div className="bg-slate-900 p-5 sm:p-7 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] border border-white/5 shadow-3xl">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-6 sm:mb-8 lg:mb-10 flex items-center gap-3 sm:gap-4"><Activity style={{ color: settings.primaryColor }} /> Последна Активност</h2>
                  <div className="space-y-4">
                    {activityLog.length === 0 && <p className="text-center py-10 text-slate-700 font-black uppercase tracking-widest text-sm">Няма скорошна активност</p>}
                    {activityLog.slice(0, 5).map(l => (
                       <div key={l.id} className="p-5 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center"><Clock size={16} className="text-slate-500" /></div>
                            <div><p className="text-sm font-bold text-white">{l.msg}</p><p className="text-[10px] text-slate-600 uppercase font-black">{l.date}</p></div>
                          </div>
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${l.type === 'error' ? 'text-red-500 border-red-500/20' : 'text-blue-500 border-blue-500/20'}`}>{l.type.toUpperCase()}</span>
                       </div>
                    ))}
                  </div>
               </div>
            </div>
         )}

         {adminTab === 'catalog' && (
            <div className="space-y-12">
               <div className="bg-slate-900 p-4 sm:p-7 lg:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[3.5rem] border border-white/5 shadow-3xl">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-6 sm:mb-8 lg:mb-10">{editingVideoId ? "Редактиране на Видео" : "Добавяне на Ново Видео"}</h2>
                  <form onSubmit={e => {
                     e.preventDefault(); const d = new FormData(e.target);
                     const vData = { title: d.get('title'), year: d.get('year'), streamType: d.get('type'), embedUrl: d.get('embed'), downloadUrl: d.get('download'), thumbnail: d.get('thumb'), description: d.get('desc'), type: d.get('category'), duration: d.get('duration'), audioType: d.get('audioType') };
                     if (editingVideoId) handleVideoAction(editingVideoId, 'edit', vData); else handleVideoAction(null, 'add', vData);
                     e.target.reset();
                  }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                     <div className="lg:col-span-2 space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-3 sm:ml-4">Заглавие</label><input name="title" required defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.title : ""} className="w-full bg-black/40 border border-white/5 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}}/></div>
                     <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Година</label><input name="year" required defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.year : ""} className="w-full bg-black/40 border border-white/5 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none"/></div>
                     <div className="lg:col-span-2 space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Thumbnail URL</label><input name="thumb" required defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.thumbnail : ""} className="w-full bg-black/40 border border-white/5 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none"/></div>
                     <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Категория</label><select name="category" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.type : "movie"} className="w-full bg-black/40 border border-white/5 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none"><option value="movie">Филм</option><option value="series">Сериал</option><option value="short">Кратка Анимация</option></select></div>
                     <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Тип Стрийм</label><select name="type" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.streamType : "embed"} className="w-full bg-black/40 border border-white/5 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none"><option value="embed">Стрийминг (Embed)</option><option value="download">Изтегляне (Link)</option></select></div>
                     <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Embed URL</label><input name="embed" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.embedUrl : ""} className="w-full bg-black/40 border border-white/5 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none"/></div>
                     <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Времетраене</label><input name="duration" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.duration : ""} placeholder="напр. 95 min" className="w-full bg-black/40 border border-white/5 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none"/></div>
                     <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Аудио Тип</label><select name="audioType" defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.audioType : "bg_audio"} className="w-full bg-black/40 border border-white/5 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none"><option value="bg_audio">БГ Аудио</option><option value="subtitles">Субтитри</option></select></div>
                     <div className="lg:col-span-3 space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Описание</label><textarea name="desc" rows={4} defaultValue={editingVideoId ? videos.find(v=>v.id===editingVideoId)?.description : ""} className="w-full bg-black/40 border border-white/5 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none resize-none"/></div>
                     <div className="lg:col-span-3 pt-4 sm:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                       <button type="submit" className="flex-1 py-5 sm:py-6 lg:py-7 text-white font-black rounded-2xl sm:rounded-3xl uppercase tracking-[0.15em] sm:tracking-[0.3em] text-sm sm:text-base shadow-2xl hover:scale-[1.02] active:scale-95 transition-all" style={{ backgroundColor: settings.primaryColor }}>{editingVideoId ? "ЗАПАЗИ ПРОМЕНИТЕ" : "ДОБАВИ В КАТАЛОГА"}</button>
                       {editingVideoId && (<button type="button" onClick={() => setEditingVideoId(null)} className="px-6 sm:px-10 py-5 sm:py-6 lg:py-7 bg-white/5 text-white font-black rounded-2xl sm:rounded-3xl uppercase tracking-widest text-sm sm:text-base hover:bg-white/10 transition-all">ОТКАЗ</button>)}
                     </div>
                  </form>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 px-4 gap-4">
                    <h3 className="text-xl font-black text-white">Инвентар ({videos.length})</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16}/><input value={adminCatalogSearch} onChange={e => setAdminCatalogSearch(e.target.value)} placeholder="Търси във видеа..." className="bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none focus:ring-1 w-56" style={{'--tw-ring-color': settings.primaryColor}}/></div>
                      {selectedVideos.length > 0 && (<button onClick={() => { if (window.confirm(`Изтриване на ${selectedVideos.length} видеа?`)) { setVideos(prev => prev.filter(v => !selectedVideos.includes(v.id))); addLog(`Масово изтриване: ${selectedVideos.length} видеа`, 'warning'); showToast(`${selectedVideos.length} видеа са изтрити!`, 'info'); setSelectedVideos([]); }}} className="px-4 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"><Trash2 size={14}/> Изтрий ({selectedVideos.length})</button>)}
                      {selectedVideos.length > 0 && (<button onClick={() => setSelectedVideos([])} className="px-4 py-2.5 bg-white/5 text-slate-400 rounded-xl text-xs font-black uppercase hover:text-white transition-colors">Откажи</button>)}
                    </div>
                  </div>
                  {videos.filter(v => v.title.toLowerCase().includes(adminCatalogSearch.toLowerCase())).map(v => (
                     <div key={v.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 lg:p-6 rounded-[1.5rem] sm:rounded-[1.75rem] lg:rounded-[2rem] border transition-all hover:bg-slate-800/50 group gap-4 ${selectedVideos.includes(v.id) ? 'bg-slate-800/70 border-white/20' : 'bg-slate-900/50 border-white/5'}`}>
                        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 min-w-0">
                          <button onClick={(e) => { e.stopPropagation(); setSelectedVideos(prev => prev.includes(v.id) ? prev.filter(x => x !== v.id) : [...prev, v.id]); }} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedVideos.includes(v.id) ? 'border-white/40 bg-white/20' : 'border-white/10 hover:border-white/30'}`}>{selectedVideos.includes(v.id) && <Check size={14} className="text-white"/>}</button>
                          <div className="relative w-16 h-20 rounded-2xl overflow-hidden shadow-xl"><img src={v.thumbnail} className="w-full h-full object-cover" alt=""/><div className="absolute inset-0 bg-black/20" /></div>
                          <div className="min-w-0">
                            <h4 className="text-white font-black text-sm sm:text-base lg:text-lg group-hover:text-red-500 transition-colors truncate">{v.title}</h4>
                            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 flex-wrap">
                              <span className="flex items-center gap-1"><Calendar size={12}/> {v.year}</span>
                              <span className="flex items-center gap-1"><Eye size={12}/> {v.views}</span>
                              <span className={`px-2 py-0.5 rounded-md ${v.streamType === 'download' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>{v.streamType}</span>
                              {v.audioType && <span className={`px-2 py-0.5 rounded-md ${v.audioType === 'bg_audio' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'}`}>{v.audioType === 'bg_audio' ? 'БГ Аудио' : 'Субтитри'}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                           <button onClick={() => { setEditingVideoId(v.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all shadow-lg"><Edit size={18}/></button>
                           <button onClick={() => setDeleteConfirm({ open: true, id: v.id, type: 'video' })} className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-white/5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl sm:rounded-2xl transition-all shadow-lg"><Trash2 size={18}/></button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {adminTab === 'settings' && (
            <div className="bg-slate-900 p-4 sm:p-7 lg:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[3.5rem] border border-white/5 shadow-3xl space-y-10 sm:space-y-12 lg:space-y-16 text-white">
               <section className="space-y-6 sm:space-y-8 lg:space-y-10">
                 <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-6 sm:mb-8 lg:mb-10 flex items-center gap-3 sm:gap-4"><Database style={{ color: settings.primaryColor }}/> Cloud Sync & Backup</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    <button onClick={() => { const blob = new Blob([JSON.stringify({ version: SCHEMA_VERSION, videos, collections, inquiries, settings, exportDate: new Date() }, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `animationbg_v14_backup_${Date.now()}.json`; link.click(); showToast("Архивът е готов!", "success"); }} className="flex flex-col items-center gap-4 sm:gap-6 p-6 sm:p-8 lg:p-12 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] bg-emerald-600 hover:bg-emerald-700 transition-all shadow-2xl group">
                      <div className="p-5 bg-white/20 rounded-full group-hover:scale-110 transition-transform"><FileDown size={40}/></div>
                      <div className="text-center"><span className="block font-black text-xl tracking-widest uppercase">ЕКСПОРТ ДАННИ</span><span className="text-[10px] font-bold opacity-60">Свали пълен архив на платформата</span></div>
                    </button>
                    <label className="flex flex-col items-center gap-4 sm:gap-6 p-6 sm:p-8 lg:p-12 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] bg-blue-600 hover:bg-blue-700 transition-all shadow-2xl group cursor-pointer">
                       <input type="file" accept=".json" className="hidden" onChange={(e) => { const file = e.target.files[0]; if(!file) return; const reader = new FileReader(); reader.onload = (ev) => { try { const data = JSON.parse(ev.target.result); if (data.version !== SCHEMA_VERSION) { if (!window.confirm("Версията на архива е различна! Продължаване?")) return; } if(window.confirm("ВНИМАНИЕ: Това ще заличи текущите данни! Потвърди импорт?")) { setVideos(data.videos || []); setSettings(prev => ({ ...prev, ...(data.settings || {}) })); setCollections(data.collections || []); setInquiries(data.inquiries || []); showToast("Данните са синхронизирани!", "success"); setTimeout(() => window.location.reload(), 1500); } } catch { showToast("Невалиден файл!", "error"); } }; reader.readAsText(file); }} />
                       <div className="p-5 bg-white/20 rounded-full group-hover:scale-110 transition-transform"><FileUp size={40}/></div>
                       <div className="text-center"><span className="block font-black text-xl tracking-widest uppercase">ИМПОРТ ДАННИ</span><span className="text-[10px] font-bold opacity-60">Зареди данни от външен архив</span></div>
                    </label>
                 </div>
               </section>
               <section className="space-y-6 sm:space-y-8 lg:space-y-10 border-t border-white/5 pt-8 sm:pt-12 lg:pt-16">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-6 sm:mb-8 lg:mb-10 flex items-center gap-3 sm:gap-4"><Globe style={{ color: settings.primaryColor }}/> Име и Лого на Сайта</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10">
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Име на Платформата</label><input value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 rounded-2xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}}/></div>
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">URL на Логото</label><input value={settings.logoUrl} onChange={e => setSettings({...settings, logoUrl: e.target.value})} placeholder="https://example.com/logo.png" className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 rounded-2xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}}/></div>
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Използвай Лого</label><button onClick={() => setSettings({...settings, useLogo: !settings.useLogo})} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${settings.useLogo ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>{settings.useLogo ? 'Активно' : 'Неактивно'}</button></div>
                     {settings.useLogo && settings.logoUrl && (<div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Преглед</label><div className="bg-black/40 border border-white/10 p-6 rounded-2xl flex items-center justify-center"><img src={settings.logoUrl} alt="Logo Preview" className="h-12 w-auto object-contain"/></div></div>)}
                  </div>
               </section>
               <section className="space-y-6 sm:space-y-8 lg:space-y-10 border-t border-white/5 pt-8 sm:pt-12 lg:pt-16">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-6 sm:mb-8 lg:mb-10 flex items-center gap-3 sm:gap-4"><Palette style={{ color: settings.primaryColor }}/> Визуален Дизайн</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10">
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Основен Цвят на Платформата</label><div className="flex gap-4"><input type="color" value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="w-20 h-16 bg-transparent border-0 rounded-2xl cursor-pointer shadow-xl"/><input value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="flex-1 bg-black/40 border border-white/10 p-4 rounded-2xl text-white font-mono uppercase text-center focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}}/></div></div>
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Визуален Ефект (Particles)</label><select value={settings.visualEffect} onChange={e => setSettings({...settings, visualEffect: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-white outline-none"><option value="none">Без ефект</option><option value="snow">Сняг (Зима)</option><option value="rain">Дъжд (Есен)</option><option value="sakura">Сакура (Пролет)</option><option value="fireflies">Светулки (Лято)</option></select></div>
                  </div>
               </section>
               <section className="space-y-6 sm:space-y-8 lg:space-y-10 border-t border-white/5 pt-8 sm:pt-12 lg:pt-16">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-6 sm:mb-8 lg:mb-10 flex items-center gap-3 sm:gap-4"><Stamp style={{ color: settings.primaryColor }}/> Воден Знак (Watermark)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10">
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Воден Знак Активен</label><button onClick={() => setSettings({...settings, watermarkEnabled: !settings.watermarkEnabled})} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${settings.watermarkEnabled ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>{settings.watermarkEnabled ? 'Активно' : 'Неактивно'}</button></div>
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Текст на Водния Знак</label><input value={settings.watermarkText} onChange={e => setSettings({...settings, watermarkText: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 rounded-2xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}}/></div>
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Позиция</label><select value={settings.watermarkPosition} onChange={e => setSettings({...settings, watermarkPosition: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 rounded-2xl text-white outline-none"><option value="top-right">Горе Вдясно</option><option value="top-left">Горе Вляво</option></select></div>
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Прозрачност: {settings.watermarkOpacity}%</label><input type="range" min="5" max="100" value={settings.watermarkOpacity} onChange={e => setSettings({...settings, watermarkOpacity: parseInt(e.target.value)})} className="w-full accent-current" style={{ color: settings.primaryColor }}/></div>
                  </div>
               </section>
               <section className="space-y-6 sm:space-y-8 lg:space-y-10 border-t border-white/5 pt-8 sm:pt-12 lg:pt-16">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-6 sm:mb-8 lg:mb-10 flex items-center gap-3 sm:gap-4"><Layout style={{ color: settings.primaryColor }}/> Оформление на Сайта</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10">
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Показвай "В Тренда"</label><button onClick={() => setSettings({...settings, showTrending: !settings.showTrending})} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${settings.showTrending !== false ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>{settings.showTrending !== false ? 'Видимо' : 'Скрито'}</button></div>
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Показвай "Наскоро Добавени"</label><button onClick={() => setSettings({...settings, showRecentlyAdded: !settings.showRecentlyAdded})} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${settings.showRecentlyAdded !== false ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>{settings.showRecentlyAdded !== false ? 'Видимо' : 'Скрито'}</button></div>
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Стил на Картите</label><div className="flex gap-3">{[{id:'rounded',label:'Заоблени'},{id:'square',label:'Квадратни'},{id:'pill',label:'Капсула'}].map(s=>(<button key={s.id} onClick={()=>setSettings({...settings,cardStyle:s.id})} className={`flex-1 px-4 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${settings.cardStyle===s.id?'text-white shadow-lg':'bg-white/5 text-slate-500 hover:bg-white/10'}`} style={settings.cardStyle===s.id?{backgroundColor:settings.primaryColor}:{}}>{s.label}</button>))}</div></div>
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Размер на Заглавието</label><div className="flex gap-3">{[{id:'small',label:'Малко'},{id:'medium',label:'Средно'},{id:'large',label:'Голямо'}].map(s=>(<button key={s.id} onClick={()=>setSettings({...settings,heroSize:s.id})} className={`flex-1 px-4 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${(settings.heroSize||'large')===s.id?'text-white shadow-lg':'bg-white/5 text-slate-500 hover:bg-white/10'}`} style={(settings.heroSize||'large')===s.id?{backgroundColor:settings.primaryColor}:{}}>{s.label}</button>))}</div></div>
                  </div>
               </section>
               <section className="space-y-6 sm:space-y-8 lg:space-y-10 border-t border-white/5 pt-8 sm:pt-12 lg:pt-16">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-6 sm:mb-8 lg:mb-10 flex items-center gap-3 sm:gap-4"><Volume2 style={{ color: settings.primaryColor }}/> Звук и Интеракции</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10">
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Звук при Лайк</label><div className="flex items-center gap-4"><button onClick={() => setSettings({...settings, likeSoundEnabled: !settings.likeSoundEnabled})} className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${settings.likeSoundEnabled !== false ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>{settings.likeSoundEnabled !== false ? 'Активно' : 'Неактивно'}</button><button onClick={() => playLikeSound()} className="px-4 py-4 rounded-2xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all text-xs font-black uppercase tracking-widest">Тест</button></div></div>
                  </div>
               </section>
               <section className="space-y-6 sm:space-y-8 lg:space-y-10 border-t border-white/5 pt-8 sm:pt-12 lg:pt-16">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-6 sm:mb-8 lg:mb-10 flex items-center gap-3 sm:gap-4"><Lock style={{ color: settings.primaryColor }}/> Смяна на Парола</h2>
                  <form onSubmit={e => { e.preventDefault(); const d = new FormData(e.target); const curPass = d.get('currentPass'); const newPass = d.get('newPass'); const confirmPass = d.get('confirmPass'); const savedPass = localStorage.getItem('v14_adminPass') || 'admin123'; if (curPass !== savedPass) { showToast('Грешна текуща парола!', 'error'); return; } if (newPass.length < 6) { showToast('Паролата трябва да е поне 6 символа!', 'error'); return; } if (newPass !== confirmPass) { showToast('Паролите не съвпадат!', 'error'); return; } localStorage.setItem('v14_adminPass', newPass); addLog('Паролата е сменена успешно', 'success'); showToast('Паролата е сменена успешно!', 'success'); e.target.reset(); }} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Текуща Парола</label><input name="currentPass" type="password" required className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 rounded-2xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}}/></div>
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Нова Парола</label><input name="newPass" type="password" required minLength={6} className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 rounded-2xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}}/></div>
                     <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Потвърди Паролата</label><input name="confirmPass" type="password" required minLength={6} className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 rounded-2xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}}/></div>
                     <div className="md:col-span-3"><button type="submit" className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm text-white hover:scale-[1.02] active:scale-95 transition-all shadow-lg" style={{ backgroundColor: settings.primaryColor }}>Смени Паролата</button></div>
                  </form>
               </section>
            </div>
         )}

         {adminTab === 'inquiries' && (
            <div className="bg-slate-900 p-4 sm:p-7 lg:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[3.5rem] border border-white/5 shadow-3xl space-y-6 sm:space-y-8 lg:space-y-10">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-3 sm:gap-4"><MessageSquare style={{ color: settings.primaryColor }} /> Входяща Кутия</h2>
                  <div className="flex items-center gap-3">
                    <span className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 border border-white/10 uppercase tracking-widest">{inquiries.length} СЪОБЩЕНИЯ</span>
                    {inquiries.length > 0 && (<button onClick={() => { const csv = ['Име,Имейл,Категория,Съобщение,Дата,Статус', ...inquiries.map(i => `"${(i.name||'').replace(/"/g,'""')}","${(i.email||'').replace(/"/g,'""')}","${i.category||'other'}","${(i.message||'').replace(/"/g,'""')}","${i.date||''}","${i.status||'unread'}"`)].join('\n'); const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `inquiries_${Date.now()}.csv`; link.click(); showToast('Запитванията са експортирани!', 'success'); }} className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"><FileDown size={14}/> CSV</button>)}
                  </div>
               </div>
               {inquiries.length === 0 ? (<div className="py-32 text-center opacity-20"><Mail size={80} className="mx-auto mb-6" /><p className="text-xl font-black uppercase tracking-widest">Няма нови запитвания</p></div>) : (
                  <div className="grid grid-cols-1 gap-6">
                     {inquiries.map(inq => (
                        <div key={inq.id} className={`border p-4 sm:p-6 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] hover:border-white/20 transition-all shadow-xl ${!inq.status || inq.status === 'unread' ? 'bg-black/40 border-white/10' : 'bg-black/20 border-white/5'}`}>
                           <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-4 sm:mb-6 lg:mb-8">
                              <div className="flex gap-3 sm:gap-4 lg:gap-5 items-center">
                                 <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center font-black text-xl sm:text-2xl text-white flex-shrink-0 ${!inq.status || inq.status === 'unread' ? 'bg-slate-700' : 'bg-slate-800'}`}>{inq.name[0]}</div>
                                 <div>
                                    <h4 className="text-base sm:text-lg lg:text-xl font-black text-white flex items-center gap-2 sm:gap-3">{inq.name}{(!inq.status || inq.status === 'unread') && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0"/>}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <p className="text-slate-500 font-bold flex items-center gap-2"><Mail size={14} style={{ color: settings.primaryColor }}/> {inq.email}</p>
                                      {inq.category && (<span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${inq.category === 'bug' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : inq.category === 'suggestion' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{inq.category === 'bug' ? 'БЪГ' : inq.category === 'suggestion' ? 'ПРЕДЛОЖЕНИЕ' : 'ДРУГО'}</span>)}
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-3 self-end sm:self-auto">
                                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{inq.date}</span>
                                 <div className="flex items-center gap-2">
                                   <select value={inq.status || 'unread'} onChange={e => setInquiries(prev => prev.map(x => x.id === inq.id ? {...x, status: e.target.value} : x))} className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-white outline-none"><option value="unread">Ново</option><option value="read">Прочетено</option><option value="replied">Отговорено</option></select>
                                   <button onClick={() => { setInquiries(prev => prev.filter(x => x.id !== inq.id)); showToast("Съобщението е изтрито.", "warning"); }} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                                 </div>
                              </div>
                           </div>
                           <div className="bg-slate-950/50 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl text-slate-300 text-sm sm:text-base leading-relaxed font-medium italic border border-white/5">"{inq.message}"</div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}

         {adminTab === 'texts' && (
            <div className="bg-slate-900 p-4 sm:p-7 lg:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[3.5rem] border border-white/5 shadow-3xl space-y-6 sm:space-y-8 lg:space-y-12 text-white">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black flex items-center gap-3 sm:gap-4"><Type style={{ color: settings.primaryColor }}/> Управление на Текстове</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10">
                   {Object.keys(settings.texts).map(key => (
                      <div key={key} className="space-y-3 sm:space-y-4 p-4 sm:p-6 lg:p-8 bg-black/40 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all">
                         <label className="text-[11px] uppercase font-black text-slate-500 ml-2 tracking-[0.2em]">{key.replace(/([A-Z])/g, ' $1')}</label>
                         <textarea value={settings.texts[key]} rows={2} onChange={e => { const nt = {...settings.texts, [key]: e.target.value}; setSettings(prev=>({...prev, texts: nt})); }} className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-white text-sm outline-none focus:ring-2 resize-none" style={{'--tw-ring-color': settings.primaryColor}}/>
                      </div>
                   ))}
                </div>
            </div>
         )}

         {adminTab === 'logs' && (
            <div className="bg-slate-900 p-4 sm:p-7 lg:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[3.5rem] border border-white/5 shadow-3xl h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden flex flex-col text-white">
               <div className="flex justify-between items-center mb-6 sm:mb-8 lg:mb-10">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black flex items-center gap-3 sm:gap-4"><Activity style={{ color: settings.primaryColor }}/> Системни Логове</h2>
                  <button onClick={() => setActivityLog([])} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-500 transition-colors">Изчисти всички</button>
               </div>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-2">
                  {activityLog.length === 0 ? (<p className="text-center py-20 text-slate-700 font-black uppercase tracking-widest">Няма активни логове</p>) : activityLog.map(l => (
                     <div key={l.id} className="p-6 bg-black/40 border-l-4 rounded-2xl flex justify-between items-center shadow-lg hover:bg-black/60 transition-all" style={{ borderLeftColor: l.type === 'error' ? '#EF4444' : (l.type === 'success' ? '#10B981' : settings.primaryColor) }}>
                        <div className="flex items-center gap-5">
                           <div className="p-2 bg-white/5 rounded-lg">{l.type === 'error' ? <ShieldAlert size={16} className="text-rose-500"/> : (l.type === 'success' ? <Check size={16} className="text-emerald-500"/> : <Info size={16} className="text-blue-500"/>)}</div>
                           <span className="text-sm font-bold tracking-tight">{l.msg}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tabular-nums">{l.date}</span>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {adminTab === 'collections' && (
           <div className="bg-slate-900 p-4 sm:p-7 lg:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[3.5rem] border border-white/5 shadow-3xl space-y-6 sm:space-y-8 lg:space-y-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-3 sm:gap-4"><Layers style={{ color: settings.primaryColor }} /> Управление на Колекции</h2>
              <form onSubmit={e => { e.preventDefault(); const d = new FormData(e.target); const selected = Array.from(e.target.vids.selectedOptions).map(o => o.value); if (editingCollection) { setCollections(prev => prev.map(c => c.id === editingCollection.id ? { ...c, title: d.get('title'), description: d.get('desc'), videoIds: selected } : c)); showToast("Колекцията е обновена!", "success"); setEditingCollection(null); } else { const newCol = { id: Date.now(), title: d.get('title'), description: d.get('desc'), videoIds: selected }; setCollections(prev => [...prev, newCol]); showToast("Колекцията е създадена!", "success"); } e.target.reset(); }} className="space-y-4 sm:space-y-6 lg:space-y-8 bg-black/40 p-4 sm:p-6 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] border border-white/5">
                 {editingCollection && (<div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-2xl border border-white/10"><span className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><Edit size={16} style={{ color: settings.primaryColor }}/> Редактиране: {editingCollection.title}</span><button type="button" onClick={() => setEditingCollection(null)} className="p-2 text-slate-400 hover:text-white transition-colors"><X size={18}/></button></div>)}
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Име на Колекцията</label><input name="title" required placeholder="напр. Класически Анимации" defaultValue={editingCollection?.title || ''} key={editingCollection?.id || 'new'} className="w-full bg-slate-950 border border-white/5 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none focus:ring-2" style={{'--tw-ring-color': settings.primaryColor}}/></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Избери Видеа (Shift+Click)</label><select name="vids" multiple required defaultValue={editingCollection?.videoIds || []} key={(editingCollection?.id || 'new') + '-vids'} className="w-full bg-slate-950 border border-white/5 p-4 rounded-3xl text-white h-48 outline-none focus:ring-2 no-scrollbar" style={{'--tw-ring-color': settings.primaryColor}}>{videos.map(v => <option key={v.id} value={v.id} className="p-3 border-b border-white/5 text-sm font-bold">{v.title}</option>)}</select></div>
                 </div>
                 <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-4">Описание</label><textarea name="desc" placeholder="Кратко представяне на колекцията..." defaultValue={editingCollection?.description || ''} key={(editingCollection?.id || 'new') + '-desc'} className="w-full bg-slate-950 border border-white/5 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none h-32 resize-none"/></div>
                 <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                   <button type="submit" className="flex-1 py-5 sm:py-6 lg:py-7 text-white font-black rounded-2xl sm:rounded-3xl uppercase tracking-[0.15em] sm:tracking-[0.3em] text-sm sm:text-base shadow-2xl hover:scale-[1.02] active:scale-95 transition-all" style={{ backgroundColor: settings.primaryColor }}>{editingCollection ? 'ЗАПАЗИ ПРОМЕНИТЕ' : 'СЪЗДАЙ КОЛЕКЦИЯ'}</button>
                   {editingCollection && (<button type="button" onClick={() => setEditingCollection(null)} className="px-6 sm:px-10 py-5 sm:py-6 lg:py-7 text-slate-400 font-black rounded-2xl sm:rounded-3xl uppercase tracking-[0.15em] sm:tracking-[0.3em] text-sm sm:text-base border border-white/10 hover:bg-slate-800 transition-all">ОТКАЗ</button>)}
                 </div>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                 {collections.map(col => (
                    <div key={col.id} className="p-4 sm:p-6 lg:p-8 bg-black/20 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-white/5 flex flex-col justify-between group">
                       <div>
                          <div className="flex justify-between items-start mb-4">
                             <h4 className="text-xl font-black text-white uppercase group-hover:text-red-500 transition-all">{col.title}</h4>
                             <div className="flex gap-1">
                               <button onClick={() => { setEditingCollection(col); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 text-slate-600 hover:text-blue-400 transition-colors"><Edit size={20}/></button>
                               <button onClick={() => { setCollections(prev => prev.filter(c => c.id !== col.id)); showToast("Колекцията е премахната.", "warning"); }} className="p-3 text-slate-600 hover:text-rose-500 transition-colors"><Trash2 size={20}/></button>
                             </div>
                          </div>
                          <p className="text-slate-500 text-sm font-medium line-clamp-2">{col.description}</p>
                       </div>
                       <div className="mt-8 flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{col.videoIds.length} ВИДЕА</span>
                          <div className="flex -space-x-4">
                             {col.videoIds.slice(0, 5).map(vid => (<div key={vid} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden"><img src={videos.find(v=>v.id===vid)?.thumbnail} className="w-full h-full object-cover" alt=""/></div>))}
                             {col.videoIds.length > 5 && (<div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">+{col.videoIds.length - 5}</div>)}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default AdminView;
