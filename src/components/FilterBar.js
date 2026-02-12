import React, { memo } from 'react';
import { Layers, Film, Video, Zap } from 'lucide-react';

const FilterBar = memo(({ activeFilter, onFilterChange, primaryColor }) => {
  const filters = [
    { id: 'all', label: 'Всички', icon: <Layers size={14}/> },
    { id: 'movie', label: 'Филми', icon: <Film size={14}/> },
    { id: 'series', label: 'Сериали', icon: <Video size={14}/> },
    { id: 'short', label: 'Кратки', icon: <Zap size={14}/> }
  ];

  return (
    <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 lg:mb-12 overflow-x-auto no-scrollbar pb-2">
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

export default FilterBar;
