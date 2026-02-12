import React, { memo } from 'react';
import { Trash2 } from 'lucide-react';

const ConfirmDialog = memo(({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full shadow-3xl text-center">
        <div className="w-16 h-16 bg-rose-600/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 size={32} />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed">{message}</p>
        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all">Отказ</button>
          <button onClick={onConfirm} className="flex-1 py-4 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20">Изтрий</button>
        </div>
      </div>
    </div>
  );
});

export default ConfirmDialog;
