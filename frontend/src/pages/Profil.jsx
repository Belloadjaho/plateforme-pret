import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle} from 'lucide-react';

export default function Profil() {
  // 👇 On initialise avec le localStorage
  const userLocal = JSON.parse(localStorage.getItem('user')) || {};

  const [formData, setFormData] = useState({
    prenom: userLocal.prenom || '',
    nom: userLocal.nom || '',
    email: userLocal.email || '',
    telephone: userLocal.telephone || '',
    pays: userLocal.pays || '',
    ville: userLocal.ville || ''
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        // 👇 CORRIGÉ 1
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          prenom: res.data.prenom || '',
          nom: res.data.nom || '',
          email: res.data.email || '',
          telephone: res.data.telephone || '',
          pays: res.data.pays || '',
          ville: res.data.ville || ''
        });
      } catch (err) {
        console.error("Erreur API, on garde le localStorage", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    const token = localStorage.getItem('token');

    try {
      // 👇 CORRIGÉ 2
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/users/me`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccess(true);
      
      // 👇 Rechargement pour mettre à jour la Sidebar
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  if (loading) return <div className="text-center p-10 font-bold text-gray-500">Chargement...</div>;

  const initiales = `${formData.prenom?.charAt(0) || ''}${formData.nom?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="max-w-3xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0b1a2a]">Profil & paramètres</h1>
        <p className="text-gray-500 mt-1">Gérez vos informations personnelles.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        {/* EN-TÊTE DU PROFIL */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-2xl shrink-0">
            {initiales || 'US'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0b1a2a]">
              {formData.prenom || formData.nom ? `${formData.prenom} ${formData.nom}` : 'Chargement...'}
            </h2>
            <p className="text-emerald-600 font-medium text-sm mt-1 flex items-center gap-1">
              <CheckCircle size={14} /> Compte vérifié
            </p>
          </div>
        </div>

        {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded mb-6 text-sm font-semibold">Profil mis à jour avec succès ! Rechargement...</div>}
        {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Prénom</label>
              <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Nom</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Adresse e-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Téléphone</label>
              <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Pays</label>
              <input type="text" name="pays" value={formData.pays} onChange={handleChange} placeholder="Bénin" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Ville</label>
              <input type="text" name="ville" value={formData.ville} onChange={handleChange} placeholder="Cotonou" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition shadow-lg">
              Enregistrer les modifications
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}