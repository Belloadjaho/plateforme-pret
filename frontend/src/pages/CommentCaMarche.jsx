import { useState } from 'react';
import { FileText, Eye, FileSignature, ShieldCheck, Plus, Minus, Info } from 'lucide-react';

export default function CommentCaMarche() {
  // Gestion de la FAQ (-1 = tout fermé par défaut)
  const [openFaq, setOpenFaq] = useState(-1);

  const faqs = [
    { q: "Qui finance mon prêt ?", a: "Un prêteur unique et vérifié finance les demandes acceptées. Il n'y a ni place de marché, ni mise en relation avec d'autres personnes." },
    { q: "Quels documents dois-je fournir ?", a: "Toutes les modalités sont détaillées dans votre contrat avant votre engagement." },
    { q: "Comment mes fonds sont-ils versés ?", a: "Toutes les modalités sont détaillées dans votre contrat avant votre engagement." },
    { q: "Puis-je rembourser par anticipation ?", a: "Toutes les modalités sont détaillées dans votre contrat avant votre engagement." }
  ];

  return (
    <div className="font-sans text-gray-900 bg-[#f4f6f8] min-h-screen">
      
      <main className="max-w-7xl mx-auto py-20 px-8">
        
        {/* EN-TÊTE DE LA PAGE */}
        <div className="text-center mb-16">
          <p className="text-emerald-500 font-bold tracking-wider text-sm mb-2">SIMPLE ET TRANSPARENT</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0b1a2a] mb-4">Votre prêt, sans zone d'ombre.</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">De la simulation au versement, découvrez chaque étape du parcours.</p>
        </div>

        {/* LES 3 ÉTAPES */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            { num: "01", titre: "Faites votre demande", desc: "Renseignez votre besoin et vos coordonnées bancaires en moins de cinq minutes.", icon: <FileText size={28} /> },
            { num: "02", titre: "Votre dossier est étudié", desc: "Le prêteur unique analyse personnellement votre situation et vous répond.", icon: <Eye size={28} /> },
            { num: "03", titre: "Signez votre contrat", desc: "Téléchargez le PDF généré et transmettez-le par WhatsApp.", icon: <FileSignature size={28} /> }
          ].map((step, i) => (
            <div key={i} className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-left relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-200 cursor-pointer">
              <div className="bg-emerald-50 text-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                {step.icon}
              </div>
              <span className="absolute top-8 right-8 text-5xl font-bold text-gray-100 transition-colors duration-300 group-hover:text-emerald-50">{step.num}</span>
              <h3 className="text-xl font-bold text-[#0b1a2a] mb-3">{step.titre}</h3>
              <p className="text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ (Design mis à jour selon ta capture) */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <p className="text-emerald-500 font-bold tracking-wider text-sm mb-2">QUESTIONS FRÉQUENTES</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0b1a2a]">On vous répond clairement.</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              
              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 
                    ${isOpen ? 'border-2 border-emerald-500 shadow-lg' : 'border border-gray-200 shadow-sm hover:border-emerald-300'}`}
                >
                  <button 
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="w-full text-left p-6 flex justify-between items-center focus:outline-none group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icône Info (change de couleur au clic) */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0
                        ${isOpen ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-500'}`}>
                        <Info size={22} />
                      </div>
                      
                      <span className={`font-bold text-lg transition-colors duration-300 ${isOpen ? 'text-[#0b1a2a]' : 'text-[#0b1a2a]'}`}>
                        {faq.q}
                      </span>
                    </div>
                    
                    {/* Bouton + / - (Rond, vert émeraude quand ouvert) */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0
                      ${isOpen ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-500'}`}>
                      {isOpen ? <Minus size={22} /> : <Plus size={22} />}
                    </div>
                  </button>
                  
                  {/* Réponse */}
                  <div className={`px-6 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-gray-500 pl-14 text-base leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ENCART CADRE RESPONSABLE */}
          <div className="mt-12 bg-[#0b1a2a] rounded-2xl p-8 flex items-start gap-4 shadow-xl">
            <div className="text-yellow-500 pt-1">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Un cadre clair et responsable</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                PrêtDirect agit avec transparence. Chaque offre précise le taux, la durée, la mensualité et le coût total avant toute signature. Emprunter vous engage et doit rester compatible avec vos capacités de remboursement.
              </p>
            </div>
          </div>
        </div>

      </main>
      
    </div>
  );
}