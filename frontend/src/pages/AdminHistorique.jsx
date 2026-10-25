import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CheckCircle2, Banknote, PiggyBank, TrendingUp, Search, Lock, LockOpen, Trash } from 'lucide-react';

export default function AdminHistorique() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ pretsRembourses: 0, pretsEnCours: 0, interetsPercus: 0 });
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState('');
  const userActuel = JSON.parse(localStorage.getItem('user'));

  const chargerData = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const [usersRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/demandes/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    chargerData();
  }, [chargerData]);

  // Bloquer / Débloquer
  const handleToggleStatut = async (id, currentStatut) => {
    const token = localStorage.getItem('token');
    const nouveauStatut = currentStatut === 'actif' ? 'suspendu' : 'actif';
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/statut`, 
        { statut: nouveauStatut },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      chargerData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification du statut");
    }
  };

  // Supprimer
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      chargerData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  if (loading) return <div className="text-center p-10 font-bold text-gray-500">Chargement...</div>;

  const usersFiltres = users.filter(u => 
    `${u.prenom} ${u.nom}`.toLowerCase().includes(recherche.toLowerCase()) ||
    u.email.toLowerCase().includes(recherche.toLowerCase())
  );

  // eslint-disable-next-line no-unused-vars
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0b1a2a]">Historique des prêts</h1>
        <p className="text-gray-500 mt-1">Consultez l'ensemble de vos financements et de vos utilisateurs.</p>
      </div>

      {/* CARTES STATISTIQUES DYNAMIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium">Prêts remboursés</p>
            <div className="bg-emerald-50 text-emerald-500 p-2 rounded-lg"><CheckCircle2 size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-[#0b1a2a]">{stats.pretsRembourses}</p>
          <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp size={16} /> 100 % à jour
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium">Prêts en cours</p>
            <div className="bg-blue-50 text-blue-500 p-2 rounded-lg"><Banknote size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-[#0b1a2a]">{stats.pretsEnCours}</p>
          <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp size={16} /> Actifs
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium">Intérêts perçus</p>
            <div className="bg-yellow-50 text-yellow-600 p-2 rounded-lg"><PiggyBank size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-[#0b1a2a]">
            {Math.round(stats.interetsPercus).toLocaleString('fr-FR')} FCFA
          </p>
          <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp size={16} /> +12 % cette année
          </p>
        </div>
      </div>

      {/* TABLEAU DES UTILISATEURS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#0b1a2a]">Utilisateurs inscrits</h2>
            <p className="text-gray-500 text-sm mt-1">Gérez les membres de la plateforme</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="p-4 font-semibold">Utilisateur</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Ville</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersFiltres.map((u) => {
                const initiales = `${u.prenom?.charAt(0) || ''}${u.nom?.charAt(0) || ''}`.toUpperCase();
                const estMoiMeme = u.id === userActuel.id;
                
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {initiales}
                      </div>
                      <div>
                        <p className="font-bold text-[#0b1a2a] text-sm">{u.prenom} {u.nom}</p>
                        <p className="text-gray-500 text-xs">{u.role === 'admin' ? 'Administrateur' : 'Emprunteur'}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{u.email}</td>
                    <td className="p-4 text-gray-600 text-sm">{u.ville || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        u.statut === 'actif' ? 'bg-emerald-100 text-emerald-800' : 
                        u.statut === 'suspendu' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {u.statut === 'actif' ? 'Actif' : u.statut === 'suspendu' ? 'Bloqué' : 'En attente'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {!estMoiMeme && (
                          <button 
                            onClick={() => handleToggleStatut(u.id, u.statut)}
                            className={`p-2 rounded-lg transition ${
                              u.statut === 'suspendu' 
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                            }`}
                            title={u.statut === 'suspendu' ? 'Débloquer' : 'Bloquer'}
                          >
                            {u.statut === 'suspendu' ? <LockOpen size={18} /> : <Lock size={18} />}
                          </button>
                        )}

                        {!estMoiMeme && (
                          <button 
                            onClick={() => handleDelete(u.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                            title="Supprimer"
                          >
                            <Trash size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}