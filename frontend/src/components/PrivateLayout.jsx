import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, FileText, CalendarDays, User, LogOut, Menu, X } from 'lucide-react';

export default function PrivateLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // 👇 État pour le menu mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const initiales = `${user.prenom?.charAt(0) || ''}${user.nom?.charAt(0) || ''}`.toUpperCase();

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return `Bonjour, ${user.prenom}`;
    if (location.pathname === '/nouvelle-demande') return 'Nouvelle demande';
    if (location.pathname === '/mon-contrat') return 'Mon contrat';
    if (location.pathname === '/echeancier') return 'Échéancier';
    if (location.pathname === '/profil') return 'Profil & paramètres';
    return 'Espace personnel';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { name: "Vue d'ensemble", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Nouvelle demande", path: "/nouvelle-demande", icon: <Plus size={20} /> },
    { name: "Mon contrat", path: "/mon-contrat", icon: <FileText size={20} /> },
    { name: "Échéancier", path: "/echeancier", icon: <CalendarDays size={20} /> },
    { name: "Profil & paramètres", path: "/profil", icon: <User size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden relative">
      
      {/* 👇 OVERLAY SOMBRE POUR MOBILE (quand le menu est ouvert) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0b1a2a] text-white flex flex-col h-full shrink-0 transition-transform duration-300
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3" onClick={() => navigate('/')}>
            <div className="bg-emerald-500 text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <span className="text-xl font-bold">Prêt<span className="text-emerald-500">Direct</span></span>
          </div>
          {/* Bouton fermer (mobile uniquement) */}
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="mx-4 mb-8 bg-white/10 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-500 text-[#0b1a2a] flex items-center justify-center font-bold">
            {initiales}
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{user.prenom} {user.nom}</p>
            <p className="text-xs text-gray-400">Espace emprunteur</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <p className="text-xs font-bold text-gray-500 mb-4 ml-2">MENU PRINCIPAL</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button 
                key={item.path} 
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false); // Ferme le menu au clic sur mobile
                }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                  isActive ? 'bg-emerald-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon} {item.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-lg transition"
          >
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU */}
      <main className="flex-1 overflow-y-auto w-full">
        <header className="bg-white px-4 md:px-8 py-4 md:py-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* 👇 BOUTON BURGER (mobile uniquement) */}
            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-[#0b1a2a]">{getPageTitle()}</h1>
              <p className="text-gray-500 mt-1 text-sm hidden md:block">Suivez votre demande et retrouvez tous vos documents.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500 text-[#0b1a2a] flex items-center justify-center font-bold">
              {initiales}
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}