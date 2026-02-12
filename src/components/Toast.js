import React, { useEffect, memo } from 'react';
import { Check, AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';

const Toast = memo(({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { icon: <Check size={18}/>, bg: 'bg-emerald-600' },
    error: { icon: <AlertTriangle size={18}/>, bg: 'bg-rose-600' },
    info: { icon: <Info size={18}/>, bg: 'bg-blue-600' },
    warning: { icon: <ShieldAlert size={18}/>, bg: 'bg-orange-600' }
  }[type || 'info'];

  return (
    <div className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-10 sm:right-10 z-[200] ${config.bg} text-white px-5 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-4 animate-slide-in`}>
      {config.icon}
      <span className="font-bold text-sm tracking-wide">{message}</span>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity"><X size={16}/></button>
    </div>
  );
});

export default Toast;
