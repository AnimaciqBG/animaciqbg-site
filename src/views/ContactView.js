import React from 'react';
import { Send, MessageSquare, AlertTriangle, Mail } from 'lucide-react';

const ContactView = ({ settings, showToast, setInquiries }) => {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-10 sm:pt-32 lg:pt-40 lg:pb-32 max-w-4xl mx-auto min-h-screen">
       <div className="text-center mb-10 sm:mb-14 lg:mb-20">
         <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tighter">Свържи се с нас</h1>
         <p className="text-slate-500 text-base sm:text-lg lg:text-xl font-medium">Имаш предложение, бъг или проблем? Ние сме тук да помогнем.</p>
       </div>
       <form
        onSubmit={(e) => {
          e.preventDefault();
          const lastContactDate = localStorage.getItem('v14_lastContact');
          const today = new Date().toDateString();
          if (lastContactDate === today) {
            showToast("Можете да изпращате само 1 съобщение на ден.", "warning");
            return;
          }
          const d = new FormData(e.target);
          const nameVal = d.get('name').trim();
          const emailVal = d.get('email').trim();
          const categoryVal = d.get('category');
          const msgVal = d.get('message').trim();
          if (nameVal.length < 2 || nameVal.length > 100) { showToast("Невалидно име.", "error"); return; }
          if (msgVal.length < 5 || msgVal.length > 2000) { showToast("Съобщението трябва да е между 5 и 2000 символа.", "error"); return; }
          const newInq = { id: Date.now(), name: nameVal, email: emailVal, category: categoryVal, message: msgVal, date: new Date().toLocaleDateString() };
          setInquiries(prev => [newInq, ...prev]);
          localStorage.setItem('v14_lastContact', today);
          showToast("Съобщението е изпратено!", "success");
          e.target.reset();
        }}
        className="bg-white/5 premium-blur p-5 sm:p-8 lg:p-16 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[4rem] border border-white/10 space-y-6 sm:space-y-8 shadow-3xl"
      >
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div className="space-y-2 sm:space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-3 sm:ml-4">Твоето Име</label>
              <input required name="name" placeholder="Йоан Доу" className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none focus:ring-2 transition-all" style={{'--tw-ring-color': settings.primaryColor}}/>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-3 sm:ml-4">Имейл Адрес</label>
              <input required name="email" type="email" placeholder="email@example.com" className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none focus:ring-2 transition-all" style={{'--tw-ring-color': settings.primaryColor}}/>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-3 sm:ml-4">Категория</label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'suggestion', label: 'Предложение', icon: <MessageSquare size={14}/> },
                { value: 'bug', label: 'Бъг / Проблем', icon: <AlertTriangle size={14}/> },
                { value: 'other', label: 'Друго', icon: <Mail size={14}/> }
              ].map(cat => (
                <label key={cat.value} className="relative cursor-pointer">
                  <input type="radio" name="category" value={cat.value} defaultChecked={cat.value === 'suggestion'} className="peer sr-only" />
                  <div className="flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 text-slate-400 text-xs sm:text-sm font-bold transition-all peer-checked:text-white peer-checked:border-transparent peer-checked:shadow-lg hover:bg-white/5"
                    style={{ '--peer-checked-bg': settings.primaryColor }}
                  >
                    <span className="peer-checked:hidden">{cat.icon}</span>
                    {cat.label}
                  </div>
                  <style>{`
                    input[value="${cat.value}"]:checked + div {
                      background-color: ${settings.primaryColor};
                      border-color: ${settings.primaryColor};
                      color: white;
                      box-shadow: 0 8px 20px ${settings.primaryColor}30;
                    }
                  `}</style>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-3 sm:ml-4">Твоето Съобщение</label>
            <textarea required name="message" placeholder="Опиши подробно какво би искал да ни кажеш..." rows={6} className="w-full bg-black/40 border border-white/10 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl text-white outline-none resize-none focus:ring-2 transition-all" style={{'--tw-ring-color': settings.primaryColor}}/>
          </div>
          <button type="submit" className="w-full py-5 sm:py-6 lg:py-7 bg-white text-black font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] text-sm sm:text-base rounded-2xl sm:rounded-3xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3 sm:gap-4">
            ИЗПРАТИ СЪОБЩЕНИЕТО <Send size={20}/>
          </button>
       </form>
    </div>
  );
};

export default ContactView;
