import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export default function DetailDemande() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demande, setDemande] = useState(null);
  const [echeances, setEcheances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRefus, setShowRefus] = useState(false);
  const [motifRefus, setMotifRefus] = useState('');

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const demandeRes = await axios.get(`http://localhost:5000/api/demandes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDemande(demandeRes.data);

      // 👇 APPEL À LA NOUVELLE ROUTE ICI
      if (demandeRes.data.statut === 'acceptee') {
        const echeancesRes = await axios.get(`http://localhost:5000/api/demandes/${id}/echeances`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEcheances(echeancesRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [id]);

  const handleStatutChange = async (nouveauStatut) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/demandes/${id}/statut`, 
        { statut: nouveauStatut, motif_refus: nouveauStatut === 'refusee' ? motifRefus : null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/admin/demandes');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification");
    }
  };

  const handleValiderPaiement = async (echeanceId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/demandes/remboursements/${echeanceId}/valider`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Recharge les données après validation
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la validation");
    }
  };

  if (loading) return <div className="text-center p-10 font-bold text-gray-500">Chargement...</div>;
  if (!demande) return <div className="text-center p-10 font-bold text-red-500">Demande introuvable.</div>;

  const initiales = `${demande.prenom?.charAt(0) || ''}${demande.nom?.charAt(0) || ''}`.toUpperCase();
  const montant = parseFloat(demande.montant_demande);
  const taux = parseFloat(demande.taux_applique);
  const interets = (montant * (taux / 100) * (demande.duree_mois / 12));
  const totalDu = montant + interets;
  const mensualite = totalDu / demande.duree_mois;

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => navigate('/admin/demandes')} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-medium mb-6 transition">
        <ArrowLeft size={18} /> Retour aux demandes
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0b1a2a]">Détail de la demande</h1>
        <p className="text-gray-500 mt-1">Dossier #{demande.numero_reception} • Reçu le {new Date(demande.created_at).toLocaleDateString('fr-FR')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-2xl shrink-0">
              {initiales}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0b1a2a]">{demande.prenom} {demande.nom}</h2>
              <p className="text-emerald-600 font-medium text-sm mt-1 flex items-center gap-1">
                <CheckCircle size={14} /> Identité vérifiée
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#0b1a2a] mb-6">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Adresse e-mail</p>
                <p className="font-bold text-[#0b1a2a]">{demande.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Téléphone</p>
                <p className="font-bold text-[#0b1a2a]">{demande.telephone}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Réception des fonds</p>
                <p className="font-bold text-[#0b1a2a]">Mobile Money • {demande.numero_reception}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#0b1a2a] mb-4">Projet de financement</h3>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-700 italic">
              "{demande.motif || 'Aucun motif renseigné.'}"
            </div>
          </div>

          {demande.statut === 'acceptee' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#0b1a2a] mb-6">Suivi des remboursements</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500">
                      <th className="p-3 font-semibold rounded-tl-lg">N°</th>
                      <th className="p-3 font-semibold">Date</th>
                      <th className="p-3 font-semibold">Montant</th>
                      <th className="p-3 font-semibold">Statut</th>
                      <th className="p-3 font-semibold rounded-tr-lg text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {echeances.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="p-3 font-bold text-[#0b1a2a]">#{e.numero_echeance.toString().padStart(2, '0')}</td>
                        <td className="p-3 text-gray-600">{new Date(e.date_echeance).toLocaleDateString('fr-FR')}</td>
                        <td className="p-3 font-bold text-[#0b1a2a]">{Math.round(e.montant_du).toLocaleString('fr-FR')} FCFA</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            e.statut === 'paye' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {e.statut === 'paye' ? 'Validé' : 'En attente'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {e.statut !== 'paye' && (
                            <button 
                              onClick={() => handleValiderPaiement(e.id)}
                              className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 transition"
                            >
                              Valider
                            </button>
                          )}
                          {e.statut === 'paye' && (
                            <span className="text-emerald-500 font-bold text-xs flex items-center justify-center gap-1">
                              <CheckCircle size={14} /> Payé
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-emerald-500 font-bold tracking-wider text-sm mb-6">SIMULATION</h3>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6 text-center">
              <p className="text-gray-500 text-sm mb-1">Montant demandé</p>
              <p className="text-3xl font-bold text-[#0b1a2a]">{montant.toLocaleString('fr-FR')} FCFA</p>
            </div>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Durée</span>
                <span className="font-bold text-[#0b1a2a]">{demande.duree_mois} mois</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taux fixe</span>
                <span className="font-bold text-[#0b1a2a]">{taux} %</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Intérêts</span>
                <span className="font-bold text-[#0b1a2a]">{Math.round(interets).toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="border-t border-gray-100 my-2"></div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total dû</span>
                <span className="font-bold text-[#0b1a2a]">{Math.round(totalDu).toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
            <div className="bg-emerald-500 p-4 rounded-xl flex justify-between items-center text-white mb-6">
              <span className="font-medium">Mensualité</span>
              <span className="font-bold text-lg">{Math.round(mensualite).toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>

          {demande.statut === 'en_attente' && (
            <div className="space-y-3">
              {!showRefus ? (
                <>
                  <button onClick={() => handleStatutChange('acceptee')} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition flex justify-center items-center gap-2 shadow-lg">
                    <CheckCircle size={20} /> Accepter la demande
                  </button>
                  <button onClick={() => setShowRefus(true)} className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl hover:bg-red-100 transition flex justify-center items-center gap-2">
                    <XCircle size={20} /> Refuser
                  </button>
                </>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
                  <h4 className="font-bold text-red-600 mb-2">Motif du refus</h4>
                  <textarea value={motifRefus} onChange={(e) => setMotifRefus(e.target.value)} placeholder="Expliquez pourquoi..." className="w-full p-3 border border-gray-200 rounded-lg mb-4 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none" rows="3" />
                  <div className="flex gap-2">
                    <button onClick={() => setShowRefus(false)} className="flex-1 py-2 text-gray-500 font-medium hover:bg-gray-50 rounded-lg">Annuler</button>
                    <button onClick={() => handleStatutChange('refusee')} className="flex-1 bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600">Confirmer</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {demande.statut !== 'en_attente' && (
            <div className={`p-6 rounded-2xl text-center font-bold ${demande.statut === 'acceptee' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              Cette demande a déjà été traitée.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}