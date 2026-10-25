import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [demande, setDemande] = useState(null);
  const [echeances, setEcheances] = useState([]); // 👈 Nouvel état
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemande = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/demandes/ma-demande', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDemande(res.data);

        // Si le prêt est accepté, on charge aussi les échéances pour la barre de progression
        if (res.data.statut === 'acceptee') {
          const echeancesRes = await axios.get('http://localhost:5000/api/demandes/mes-remboursements', {
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
    fetchDemande();
  }, []);

  if (loading) return <div className="text-center p-10 font-bold text-gray-500">Chargement...</div>;

  const statut = demande?.statut || 'aucun';

  // CALCULS POUR LE FINANCEMENT
  const montant = parseFloat(demande?.montant_demande) || 0;
  const taux = parseFloat(demande?.taux_applique) || 5;
  const duree = parseInt(demande?.duree_mois) || 12;
  
  const interets = (montant * (taux / 100) * (duree / 12));
  const totalDu = montant + interets;
  const mensualite = totalDu / duree;
  
  // Calcul dynamique du montant payé grâce aux échéances
  const montantPaye = echeances
    .filter(e => e.statut === 'paye')
    .reduce((total, e) => total + parseFloat(e.montant_du), 0);

  const pourcentageRembourse = (montantPaye / totalDu) * 100;
  const restantDu = totalDu - montantPaye;

  return (
    <div className="max-w-6xl mx-auto">
      
      {statut === 'aucun' && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <FileText size={40} />
          </div>
          <h2 className="text-2xl font-bold text-[#0b1a2a] mb-3">Vous n'avez pas de prêt en cours</h2>
          <p className="text-gray-500 mb-8 max-w-md">Faites une simulation et déposez votre première demande de financement en quelques minutes.</p>
          <Link to="/nouvelle-demande" className="bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-600 transition flex items-center gap-2 shadow-lg">
            Faire une demande <ArrowRight size={20} />
          </Link>
        </div>
      )}

      {statut === 'en_attente' && (
        <div className="bg-[#0b1a2a] rounded-2xl p-8 md:p-10 text-white relative overflow-hidden mb-8 flex flex-col md:flex-row items-center justify-between shadow-xl">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold mb-6">
              <Clock size={14} /> En cours d'étude
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Votre dossier est entre de bonnes mains.
            </h2>
            <p className="text-gray-300">
              Notre équipe analyse votre demande de {montant.toLocaleString('fr-FR')} FCFA. Vous recevrez une notification dès qu'une décision sera prise.
            </p>
          </div>
          <div className="hidden md:flex shrink-0">
            <Clock size={80} className="text-yellow-500/50" />
          </div>
        </div>
      )}

      {statut === 'acceptee' && (
        <>
          <div className="bg-[#0b1a2a] rounded-2xl p-8 md:p-10 text-white relative overflow-hidden mb-8 flex flex-col md:flex-row items-center justify-between shadow-xl">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Demande acceptée
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight">
                Bonne nouvelle, votre prêt est accordé.
              </h2>
              <p className="text-gray-300 mb-8">
                Votre contrat est prêt. Téléchargez-le puis envoyez-le au prêteur via WhatsApp pour recevoir vos fonds.
              </p>
              <Link to="/mon-contrat" className="bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-600 transition flex items-center gap-2 shadow-lg w-max">
                Voir mon contrat <span>→</span>
              </Link>
            </div>
            <div className="hidden md:flex shrink-0 relative z-10">
              <div className="w-32 h-32 rounded-full border-4 border-yellow-500/30 flex items-center justify-center">
                <CheckCircle2 size={64} className="text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-[#0b1a2a]">Mon financement</h3>
                <p className="text-gray-500 text-sm mt-1">Prêt #{demande.numero_reception}</p>
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Actif</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div>
                <p className="text-sm text-gray-500 mb-1">Montant</p>
                <p className="font-bold text-lg text-[#0b1a2a]">{montant.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Mensualité</p>
                <p className="font-bold text-lg text-[#0b1a2a]">{Math.round(mensualite).toLocaleString('fr-FR')} FCFA</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Prochaine échéance</p>
                <p className="font-bold text-lg text-[#0b1a2a]">
                  {echeances.find(e => e.statut !== 'paye') 
                    ? new Date(echeances.find(e => e.statut !== 'paye').date_echeance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) 
                    : 'Terminé'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Restant dû</p>
                <p className="font-bold text-lg text-[#0b1a2a]">{Math.round(restantDu).toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="font-bold text-[#0b1a2a]">{pourcentageRembourse.toFixed(0)} % remboursé</span>
                <span className="text-gray-500">{Math.round(montantPaye).toLocaleString('fr-FR')} FCFA sur {Math.round(totalDu).toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${pourcentageRembourse}%` }}></div>
              </div>
            </div>
          </div>
        </>
      )}

      {statut === 'refusee' && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 md:p-10 relative overflow-hidden mb-8 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold mb-6">
              <XCircle size={14} /> Demande refusée
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#7f1d1d] mb-4">
              Votre demande n'a pas été acceptée.
            </h2>
            <p className="text-red-800 mb-6">
              Malheureusement, nous ne pouvons pas donner suite à votre demande pour le motif suivant : <br/>
              <span className="italic">"{demande.motif_refus || 'Motif non précisé'}"</span>
            </p>
            <Link to="/nouvelle-demande" className="bg-white text-red-600 border border-red-200 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition inline-flex items-center gap-2">
              Faire une nouvelle demande
            </Link>
          </div>
          <div className="hidden md:flex shrink-0 relative z-10">
            <XCircle size={80} className="text-red-200" />
          </div>
        </div>
      )}

    </div>
  );
}