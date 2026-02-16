import React from 'react';
import { Home, BookOpen, Layers, Award, MessageCircle, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  const nav = [
    { icon: <Home size={22} />, label: 'Início', path: '/' },
    { icon: <BookOpen size={22} />, label: 'Estudo', path: '/study' },
    { icon: <Layers size={22} />, label: 'Planos', path: '/plans' },
    { icon: <Award size={22} />, label: 'Quiz', path: '/quiz' },
    { icon: <MessageCircle size={22} />, label: 'Oração', path: '/community' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 md:pl-64 pb-20 md:pb-0">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-emerald-950 text-emerald-50 hidden md:flex flex-col p-6 shadow-2xl z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Heart className="text-white fill-white" size={20} />
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight">Semente Diária</h1>
        </div>
        
        <nav className="space-y-2">
          {nav.map(item => (
            <Link key={item.path} to={item.path} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${pathname === item.path ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'hover:bg-emerald-900/50 text-emerald-200'}`}>
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="max-w-4xl mx-auto p-4 md:p-12">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-stone-100 flex justify-around items-center p-3 md:hidden z-50">
        {nav.map(item => (
          <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1.5 transition-all ${pathname === item.path ? 'text-emerald-600' : 'text-stone-400'}`}>
            <div className={`p-1 rounded-lg ${pathname === item.path ? 'bg-emerald-50' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;