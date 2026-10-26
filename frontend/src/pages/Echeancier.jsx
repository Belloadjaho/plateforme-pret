import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Calendar, Building, TrendingUp, PiggyBank } from 'lucide-react';

export default function Echeancier() {
  const [demande, setDemande] = useState(null);
  const [echeances, setEcheances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // 👇 CORRIGÉ
        const [demandeRes, echeancesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/demandes/ma-demande`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/demandes/mes-remboursements`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setDemande(demandeRes.data);
        setEcheances(echeancesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-10 font-bold text-gray-500">Chargement...</div>;
  if (!demande || demande.statut !== 'acceptee') {
    return <div className="text-center p-10 text-gray-500">Aucun prêt en cours.</div>;
  }

  const montant = parseFloat(demande.montant_demande);
  const taux = parseFloat(demande.taux_applique);
  const duree = parseInt(demande.duree_mois);
  const interets = (montant * (taux / 100) * (duree / 12));
  const totalDu = montant + interets;
  const mensualite = totalDu / duree;

  const prochaineEcheance = echeances.find(e => e.statut !== 'paye');
  const dateProchaine = prochaineEcheance 
    ? new Date(prochaineEcheance.date_echeance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Terminé';

  const capitalMensuel = montant / duree;
  const interetsMensuels = interets / duree;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0b1a2a]">Calendrier de remboursement</h1>
        <p className="text-gray-500 mt-1">Prêt #{demande.numero_reception} • {duree} mensualités</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* CARTE 1 : MENSUALITÉ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium">Mensualité</p>
            <div className="bg-blue-50 text-blue-500 p-2 rounded-lg"><CreditCard size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-[#0b1a2a]">{Math.round(mensualite).toLocaleString('fr-FR')} FCFA</p>
          <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <PiggyBank size={16} /> Montant fixe
          </p>
        </div>

        {/* CARTE 2 : PROCHAINE ÉCHÉANCE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium">Prochaine échéance</p>
            <div className="bg-yellow-50 text-yellow-500 p-2 rounded-lg"><Calendar size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-[#0b1a2a]">{dateProchaine}</p>
          <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp size={16} /> À venir
          </p>
        </div>

        {/* CARTE 3 : TOTAL À REMBOURSER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 font-medium">Total à rembourser</p>
            <div className="bg-emerald-50 text-emerald-500 p-2 rounded-lg"><Building size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-[#0b1a2a]">{Math.round(totalDu).toLocaleString('fr-FR')} FCFA</p>
          <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp size={16} /> Capital + intérêts
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#0b1a2a]">Vos échéances</h2>
            <p className="text-gray-500 text-sm mt-1">Calendrier prévisionnel de remboursement</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="p-4 font-semibold">N°</th>
                <th className="p-4 font-semibold">Date d'échéance</th>
                <th className="p-4 font-semibold">Capital</th>
                <th className="p-4 font-semibold">Intérêts</th>
                <th className="p-4 font-semibold">Mensualité</th>
                <th className="p-4 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {echeances.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-[#0b1a2a]">#{e.numero_echeance.toString().padStart(2, '0')}</td>
                  <td className="p-4 text-gray-700 font-medium">{formatDate(e.date_echeance)}</td>
                  <td className="p-4 text-gray-500">{Math.round(capitalMensuel).toLocaleString('fr-FR')} FCFA</td>
                  <td className="p-4 text-gray-500">{Math.round(interetsMensuels).toLocaleString('fr-FR')} FCFA</td>
                  <td className="p-4 font-bold text-[#0b1a2a]">{Math.round(e.montant_du).toLocaleString('fr-FR')} FCFA</td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 w-max ${
                        e.statut === 'paye' ? 'bg-emerald-100 text-emerald-800' : 
                        e.statut === 'en_retard' ? 'bg-red-100 text-red-800' : 'bg-[#e0f0fa] text-[#2563eb]'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                        e.statut === 'paye' ? 'bg-emerald-500' : 
                        e.statut === 'en_retard' ? 'bg-red-500' : 'bg-[#2563eb]'
                    }`}></span>
                    {e.statut === 'paye' ? 'Payé' : e.statut === 'en_retard' ? 'En retard' : 'À venir'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}