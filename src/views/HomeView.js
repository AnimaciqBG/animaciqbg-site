import React from 'react';
import {
  Search, Clock, Eye, Heart, ChevronLeft, ChevronRight,
  TrendingUp, Sparkles, Zap
} from 'lucide-react';
import VideoCard from '../components/VideoCard';
import FilterBar from '../components/FilterBar';

const HomeView = ({
  settings, searchQuery, setSearchQuery, filter, setFilter,
  sortBy, setSortBy, activeCollection, setActiveCollection,
  trendingVideos, trendingIndex, setTrendingIndex,
  recentlyAdded, filteredVideos, paginatedVideos,
  currentPage, setCurrentPage, totalPages,
  likedVideos, handleLike, setVideoInfoModal,
}) => {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-10 sm:pt-32 lg:pt-40 lg:pb-32 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="mb-10 sm:mb-14 lg:mb-20">
        <h1 className={`font-black text-white mb-6 tracking-tighter leading-none ${settings.heroSize === 'small' ? 'text-3xl sm:text-5xl lg:text-6xl' : settings.heroSize === 'medium' ? 'text-4xl sm:text-6xl lg:text-7xl' : 'text-5xl sm:text-7xl lg:text-8xl'}`}>
          {activeCollection ? activeCollection.title : settings.texts.homeTitle}
        </h1>
        <p className="text-slate-400 text-base sm:text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
          {activeCollection ? activeCollection.description : settings.texts.homeSubtitle}
        </p>
        {activeCollection && (
          <button
            onClick={() => { setActiveCollection(null); setFilter('all'); }}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all"
          >
            <ChevronLeft size={16}/> Обратно към всички
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={settings.texts.searchPlaceholder}
            className="w-full bg-white/5 border border-white/10 p-4 pl-12 sm:p-5 sm:pl-14 lg:p-7 lg:pl-16 rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] text-white focus:ring-2 outline-none transition-all text-base sm:text-lg lg:text-xl backdrop-blur-xl focus:bg-white/10 shadow-2xl"
            style={{ '--tw-ring-color': settings.primaryColor }}
          />
        </div>
        <FilterBar activeFilter={filter} onFilterChange={setFilter} primaryColor={settings.primaryColor} />
      </div>

      {/* Sort Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8 lg:mb-12">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mr-2">Сортирай:</span>
        {[
          { id: 'newest', label: 'Най-нови', icon: <Clock size={13}/> },
          { id: 'most_viewed', label: 'Най-гледани', icon: <Eye size={13}/> },
          { id: 'most_liked', label: 'Най-харесвани', icon: <Heart size={13}/> }
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setSortBy(s.id)}
            className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all
              ${sortBy === s.id ? 'text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
            style={sortBy === s.id ? { backgroundColor: settings.primaryColor, boxShadow: `0 8px 20px ${settings.primaryColor}30` } : {}}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Trending Carousel */}
      {settings.showTrending !== false && !searchQuery && !activeCollection && filter === 'all' && trendingVideos.length > 0 && (
        <div className="mb-16 sm:mb-20 lg:mb-32">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-2 sm:gap-3">
              <TrendingUp style={{ color: settings.primaryColor }} /> В ТРЕНДА
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-1">
                {trendingIndex + 1} / {trendingVideos.length}
              </span>
              <button
                onClick={() => setTrendingIndex(i => Math.max(0, i - 1))}
                disabled={trendingIndex === 0}
                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300
                  ${trendingIndex === 0
                    ? 'bg-white/5 border-white/5 text-slate-700 cursor-not-allowed'
                    : 'bg-white/10 border-white/10 text-white hover:bg-white/20 hover:border-white/20 hover:scale-110 active:scale-95'}`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setTrendingIndex(i => Math.min(trendingVideos.length - 1, i + 1))}
                disabled={trendingIndex >= trendingVideos.length - 1}
                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300
                  ${trendingIndex >= trendingVideos.length - 1
                    ? 'bg-white/5 border-white/5 text-slate-700 cursor-not-allowed'
                    : 'text-white hover:scale-110 active:scale-95 hover:shadow-lg'}`}
                style={trendingIndex < trendingVideos.length - 1 ? { backgroundColor: settings.primaryColor, borderColor: settings.primaryColor, boxShadow: `0 4px 15px ${settings.primaryColor}40` } : {}}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div
              className="flex gap-4 sm:gap-6 lg:gap-8 transition-transform duration-700 ease-out pb-4"
              style={{ transform: `translateX(-${trendingIndex * (window.innerWidth < 640 ? 296 : window.innerWidth < 768 ? 374 : 532)}px)` }}
            >
              {trendingVideos.map((v, idx) => (
                <div key={v.id} onClick={() => setVideoInfoModal(v)} className={`group relative flex-shrink-0 w-[280px] sm:w-[350px] md:w-[500px] aspect-video rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] overflow-hidden cursor-pointer shadow-3xl ring-1 ring-white/10 transition-all duration-500 hover:ring-white/30 ${idx === trendingIndex ? 'scale-100 opacity-100' : 'scale-[0.95] opacity-60'}`}>
                   <img src={v.thumbnail} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={v.title} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                   <div className="absolute top-3 right-3 sm:top-5 sm:right-5 lg:top-8 lg:right-8 premium-blur bg-white/10 border border-white/20 px-3 py-1 sm:px-4 sm:py-1.5 lg:px-5 lg:py-2 rounded-xl sm:rounded-2xl flex items-center gap-1.5 sm:gap-2 lg:gap-3 text-white font-black text-[10px] sm:text-xs">
                      <Zap size={14} fill="currentColor" className="text-yellow-400" />
                      {(v.views || 0).toLocaleString()} <span className="text-[10px] opacity-60">ГЛЕДАНИЯ</span>
                   </div>
                   <div className="absolute top-3 left-3 sm:top-5 sm:left-5 lg:top-8 lg:left-8">
                     <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-black text-white text-sm sm:text-base lg:text-lg" style={{ backgroundColor: settings.primaryColor, boxShadow: `0 4px 15px ${settings.primaryColor}50` }}>
                       {idx + 1}
                     </div>
                   </div>
                   <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-10 lg:left-10 lg:right-10">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <span className="bg-white/10 premium-blur text-white text-[9px] sm:text-[10px] px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full font-black uppercase tracking-widest border border-white/10">{v.year}</span>
                        <span className="text-white/60 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] hidden sm:inline">Premium Experience</span>
                      </div>
                      <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white line-clamp-1 group-hover:translate-x-2 transition-transform">{v.title}</h3>
                   </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6">
            {trendingVideos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTrendingIndex(idx)}
                className={`rounded-full transition-all duration-300 ${idx === trendingIndex ? 'w-8 h-2' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                style={idx === trendingIndex ? { backgroundColor: settings.primaryColor } : {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recently Added */}
      {settings.showRecentlyAdded !== false && !searchQuery && !activeCollection && filter === 'all' && recentlyAdded.length > 0 && (
        <div className="mb-16 sm:mb-20 lg:mb-32">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-2 sm:gap-3">
              <Sparkles style={{ color: settings.primaryColor }} /> НАСКОРО ДОБАВЕНИ
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-6 sm:pb-8 lg:pb-10 snap-x no-scrollbar">
            {recentlyAdded.map(v => (
              <div key={v.id} onClick={() => setVideoInfoModal(v)} className="group relative flex-shrink-0 w-[160px] sm:w-[220px] md:w-[350px] aspect-[2/3] rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden cursor-pointer snap-start shadow-3xl ring-1 ring-white/10 transition-all hover:ring-white/30 hover:scale-[1.03]">
                 <img src={v.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={v.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                 <div className="absolute top-4 left-4">
                   <span className="bg-emerald-500 text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">НОВО</span>
                 </div>
                 <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-5 sm:right-5 lg:bottom-8 lg:left-6 lg:right-6">
                    <h3 className="text-sm sm:text-base lg:text-xl font-black text-white line-clamp-2 group-hover:translate-x-1 transition-transform">{v.title}</h3>
                    <span className="text-[10px] font-bold text-slate-400 mt-2 block">{v.year}</span>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid Header */}
      {filteredVideos.length > 0 && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {searchQuery ? 'Резултати' : activeCollection ? activeCollection.title : 'Всички филми'}
            </h2>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 text-slate-500 border border-white/5">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'филм' : 'филма'}
            </span>
          </div>
          {totalPages > 1 && (
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Страница {currentPage} от {totalPages}
            </span>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-5 lg:gap-10">
        {paginatedVideos.map(v => (
          <VideoCard key={v.id} video={v} onClick={setVideoInfoModal} onLike={handleLike} isLiked={likedVideos.includes(v.id)} primaryColor={settings.primaryColor} cardStyle={settings.cardStyle} likeSoundEnabled={settings.likeSoundEnabled} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16 mb-8">
          <button
            onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={currentPage === 1}
            className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300
              ${currentPage === 1
                ? 'bg-white/5 border-white/5 text-slate-700 cursor-not-allowed'
                : 'bg-white/10 border-white/10 text-white hover:bg-white/20 hover:scale-110 active:scale-95'}`}
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              if (totalPages <= 7) return true;
              if (page === 1 || page === totalPages) return true;
              if (Math.abs(page - currentPage) <= 1) return true;
              return false;
            })
            .reduce((acc, page, idx, arr) => {
              if (idx > 0 && page - arr[idx - 1] > 1) {
                acc.push('...');
              }
              acc.push(page);
              return acc;
            }, [])
            .map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="text-slate-600 px-2 font-bold">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm border transition-all duration-300
                    ${currentPage === page
                      ? 'text-white scale-110 shadow-lg'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:scale-105'}`}
                  style={currentPage === page ? { backgroundColor: settings.primaryColor, borderColor: settings.primaryColor, boxShadow: `0 4px 20px ${settings.primaryColor}40` } : {}}
                >
                  {page}
                </button>
              )
            )}

          <button
            onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={currentPage === totalPages}
            className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300
              ${currentPage === totalPages
                ? 'bg-white/5 border-white/5 text-slate-700 cursor-not-allowed'
                : 'text-white hover:scale-110 active:scale-95 hover:shadow-lg'}`}
            style={currentPage < totalPages ? { backgroundColor: settings.primaryColor, borderColor: settings.primaryColor, boxShadow: `0 4px 15px ${settings.primaryColor}40` } : {}}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {filteredVideos.length === 0 && (
        <div className="py-20 sm:py-32 lg:py-40 text-center">
          <Search size={60} className="mx-auto text-slate-800 mb-6 sm:mb-8" />
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2">Няма намерени резултати</h3>
          <p className="text-slate-500 font-medium text-base sm:text-lg">Опитайте с друго заглавие или филтър.</p>
        </div>
      )}
    </div>
  );
};

export default HomeView;
