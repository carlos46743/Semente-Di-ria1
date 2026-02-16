
import React from 'react';
import { Home, BookOpen, Layers, Award, MessageCircle, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { icon: <Home size={20} />, label: 'Início', path: '/' },
    { icon: <BookOpen size={20} />, label: 'Estudo', path: '/study' },
    { icon: <Layers size={20} />, label: 'Planos', path: '/plans' },
    { icon: <Award size={20} />, label: 'Quiz', path: '/quiz' },
    { icon: <MessageCircle size={20} />, label: 'Comunidade', path: '/community' },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-emerald-900 text-white fixed h-full left-0 top-0 z-20">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-bold italic">Semente Diária</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                location.pathname === item.path ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-800/50'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-stone-50">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around items-center py-2 px-1 z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              location.pathname === item.path ? 'text-emerald-700' : 'text-stone-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
