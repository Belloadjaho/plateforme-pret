import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDemandes() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState('toutes');

  const chargerDemandes = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      // 👇 CORRECTION : Ajout de "await"
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/demandes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDemandes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    chargerDemandes();
  }, [chargerDemandes]); 

  const handleStatutChange = async (id, nouveauStatut, motifRefus = null) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/demandes/${id}/statut`, 
        { statut: nouveauStatut, motif_refus: motifRefus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      chargerDemandes(); 
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification du statut");
    }
  };

  const demandesFiltrees = demandes.filter(d => {
    const matchRecherche = `${d.prenom} ${d.nom}`.toLowerCase().includes(recherche.toLowerCase());
    const matchFiltre = filtre === 'toutes' ? true : d.statut === filtre;
    return matchRecherche && matchFiltre;
  });

  const countToutes = demandes.length;
  const countEnAttente = demandes.filter(d => d.statut === 'en_attente').length;
  const countAcceptees = demandes.filter(d => d.statut === 'acceptee').length;
  const countRefusees = demandes.filter(d => d.statut === 'refusee').length;

  if (loading) return <div className="text-center p-10 font-bold text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un emprunteur..." 
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          />
        </div>

        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1 overflow-x-auto w-full md:w-auto">
          <button onClick={() => setFiltre('toutes')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap ${filtre === 'toutes' ? 'bg-[#0b1a2a] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            Toutes <span className="ml-1 opacity-70">{countToutes}</span>
          </button>
          <button onClick={() => setFiltre('en_attente')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap ${filtre === 'en_attente' ? 'bg-[#0b1a2a] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            À étudier <span className="ml-1 opacity-70">{countEnAttente}</span>
          </button>
          <button onClick={() => setFiltre('acceptee')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap ${filtre === 'acceptee' ? 'bg-[#0b1a2a] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            Acceptées <span className="ml-1 opacity-70">{countAcceptees}</span>
          </button>
          <button onClick={() => setFiltre('refusee')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap ${filtre === 'refusee' ? 'bg-[#0b1a2a] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            Refusées <span className="ml-1 opacity-70">{countRefusees}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="p-4 font-semibold">Emprunteur</th>
                <th className="p-4 font-semibold">Montant</th>
                <th className="p-4 font-semibold">Durée</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {demandesFiltrees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">Aucune demande ne correspond à votre recherche.</td>
                </tr>
              ) : (
                demandesFiltrees.map((d) => {
                  const initiales = `${d.prenom?.charAt(0) || ''}${d.nom?.charAt(0) || ''}`.toUpperCase();
                  
                  return (
                    <tr key={d.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {initiales}
                        </div>
                        <div>
                          <p className="font-bold text-[#0b1a2a] text-sm">{d.prenom} {d.nom}</p>
                          <p className="text-gray-500 text-xs truncate max-w-[150px]">{d.motif || 'Sans motif'}</p>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-[#0b1a2a] text-sm">{parseFloat(d.montant_demande).toLocaleString('fr-FR')} FCFA</td>
                      <td className="p-4 text-gray-600 text-sm">{d.duree_mois} mois</td>
                      <td className="p-4 text-gray-600 text-sm">
                        {new Date(d.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          d.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                          d.statut === 'acceptee' ? 'bg-emerald-100 text-emerald-800' :
                          d.statut === 'refusee' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {d.statut === 'en_attente' ? 'À étudier' : d.statut === 'acceptee' ? 'Acceptée' : d.statut === 'refusee' ? 'Refusée' : d.statut}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {d.statut === 'en_attente' ? (
                            <>
                              <button onClick={() => handleStatutChange(d.id, 'acceptee')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition" title="Accepter">
                                <CheckCircle size={20} />
                              </button>
                              <button onClick={() => handleStatutChange(d.id, 'refusee', 'Dossier incomplet ou revenus insuffisants')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition" title="Refuser">
                                <XCircle size={20} />
                              </button>
                              <Link to={`/admin/demandes/${d.id}`} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition inline-flex" title="Voir détail">
                                <Eye size={20} />
                              </Link>
                            </>
                          ) : (
                            <Link to={`/admin/demandes/${d.id}`} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition inline-flex" title="Voir détail">
                              <Eye size={20} />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}