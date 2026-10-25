import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // 👇 LA REDIRECTION INTELLIGENTE EST ICI
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 text-white p-1.5 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <span className="text-xl font-bold text-gray-900">Prêt<span className="text-emerald-500">Direct</span></span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-semibold text-gray-600">
          <a href="/" className="hover:text-emerald-500">Accueil</a>
          <a href="/comment-ca-marche" className="hover:text-emerald-500">Comment ça marche</a>
          <a href="obtenir-pret" className="hover:text-emerald-500">Obtenir un prêt</a>
          <Link to="/" className="hover:text-emerald-500">Se connecter</Link>
          <Link to="/register" className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition">Créer un compte</Link>
        </nav>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden border border-gray-100">
          
          {/* PARTIE GAUCHE (Bleu Nuit) */}
          <div className="bg-[#0b1a2a] text-white p-10 md:w-1/2 flex flex-col justify-center">
            <p className="text-emerald-500 font-bold tracking-wider text-sm mb-4">HEUREUX DE VOUS REVOIR</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">
              Retrouvez vos projets, simplement.
            </h1>
            <p className="text-gray-300 mb-8 text-sm md:text-base">
              Connectez-vous pour suivre votre demande et accéder à vos documents.
            </p>
            <ul className="space-y-4 text-sm md:text-base text-gray-200">
                <li className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-1.5 rounded-full animate-pulse">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    Simulation gratuite
                </li>
                <li className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-1.5 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}>
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    Données protégées
                </li>
                <li className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-1.5 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}>
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    Réponse personnalisée
                </li>
            </ul>
          </div>

          {/* PARTIE DROITE (Formulaire) */}
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center bg-white">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-emerald-500 text-white p-1.5 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Prêt<span className="text-emerald-500">Direct</span></span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Se connecter</h2>
            <p className="text-sm text-gray-500 mb-6">Saisissez vos identifiants pour continuer.</p>

            {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse e-mail *</label>
                <input 
                  type="email" required placeholder="vous@email.fr"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe *</label>
                <input 
                  type="password" required placeholder="8 caractères minimum"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                />
              </div>

              <button type="submit" className="w-full mt-4 bg-emerald-500 text-white font-bold p-3 rounded-lg hover:bg-emerald-600 transition flex justify-center items-center gap-2">
                Se connecter <span className="text-xl">→</span>
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Pas encore de compte ? <Link to="/register" className="text-emerald-600 font-semibold hover:underline">Créer un compte</Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}