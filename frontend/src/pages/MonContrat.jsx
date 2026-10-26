import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Download, ShieldCheck, MessageCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function MonContrat() {
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

  // FONCTION POUR TÉLÉCHARGER LE PDF
  const telechargerPDF = () => {
    const element = document.getElementById('contrat-pdf');
    const options = {
      margin: 10,
      filename: `Contrat_PretDirect_${demande.numero_reception}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  };

  if (loading) return <div className="text-center p-10 font-bold text-gray-500">Chargement...</div>;

  if (!demande || demande.statut !== 'acceptee') {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-2xl font-bold text-[#0b1a2a] mb-3">Aucun contrat en cours</h2>
        <p className="text-gray-500 mb-8">Votre demande est en cours d'étude ou n'a pas encore été acceptée. Le contrat sera disponible ici dès validation.</p>
        <Link to="/dashboard" className="bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-600 transition">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  const montant = parseFloat(demande.montant_demande);
  const taux = parseFloat(demande.taux_applique);
  const duree = parseInt(demande.duree_mois);
  const interets = (montant * (taux / 100) * (duree / 12));
  const totalDu = montant + interets;
  const mensualite = totalDu / duree;

  const dateGeneration = demande.date_traitement 
    ? new Date(demande.date_traitement).toLocaleDateString('fr-FR')
    : new Date().toLocaleDateString('fr-FR');

  const whatsappNumber = "22962130248"; 
  const whatsappMessage = encodeURIComponent(`Bonjour, voici mon contrat de prêt PrêtDirect #${demande.numero_reception}.`);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="max-w-5xl mx-auto">
      
      <div className="bg-emerald-50 rounded-2xl p-6 md:p-8 flex items-start gap-4 mb-8 border border-emerald-100">
        <CheckCircle className="text-emerald-500 shrink-0 mt-1" size={28} />
        <div>
          <h2 className="text-xl font-bold text-emerald-900">Demande acceptée</h2>
          <p className="text-emerald-700 mt-1">Votre contrat est prêt. Encore une étape avant le versement de vos fonds.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        <div id="contrat-pdf" className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          
          <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 text-white p-1.5 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Prêt<span className="text-emerald-500">Direct</span></span>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#0b1a2a]">CONTRAT DE PRÊT</p>
              <p className="text-sm text-gray-500">N° {demande.numero_reception}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 flex justify-between items-center mb-8">
            <div>
              <p className="text-xs text-emerald-600 font-bold mb-1">EMPRUNTEUR</p>
              <p className="font-bold text-[#0b1a2a] text-lg">{demande.prenom} {demande.nom}</p>
              <p className="text-sm text-gray-500">{demande.email}</p>
            </div>
            <div className="text-gray-300 text-2xl">→</div>
            <div className="text-right">
              <p className="text-xs text-emerald-600 font-bold mb-1">PRÊTEUR</p>
              <p className="font-bold text-[#0b1a2a] text-lg">Administrateur</p>
              <p className="text-sm text-gray-500">Prêteur particulier</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Montant emprunté</p>
              <p className="font-bold text-[#0b1a2a] text-lg">{montant.toLocaleString('fr-FR')} FCFA</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Durée</p>
              <p className="font-bold text-[#0b1a2a] text-lg">{duree} mois</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Taux fixe</p>
              <p className="font-bold text-[#0b1a2a] text-lg">{taux} %</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Mensualité</p>
              <p className="font-bold text-[#0b1a2a] text-lg">{Math.round(mensualite).toLocaleString('fr-FR')} FCFA</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total dû</p>
              <p className="font-bold text-[#0b1a2a] text-lg">{Math.round(totalDu).toLocaleString('fr-FR')} FCFA</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Numéro de réception</p>
              <p className="font-bold text-[#0b1a2a] text-lg">•••• {demande.numero_reception.slice(-4)}</p>
            </div>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-lg font-bold text-[#0b1a2a] mb-4 border-b border-gray-100 pb-2">Calendrier de remboursement</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500">
                    <th className="p-3 font-semibold rounded-tl-lg">N°</th>
                    <th className="p-3 font-semibold">Date d'échéance</th>
                    <th className="p-3 font-semibold">Montant</th>
                    <th className="p-3 font-semibold rounded-tr-lg">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {echeances.map((e) => (
                    <tr key={e.id}>
                      <td className="p-3 font-medium text-gray-700">#{e.numero_echeance.toString().padStart(2, '0')}</td>
                      <td className="p-3 text-gray-600">
                        {new Date(e.date_echeance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-3 font-bold text-[#0b1a2a]">{Math.round(e.montant_du).toLocaleString('fr-FR')} FCFA</td>
                      <td className="p-3">
                        <span className="text-xs font-medium text-gray-500">
                          {e.statut === 'paye' ? 'Payé' : e.statut === 'en_retard' ? 'En retard' : 'À venir'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 flex items-center gap-2 text-emerald-700 text-sm mt-8">
            <ShieldCheck size={18} />
            Document sécurisé • Généré le {dateGeneration}
          </div>
        </div>

        <div className="w-full lg:w-1/3 space-y-4">
          <button 
            onClick={telechargerPDF} 
            className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition flex justify-center items-center gap-2 shadow-lg"
          >
            <Download size={20} /> Télécharger le PDF
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-emerald-600 font-bold text-xs tracking-wider mb-4">POUR RECEVOIR VOS FONDS</p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0b1a2a] text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <p className="font-bold text-[#0b1a2a] text-sm">Téléchargez le PDF</p>
                  <p className="text-gray-500 text-xs mt-1">Conservez une copie du contrat.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0b1a2a] text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <p className="font-bold text-[#0b1a2a] text-sm">Envoyez-le par WhatsApp</p>
                  <p className="text-gray-500 text-xs mt-1">Au numéro officiel du prêteur.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0b1a2a] text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <p className="font-bold text-[#0b1a2a] text-sm">Recevez vos fonds</p>
                  <p className="text-gray-500 text-xs mt-1">Sur le compte renseigné.</p>
                </div>
              </div>
            </div>

            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#1ebd59] transition flex justify-center items-center gap-2 shadow-lg"
            >
              <MessageCircle size={20} /> Ouvrir WhatsApp
            </a>
            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck size={12} /> Message pré-rempli vers le numéro vérifié
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}