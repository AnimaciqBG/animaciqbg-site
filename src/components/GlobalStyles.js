import React, { memo } from 'react';

const GlobalStyles = memo(() => (
  <style>{`
    @keyframes fall { 0% { transform: translateY(-10vh); opacity: 0.8; } 100% { transform: translateY(110vh); opacity: 0; } }
    @keyframes rain { 0% { transform: translateY(-10vh); opacity: 0.5; } 100% { transform: translateY(110vh); opacity: 0; } }
    @keyframes sway { 0% { transform: translateY(-10vh) translateX(0) rotate(0); opacity: 0.8; } 100% { transform: translateY(110vh) translateX(20px) rotate(360deg); opacity: 0; } }
    @keyframes glow { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5) translate(10px, -10px); } }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }
    @keyframes heartPop { 0% { transform: scale(1); } 30% { transform: scale(1.4); } 60% { transform: scale(0.9); } 100% { transform: scale(1); } }
    .animate-heart-pop { animation: heartPop 0.4s ease-out; }
    .animate-fall { animation: fall linear infinite; }
    .animate-rain { animation: rain linear infinite; }
    .animate-sway { animation: sway linear infinite; }
    .animate-glow { animation: glow ease-in-out infinite; }
    .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .premium-blur { backdrop-filter: blur(20px) saturate(180%); }
    @media (max-width: 640px) {
      .premium-blur { backdrop-filter: blur(10px) saturate(150%); }
    }
    @media (hover: none) and (pointer: coarse) {
      button, a, [role="button"] { -webkit-tap-highlight-color: transparent; }
    }
    @keyframes fadeScale { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
    .animate-fade-scale { animation: fadeScale 0.4s ease-out forwards; }

    /* --- SITE PROTECTION --- */
    body { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
    img, video, iframe { -webkit-user-drag: none; -khtml-user-drag: none; -moz-user-drag: none; user-drag: none; pointer-events: auto; }
    img { -webkit-touch-callout: none; }
    input, textarea, select { -webkit-user-select: text; -moz-user-select: text; user-select: text; }
  `}</style>
));

export default GlobalStyles;
