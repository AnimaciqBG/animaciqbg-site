import React from 'react';
import { X, Play, Calendar, Clock, Volume2, FileText, Eye, Heart } from 'lucide-react';

const VideoInfoModal = ({ video, onClose, onPlay, primaryColor }) => {
  if (!video) return null;
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] max-w-lg w-full shadow-3xl overflow-hidden animate-slide-in">
        <div className="relative aspect-video">
          <img src={video.thumbnail} className="w-full h-full object-cover" alt={video.title}/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"/>
          <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-3 bg-black/50 premium-blur rounded-full text-white hover:bg-red-600 transition-all">
            <X size={20}/>
          </button>
        </div>
        <div className="p-5 sm:p-6 lg:p-8 -mt-8 relative z-10">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-3">{video.title}</h3>
          <div className="flex flex-wrap items-center gap-3 mb-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
            {video.year && <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full"><Calendar size={12}/> {video.year}</span>}
            {video.duration && <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full"><Clock size={12}/> {video.duration}</span>}
            {video.audioType && (
              <span className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${video.audioType === 'bg_audio' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>
                {video.audioType === 'bg_audio' ? <><Volume2 size={12}/> БГ Аудио</> : <><FileText size={12}/> Субтитри</>}
              </span>
            )}
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full"><Eye size={12}/> {(video.views || 0).toLocaleString()}</span>
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full"><Heart size={12} className="text-rose-500"/> {(video.likes || 0).toLocaleString()}</span>
          </div>
          {video.description && (
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{video.description}</p>
          )}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {video.tags.map(tag => (
                <span key={tag} className="bg-white/5 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}
          <button
            onClick={() => onPlay(video)}
            className="w-full py-5 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
            style={{ backgroundColor: primaryColor }}
          >
            <Play size={20} fill="currentColor"/> ПУСНИ ФИЛМА
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoInfoModal;
