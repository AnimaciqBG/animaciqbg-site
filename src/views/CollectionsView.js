import React from 'react';
import { Search, Layers, Film, HelpCircle } from 'lucide-react';

const CollectionsView = ({ collections, videos, settings, collectionSearch, setCollectionSearch, setActiveCollection, setView }) => {
  const filtered = collections.filter(col =>
    col.title.toLowerCase().includes(collectionSearch.toLowerCase()) ||
    col.description.toLowerCase().includes(collectionSearch.toLowerCase())
  );

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-10 sm:pt-32 lg:pt-40 lg:pb-32 max-w-[1600px] mx-auto min-h-screen">
      <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-6 sm:mb-8 lg:mb-10 flex items-center gap-4 sm:gap-6 lg:gap-8">
        <Layers size={36} className="sm:w-12 sm:h-12 lg:w-[60px] lg:h-[60px]" style={{ color: settings.primaryColor }}/> Колекции
      </h1>

      <div className="relative w-full max-w-2xl mb-8 sm:mb-12 lg:mb-16">
        <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
        <input
          value={collectionSearch}
          onChange={e => setCollectionSearch(e.target.value)}
          placeholder="Търсене на колекции..."
          className="w-full bg-white/5 border border-white/10 p-4 pl-12 sm:p-5 sm:pl-14 lg:p-7 lg:pl-16 rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] text-white focus:ring-2 outline-none transition-all text-base sm:text-lg lg:text-xl backdrop-blur-xl focus:bg-white/10 shadow-2xl"
          style={{ '--tw-ring-color': settings.primaryColor }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
        {filtered.map(col => {
          const colVideos = col.videoIds.map(vid => videos.find(v => v.id === vid)).filter(Boolean);
          return (
           <div
            key={col.id}
            onClick={() => { setActiveCollection(col); setView('home'); window.scrollTo(0,0); }}
            className="group relative bg-slate-900 aspect-[16/9] rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[4rem] overflow-hidden cursor-pointer shadow-3xl ring-1 ring-white/10 hover:ring-white/40 transition-all"
          >
              {colVideos.length > 0 && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-0.5 opacity-40 group-hover:opacity-60 transition-opacity">
                  {colVideos.slice(0, 6).map((v) => (
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
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7 lg:bottom-10 lg:left-10 lg:right-10 z-20">
                <div className="w-8 sm:w-10 lg:w-12 h-1 sm:h-1.5 rounded-full mb-3 sm:mb-4 lg:mb-5 opacity-60" style={{ backgroundColor: settings.primaryColor }} />
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2 sm:mb-3 group-hover:translate-x-3 transition-transform">{col.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm font-medium line-clamp-2 max-w-md">{col.description}</p>
                <div className="mt-6 flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
                  <span className="flex items-center gap-2"><Film size={14}/> {col.videoIds.length} Заглавия</span>
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
        {filtered.length === 0 && collectionSearch && (
          <div className="col-span-full py-32 text-center">
            <Search size={60} className="mx-auto text-slate-800 mb-6" />
            <h3 className="text-2xl font-black text-white mb-2">Няма намерени колекции</h3>
            <p className="text-slate-500 font-medium">Опитайте с друго име на колекция.</p>
          </div>
        )}
        <div className="border-4 border-dashed border-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[4rem] flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 text-center group hover:border-white/10 transition-all aspect-[16/9]">
          <HelpCircle size={48} className="text-slate-800 mb-6" />
          <h4 className="text-slate-500 font-black uppercase tracking-widest text-sm">Очаквайте още колекции скоро</h4>
        </div>
      </div>
    </div>
  );
};

export default CollectionsView;
