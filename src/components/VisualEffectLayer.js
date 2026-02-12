import React, { memo, useMemo } from 'react';
import { Snowflake, CloudRain, Flower } from 'lucide-react';

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

export default VisualEffectLayer;
