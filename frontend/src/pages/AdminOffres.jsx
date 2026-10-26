import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminOffres() {
  const [offre, setOffre] = useState({
    montant_min: 5000,
    montant_max: 500000,
    duree_min_mois: 3,
    duree_max_mois: 24,
    whatsapp: '+22900000000',
    tranches: [
      { max: 30000, taux: 5 },
      { max: 50000, taux: 20 },
      { max: 500000, taux: 10 }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchOffre = async () => {
      const token = localStorage.getItem('token');
      try {
        // 👇 CORRIGÉ : backticks et slash
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/offres/active`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Si l'offre n'a pas de tranches, on met un tableau vide
        setOffre({
          ...res.data,
          tranches: res.data.tranches || []
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffre();
  }, []);

  const handleChange = (e) => {
    setOffre({ ...offre, [e.target.name]: e.target.value });
  };

  // Gestion des tranches
  const handleTrancheChange = (index, field, value) => {
    const newTranches = [...offre.tranches];
    newTranches[index][field] = value;
    setOffre({ ...offre, tranches: newTranches });
  };

  const addTranche = () => {
    setOffre({ ...offre, tranches: [...offre.tranches, { max: 0, taux: 0 }] });
  };

  const removeTranche = (index) => {
    const newTranches = offre.tranches.filter((_, i) => i !== index);
    setOffre({ ...offre, tranches: newTranches });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // On trie les tranches par ordre croissant (pour que le calcul soit logique)
    const tranchesTriees = [...offre.tranches].sort((a, b) => a.max - b.max);

    const dataToSend = { ...offre, tranches: tranchesTriees };

    try {
      if (offre.id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/offres/${offre.id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // 👇 CORRIGÉ : backticks et slash
        await axios.post(`${import.meta.env.VITE_API_URL}/offres`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-10 font-bold text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0b1a2a]">Gestion des offres</h1>
        <p className="text-gray-500 mt-1">Configurez vos tranches de prêt et les taux appliqués.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded mb-6 text-sm font-semibold">Offre mise à jour avec succès !</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* INFOS GÉNÉRALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Montant minimum global</label>
              <input type="number" name="montant_min" value={offre.montant_min} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-gray-50 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Montant maximum global</label>
              <input type="number" name="montant_max" value={offre.montant_max} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-gray-50 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Durée min (mois)</label>
              <input type="number" name="duree_min_mois" value={offre.duree_min_mois} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-gray-50 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Durée max (mois)</label>
              <input type="number" name="duree_max_mois" value={offre.duree_max_mois} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-gray-50 text-gray-700" />
            </div>
          </div>

          {/* GESTION DES TRANCHES */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#0b1a2a]">Tranches de montants et Taux (%)</h3>
              <button type="button" onClick={addTranche} className="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <Plus size={16} /> Ajouter une tranche
              </button>
            </div>
            
            <div className="space-y-3">
              {offre.tranches.map((tranche, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Jusqu'à (FCFA)</label>
                    <input type="number" value={tranche.max} onChange={(e) => handleTrancheChange(index, 'max', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg outline-none bg-white text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Taux (%)</label>
                    <input type="number" value={tranche.taux} onChange={(e) => handleTrancheChange(index, 'taux', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg outline-none bg-white text-gray-700" />
                  </div>
                  <button type="button" onClick={() => removeTranche(index)} className="mt-4 p-2 text-red-500 hover:bg-red-100 rounded-lg transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex gap-4">
            <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition shadow-lg">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}