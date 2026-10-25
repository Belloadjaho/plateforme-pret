import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // 👈 État pour le menu mobile

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 relative">
      <div className="px-4 md:px-8 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 z-50" onClick={closeMenu}>
          <div className="bg-emerald-500 text-white p-1.5 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <span className="text-xl font-bold text-gray-900">Prêt<span className="text-emerald-500">Direct</span></span>
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex gap-6 text-sm font-semibold text-gray-600 items-center">
          <Link to="/" className={`hover:text-emerald-500 ${location.pathname === '/' ? 'text-emerald-500' : ''}`}>Accueil</Link>
          <Link to="/comment-ca-marche" className={`hover:text-emerald-500 ${location.pathname === '/comment-ca-marche' ? 'text-emerald-500' : ''}`}>Comment ça marche</Link>
          <Link to="/obtenir-pret" className={`hover:text-emerald-500 ${location.pathname === '/obtenir-pret' ? 'text-emerald-500' : ''}`}>Obtenir un prêt</Link>
          <Link to="/login" className="hover:text-emerald-500">Se connecter</Link>
          <Link to="/register" className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition">Créer un compte</Link>
        </nav>

        {/* BOUTON BURGER (MOBILE) */}
        <button 
          className="md:hidden z-50 text-gray-600 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENU MOBILE (S'OUVRE EN DESSOUS) */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col gap-2 z-40">
          <Link to="/" onClick={closeMenu} className="py-3 px-4 rounded-lg hover:bg-gray-50 font-semibold text-gray-700">Accueil</Link>
          <Link to="/comment-ca-marche" onClick={closeMenu} className="py-3 px-4 rounded-lg hover:bg-gray-50 font-semibold text-gray-700">Comment ça marche</Link>
          <Link to="/obtenir-pret" onClick={closeMenu} className="py-3 px-4 rounded-lg hover:bg-gray-50 font-semibold text-gray-700">Obtenir un prêt</Link>
          <hr className="my-2 border-gray-100" />
          <Link to="/login" onClick={closeMenu} className="py-3 px-4 rounded-lg hover:bg-gray-50 font-semibold text-gray-700">Se connecter</Link>
          <Link to="/register" onClick={closeMenu} className="py-3 px-4 rounded-lg bg-emerald-500 text-white text-center font-bold mt-2">Créer un compte</Link>
        </div>
      )}
    </header>
  );
}