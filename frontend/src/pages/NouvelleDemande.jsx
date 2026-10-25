import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function NouvelleDemande() {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};
  const token = localStorage.getItem('token');

  const [offre, setOffre] = useState(null);
  const [formData, setFormData] = useState({
    montant_demande: 10000,
    duree_mois: 12,
    motif: '',
    nom: `${user.prenom || ''} ${user.nom || ''}`.trim(),
    email: user.email || '',
    telephone: user.telephone || '',
    numero_reception: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOffre = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/offres/active', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOffre(res.data);
      } catch (err) {
        console.error("Erreur chargement offre", err);
        setOffre({ tranches: [{ max: 50000, taux: 5 }] });
      }
    };
    fetchOffre();
  }, [token]);

  // 👇 CALCUL INTELLIGENT DU TAUX
  const getTauxActuel = () => {
    if (!offre || !offre.tranches || offre.tranches.length === 0) return 5; // Taux par défaut
    
    // On parcourt les tranches dans l'ordre
    for (let i = 0; i < offre.tranches.length; i++) {
      if (formData.montant_demande <= offre.tranches[i].max) {
        return offre.tranches[i].taux;
      }
    }
    
    // Si le montant dépasse toutes les tranches, on prend le dernier taux
    return offre.tranches[offre.tranches.length - 1].taux;
  };

  const taux = getTauxActuel();
  const montantSecurise = Math.max(0, formData.montant_demande);
  const dureeSecurisee = Math.max(1, formData.duree_mois);

  const interets = (montantSecurise * (taux / 100) * (dureeSecurisee / 12));
  const totalRembourser = montantSecurise + interets;
  const mensualite = totalRembourser / dureeSecurisee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/demandes', {
        montant_demande: montantSecurise,
        duree_mois: dureeSecurisee,
        taux_applique: taux,
        motif: formData.motif,
        numero_reception: formData.numero_reception,
        type_reception: 'mobile_money'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi de la demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0b1a2a]">Nouvelle demande de prêt</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row w-full overflow-hidden">
        <div className="w-full md:w-[65%] p-6 md:p-10 border-b md:border-b-0 md:border-r border-gray-100">
          {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
          {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded mb-4 text-sm font-semibold">Demande envoyée avec succès !</div>}

          <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold text-[#0b1a2a] mb-6">Vos informations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Nom complet *</label>
                <input type="text" required value={formData.nom} readOnly className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Adresse e-mail *</label>
                <input type="email" required value={formData.email} readOnly className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Téléphone *</label>
                <input type="tel" required value={formData.telephone} readOnly className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Mobile Money / IBAN *</label>
                <input type="text" name="numero_reception" required placeholder="Numéro de réception" value={formData.numero_reception} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700" />
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 my-8"></div>

            <h3 className="text-xl font-bold text-[#0b1a2a] mb-6">Votre besoin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Montant souhaité (FCFA) *</label>
                <input type="number" name="montant_demande" required min="1000" value={formData.montant_demande} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700 font-medium" />
                {offre && (
                  <p className="text-xs text-gray-500 mt-1">
                    Tranche actuelle : {offre.tranches?.map(t => `≤ ${t.max.toLocaleString()} FCFA : ${t.taux}%`).join(' | ')}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Durée (mois) *</label>
                <input type="number" name="duree_mois" required min="1" value={formData.duree_mois} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700 font-medium" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Motif de la demande *</label>
              <textarea name="motif" required rows="3" placeholder="Décrivez brièvement votre projet..." value={formData.motif} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none bg-gray-50 text-gray-700"></textarea>
            </div>

            <button type="submit" disabled={loading} className={`w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition flex justify-center items-center gap-2 shadow-lg ${loading ? 'opacity-50' : ''}`}>
              {loading ? 'Envoi...' : 'Envoyer ma demande'} <ArrowRight size={20} />
            </button>
          </form>
        </div>

        {/* SIMULATION EN DIRECT */}
        <div className="w-full md:w-[35%] bg-[#f8fafc] p-6 md:p-10 flex flex-col justify-center">
          <h3 className="text-emerald-500 font-bold tracking-wider text-sm mb-8">VOTRE SIMULATION</h3>
          
          <div className="mb-8">
            <p className="text-3xl md:text-[40px] leading-none font-bold text-[#0b1a2a] flex items-baseline gap-1">
              {Math.round(mensualite).toLocaleString('fr-FR')} FCFA <span className="text-base text-gray-400 font-normal">/ mois</span>
            </p>
          </div>

          <div className="space-y-4 md:space-y-5 text-[14px] md:text-[15px]">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Montant</span>
              <span className="font-bold text-[#0b1a2a]">{montantSecurise.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Durée</span>
              <span className="font-bold text-[#0b1a2a]">{dureeSecurisee} mois</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Taux appliqué</span>
              <span className="font-bold text-emerald-600">{taux} %</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Intérêts</span>
              <span className="font-bold text-[#0b1a2a]">{Math.round(interets).toLocaleString('fr-FR')} FCFA</span>
            </div>
            
            <div className="w-full h-px bg-gray-200 my-4"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Total dû</span>
              <span className="font-bold text-[#0b1a2a]">{Math.round(totalRembourser).toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}