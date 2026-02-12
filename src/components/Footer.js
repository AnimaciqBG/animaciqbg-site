import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

const Footer = ({ settings }) => {
  return (
    <footer className="py-16 sm:py-20 lg:py-32 border-t border-white/5 px-4 sm:px-6 lg:px-10 mt-16 sm:mt-20 lg:mt-32 bg-slate-950/20 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-10 opacity-50" style={{ backgroundImage: `linear-gradient(to right, transparent, ${settings.primaryColor}, transparent)` }} />
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4 sm:mb-6">{settings.siteName}</h3>
        <p className="text-slate-500 text-sm sm:text-base lg:text-lg font-medium leading-relaxed mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto">
          {settings.texts.footerDescription}
        </p>
        <div className="flex justify-center gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-12 lg:mb-16">
           <button className="text-slate-600 hover:text-white transition-colors"><Monitor size={24}/></button>
           <button className="text-slate-600 hover:text-white transition-colors"><Tablet size={24}/></button>
           <button className="text-slate-600 hover:text-white transition-colors"><Smartphone size={24}/></button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
