import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function ObtenirPret() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    montant_demande: 1000,
    duree_mois: 12,
    motif: '',
    nom: '',
    email: '',
    telephone: '',
    numero_reception: ''
  });

  const taux = 5;

  const montantSecurise = Math.max(0, formData.montant_demande);
  const dureeSecurisee = Math.max(1, formData.duree_mois);

  const interets = (montantSecurise * (taux / 100) * (dureeSecurisee / 12));
  const totalRembourser = montantSecurise + interets;
  const mensualite = totalRembourser / dureeSecurisee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className="font-sans text-gray-900 bg-[#f4f6f8] min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* EN-TÊTE */}
        <div className="text-center mb-10">
          <p className="text-emerald-500 font-bold tracking-wider text-sm mb-2">DEMANDE DE FINANCEMENT</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0b1a2a] mb-4">Parlez-nous de votre projet</h1>
          <p className="text-gray-500">Quelques informations suffisent. Votre demande est sans engagement.</p>
        </div>

        {/* BARRE DE PROGRESSION */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">1</div>
            <div className="w-20 md:w-32 h-1 bg-emerald-500 rounded-full"></div>
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">2</div>
            <div className="w-20 md:w-32 h-1 bg-gray-200 rounded-full"></div>
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">3</div>
          </div>
        </div>

        {/* 👇 LA GRANDE CARTE BLANCHE (Comme la page d'inscription) */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row w-full overflow-hidden">
          
          {/* COLONNE GAUCHE : FORMULAIRE (Prend 65% de la place) */}
          <div className="w-full md:w-[65%] p-6 md:p-10 border-b md:border-b-0 md:border-r border-gray-100">
            <form onSubmit={handleSubmit}>
              
              <h3 className="text-xl font-bold text-[#0b1a2a] mb-6">Vos informations</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Nom complet *</label>
                  <input type="text" name="nom" required placeholder="Ex. Sophie Martin" value={formData.nom} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Adresse e-mail *</label>
                  <input type="email" name="email" required placeholder="vous@email.fr" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Téléphone *</label>
                  <input type="tel" name="telephone" required placeholder="+33 6 00 00 00 00" value={formData.telephone} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Mobile Money / IBAN *</label>
                  <input type="text" name="numero_reception" required placeholder="Numéro ou IBAN de réception" value={formData.numero_reception} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700" />
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 my-8"></div>

              <h3 className="text-xl font-bold text-[#0b1a2a] mb-6">Votre besoin</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Montant souhaité (FCFA) *</label>
                  <input type="number" name="montant_demande" required min="100" value={formData.montant_demande} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Durée (mois) *</label>
                  <input type="number" name="duree_mois" required min="1" value={formData.duree_mois} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 text-gray-700 font-medium" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Motif de la demande *</label>
                <textarea name="motif" required rows="4" placeholder="Décrivez brièvement votre projet..." value={formData.motif} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none bg-gray-50 text-gray-700"></textarea>
              </div>

              <div className="flex items-start gap-3 mb-8">
                <input type="checkbox" required className="mt-1 accent-emerald-500 w-5 h-5 cursor-pointer rounded" />
                <p className="text-sm text-gray-500">J'atteste que les informations fournies sont exactes et j'accepte l'étude de ma demande.</p>
              </div>

              <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition flex justify-center items-center gap-2 shadow-lg">
                Envoyer ma demande <ArrowRight size={20} />
              </button>
            </form>
          </div>

          {/* COLONNE DROITE : SIMULATION (Prend 35% de la place) */}
          <div className="w-full md:w-[35%] bg-[#f8fafc] p-6 md:p-10 flex flex-col justify-center">
            <h3 className="text-emerald-500 font-bold tracking-wider text-sm mb-8">VOTRE SIMULATION</h3>
            
            <div className="mb-8">
              <p className="text-3xl md:text-[40px] leading-none font-bold text-[#0b1a2a] flex items-baseline gap-1">
                {mensualite.toFixed(2).replace('.', ',')} FCFA <span className="text-base text-gray-400 font-normal">/ mois</span>
              </p>
            </div>

            <div className="space-y-4 md:space-y-5 text-[14px] md:text-[15px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Montant</span>
                <span className="font-bold text-[#0b1a2a]">{montantSecurise.toFixed(2).replace('.', ',')} FCFA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Durée</span>
                <span className="font-bold text-[#0b1a2a]">{dureeSecurisee} mois</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Intérêts ({taux} %)</span>
                <span className="font-bold text-[#0b1a2a]">{interets.toFixed(2).replace('.', ',')} FCFA</span>
              </div>
              
              <div className="w-full h-px bg-gray-200 my-4"></div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total dû</span>
                <span className="font-bold text-[#0b1a2a]">{totalRembourser.toFixed(2).replace('.', ',')} FCFA</span>
              </div>
            </div>

            <div className="mt-8 bg-[#eaf7f1] rounded-xl p-5 flex gap-4 items-start">
              <ShieldCheck className="text-emerald-600 shrink-0" size={24} />
              <div>
                <p className="text-emerald-800 font-bold text-sm">Vos données sont protégées</p>
                <p className="text-emerald-600/80 text-xs mt-1 leading-relaxed">Transmission chiffrée et confidentielle</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}