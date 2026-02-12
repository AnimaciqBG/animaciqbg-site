import React, { useState, memo } from 'react';
import { Play, Heart, Eye, Volume2, FileText } from 'lucide-react';
import { playLikeSound } from '../utils/sounds';

const VideoCard = memo(({ video, onClick, onLike, isLiked, primaryColor, cardStyle = 'rounded', likeSoundEnabled = true }) => {
  const [animating, setAnimating] = useState(false);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    setAnimating(true);
    if (likeSoundEnabled) playLikeSound();
    onLike && onLike(video.id);
    setTimeout(() => setAnimating(false), 500);
  };

  const radiusClass = cardStyle === 'square' ? 'rounded-xl' : cardStyle === 'pill' ? 'rounded-[3rem]' : 'rounded-[2rem]';

  return (
    <div
      onClick={() => onClick(video)}
      className={`group relative aspect-[2/3] bg-slate-900 ${radiusClass} overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:scale-[1.05] ring-1 ring-white/5 hover:ring-white/20`}
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
        onClick={handleHeartClick}
        className={`absolute top-4 right-4 z-10 p-3 premium-blur rounded-full border transition-all duration-300
          ${isLiked
            ? 'bg-rose-500/30 border-rose-500/40 text-rose-500 opacity-100'
            : 'bg-black/50 border-white/10 text-white/70 hover:text-rose-500 hover:bg-rose-500/20 hover:border-rose-500/30 md:opacity-0 md:group-hover:opacity-100 opacity-80'}
          ${animating ? 'animate-heart-pop' : ''}`}
      >
        <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
      </button>

      <div className="absolute inset-0 p-3 sm:p-4 lg:p-6 flex flex-col justify-end transform transition-transform duration-500 group-hover:translate-y-[-8px]">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div
            className="px-3 py-1 rounded-full w-fit text-[9px] font-black text-white uppercase tracking-widest shadow-lg"
            style={{ backgroundColor: video.streamType === 'download' ? '#10B981' : primaryColor }}
          >
            {video.streamType === 'download' ? 'БГ АУДИО' : 'СТРИЙМ'}
          </div>
        </div>
        <h3 className="font-black text-white text-sm sm:text-base lg:text-xl line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">{video.title}</h3>

        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-tighter md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1"><Eye size={12}/> {(video.views || 0).toLocaleString()}</span>
          <span className="flex items-center gap-1"><Heart size={12} className="text-rose-500" fill={isLiked ? '#f43f5e' : 'none'}/> {(video.likes || 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Hover Play Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
         <div className="w-16 h-16 rounded-full bg-white/10 premium-blur border border-white/20 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform">
            <Play fill="currentColor" size={24} className="ml-1" />
         </div>
      </div>
    </div>
  );
});

export default VideoCard;
