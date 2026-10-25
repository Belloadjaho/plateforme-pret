import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, FileText, CalendarDays, User, HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user) return null;

  const initiales = `${user.prenom?.charAt(0) || ''}${user.nom?.charAt(0) || ''}`.toUpperCase();

  const menuItems = [
    { name: "Vue d'ensemble", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Nouvelle demande", path: "/nouvelle-demande", icon: <Plus size={20} /> },
    { name: "Mon contrat", path: "/mon-contrat", icon: <FileText size={20} /> },
    { name: "Échéancier", path: "/echeancier", icon: <CalendarDays size={20} /> },
    { name: "Profil & paramètres", path: "/profil", icon: <User size={20} /> },
  ];

  return (
    <aside className="w-64 bg-[#0b1a2a] text-white flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-emerald-500 text-white p-2 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
        </div>
        <span className="text-xl font-bold">Prêt<span className="text-emerald-500">Direct</span></span>
      </div>

      {/* Profil Utilisateur */}
      <div className="mx-4 mb-8 bg-white/10 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-yellow-500 text-[#0b1a2a] flex items-center justify-center font-bold">
          {initiales}
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">{user.prenom} {user.nom}</p>
          <p className="text-xs text-gray-400">Espace emprunteur</p>
        </div>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 px-4 space-y-2">
        <p className="text-xs font-bold text-gray-500 mb-4 ml-2">MENU PRINCIPAL</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                isActive ? 'bg-emerald-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon} {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-white/10">
        <Link to="#" className="flex items-center gap-3 text-gray-300 hover:text-white px-4 py-2 transition">
          <HelpCircle size={20} /> Centre d'aide
        </Link>
      </div>
    </aside>
  );
}