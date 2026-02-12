import React from 'react';
import { X, Clock, Activity, Volume2, FileText } from 'lucide-react';

const PlayerOverlay = ({ video, settings, onClose, onLoad }) => {
  if (!video || video.streamType !== 'embed') return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-500">
       {settings.watermarkEnabled !== false && (
         <div className={`absolute ${settings.watermarkPosition === 'top-right' ? 'top-20 right-3 sm:top-24 sm:right-10' : 'top-20 left-3 sm:top-24 sm:left-10'} z-[70] pointer-events-none select-none`}
              style={{ opacity: settings.watermarkOpacity / 100 }}>
           <span className="text-white font-black text-sm sm:text-xl lg:text-2xl uppercase tracking-[0.1em] sm:tracking-[0.2em] drop-shadow-2xl">{settings.watermarkText}</span>
         </div>
       )}

       <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 lg:p-10 z-[80] flex justify-between items-start bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none">
          <div className="pointer-events-auto max-w-[70%] sm:max-w-none">
            <h2 className="text-white text-base sm:text-xl lg:text-3xl font-black flex items-center gap-2 sm:gap-4 drop-shadow-2xl">
              {video.title}
              <span className="text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black animate-pulse" style={{ backgroundColor: settings.primaryColor }}>
                {settings.texts.playerLiveBadge}
              </span>
            </h2>
            <div className="text-slate-400 text-[10px] sm:text-xs lg:text-sm mt-1 sm:mt-2 font-bold flex items-center gap-2 sm:gap-4 flex-wrap">
              <span className="flex items-center gap-1"><Clock size={14}/> {video.duration || 'N/A'}</span>
              <span className="flex items-center gap-1"><Activity size={14}/> 1080p Premium</span>
              {video.audioType && (
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${video.audioType === 'bg_audio' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>
                  {video.audioType === 'bg_audio' ? <><Volume2 size={12}/> БГ Аудио</> : <><FileText size={12}/> Субтитри</>}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="pointer-events-auto p-3 sm:p-4 lg:p-5 bg-white/5 hover:bg-red-600 rounded-full text-white transition-all backdrop-blur-md group">
            <X size={24} className="sm:w-8 sm:h-8 group-hover:rotate-90 transition-transform" />
          </button>
       </div>

       <iframe
         src={video.embedUrl}
         className="w-full h-full border-0"
         allowFullScreen
         allow="autoplay; fullscreen"
         title={video.title}
         onLoad={onLoad}
       />
    </div>
  );
};

export default PlayerOverlay;
