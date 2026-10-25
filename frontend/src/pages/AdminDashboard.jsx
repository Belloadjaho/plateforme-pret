import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Calendar, FileText, Banknote, PiggyBank, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemandes = async () => {
      const token = localStorage.getItem('token');
      try {
        // On récupère toutes les demandes (le backend sait qu'on est admin)
        const res = await axios.get('http://localhost:5000/api/demandes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDemandes(res.data);
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDemandes();
  }, []);

  if (loading) return <div className="text-center p-10 font-bold text-gray-500">Chargement des données...</div>;

  // 📊 CALCUL DES STATISTIQUES EN TEMPS RÉEL
  const nouvellesDemandes = demandes.filter(d => d.statut === 'en_attente').length;
  const pretsEnCours = demandes.filter(d => d.statut === 'acceptee').length;
  
  const capitalEngage = demandes
    .filter(d => d.statut === 'acceptee')
    .reduce((total, d) => total + parseFloat(d.montant_demande), 0);

  const interetsAttendus = demandes
    .filter(d => d.statut === 'acceptee')
    .reduce((total, d) => total + (parseFloat(d.montant_demande) * (parseFloat(d.taux_applique) / 100) * (d.duree_mois / 12)), 0);

  const stats = [
    { title: "Nouvelles demandes", value: nouvellesDemandes.toString(), sub: "À étudier", icon: <FileText className="text-blue-500" />, bg: "bg-blue-50" },
    { title: "Prêts en cours", value: pretsEnCours.toString(), sub: "Actifs", icon: <Banknote className="text-emerald-500" />, bg: "bg-emerald-50" },
    { title: "Capital engagé", value: `${capitalEngage.toLocaleString('fr-FR')} FCFA`, sub: "Total prêté", icon: <PiggyBank className="text-yellow-600" />, bg: "bg-yellow-50" },
    { title: "Intérêts attendus", value: `${interetsAttendus.toFixed(0)} FCFA`, sub: "Projection", icon: <PiggyBank className="text-purple-500" />, bg: "bg-purple-50" },
  ];

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  // Couleur du badge selon le statut
  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'en_attente': return { label: 'À étudier', color: 'bg-yellow-100 text-yellow-800' };
      case 'acceptee': return { label: 'Acceptée', color: 'bg-emerald-100 text-emerald-800' };
      case 'refusee': return { label: 'Refusée', color: 'bg-red-100 text-red-800' };
      default: return { label: statut, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* EN-TÊTE ACTIONS */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-gray-600">
          <Calendar size={18} />
          <span className="font-medium capitalize">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <Link to="/admin/offres" className="bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-600 transition flex items-center gap-2 shadow-sm">
          <Plus size={20} /> Créer une offre
        </Link>
      </div>

      {/* CARTES STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 font-medium">{stat.title}</p>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0b1a2a] mb-2">{stat.value}</p>
              <p className="text-sm text-gray-500 font-medium">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABLEAU DES DEMANDES */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#0b1a2a]">Demandes récentes</h2>
            <p className="text-gray-500 text-sm mt-1">Les {demandes.length} derniers dossiers de la plateforme</p>
          </div>
          <Link to="/admin/demandes" className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
            Voir toutes <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="p-4 font-semibold">Emprunteur</th>
                <th className="p-4 font-semibold">Montant</th>
                <th className="p-4 font-semibold">Durée</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {demandes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">Aucune demande pour le moment.</td>
                </tr>
              ) : (
                demandes.slice(0, 5).map((d) => {
                  const badge = getStatutBadge(d.statut);
                  const initiales = `${d.prenom?.charAt(0) || ''}${d.nom?.charAt(0) || ''}`.toUpperCase();
                  
                  return (
                    <tr key={d.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                          {initiales}
                        </div>
                        <div>
                          <p className="font-bold text-[#0b1a2a] text-sm">{d.prenom} {d.nom}</p>
                          <p className="text-gray-500 text-xs truncate max-w-[150px]">{d.motif || 'Sans motif'}</p>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-[#0b1a2a] text-sm">{parseFloat(d.montant_demande).toLocaleString('fr-FR')} FCFA</td>
                      <td className="p-4 text-gray-600 text-sm">{d.duree_mois} mois</td>
                      <td className="p-4 text-gray-600 text-sm">{formatDate(d.created_at)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link to={`/admin/demandes/${d.id}`} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">
                          Détail
                        </Link>
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