import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Send, CheckCircle2, ArrowRight} from 'lucide-react';

export default function Home() {
  const [montant, setMontant] = useState(1000);
  const [duree, setDuree] = useState(12);
  const taux = 5;

  const interets = (montant * (taux / 100) * (duree / 12));
  const totalRembourser = montant + interets;
  const mensualite = totalRembourser / duree;

  const avis = [
    { nom: "Aminata M.", texte: "J'avais besoin d'un coup de pouce pour lancer mon activité. En 48h, mon projet pouvait commencer.", initiales: "AM", ville: "Entrepreneuse, Lyon" },
    { nom: "Marc D.", texte: "Une transparence totale. Les mensualités sont claires et le contrat est facile à comprendre.", initiales: "MD", ville: "Développeur, Paris" },
    { nom: "Sophie L.", texte: "Service client exceptionnel, très humain. On n'a pas affaire à des robots.", initiales: "SL", ville: "Artisane, Bordeaux" },
  ];
  const avisDoubles = [...avis, ...avis, ...avis]; 

  return (
    <div className="font-sans text-gray-900 overflow-x-hidden">
      
      

      {/* 1. HERO SECTION */}
      <section className="bg-[#f4fbf7] py-20 px-8 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-6">
              SIMPLE. HUMAIN. TRANSPARENT.
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6 text-[#0b1a2a]">
              Vos projets méritent<br />un <span className="text-emerald-500 italic">oui.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Un prêt personnel clair, avec une réponse rapide et un accompagnement direct. Sans frais cachés, sans jargon.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/register" className="bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-emerald-600 transition flex items-center gap-2 shadow-lg">
                Faire une demande <ArrowRight size={20} />
              </Link>
              <a href="#comment-ca-marche" className="font-bold text-[#0b1a2a] flex items-center gap-2 hover:text-emerald-500">
                 Découvrir comment ça marche
              </a>
            </div>
          </div>
          <div className="md:w-1/2 relative flex justify-center">
            <div className="w-[350px] h-[450px] bg-emerald-200 rounded-t-full overflow-hidden relative border-8 border-white shadow-2xl">
               <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" alt="Femme souriante" className="object-cover w-full h-full" />
            </div>
            {/* Badge flottant */}
            <div className="absolute top-20 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-float">
              <div className="bg-emerald-100 text-emerald-500 p-2 rounded-full">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Demande acceptée</p>
                <p className="font-bold text-[#0b1a2a]">1000 € disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIMULATION */}
      <section id="simulation" className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/3">
            <p className="text-emerald-500 font-bold tracking-wider text-sm mb-2">SIMULATION INSTANTANÉE</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0b1a2a] leading-tight mb-6">
              Combien souhaitez-vous emprunter ?
            </h2>
            <p className="text-gray-500">Ajustez les curseurs. Votre estimation se met à jour en temps réel.</p>
          </div>
          
          <div className="md:w-2/3 bg-gray-50 rounded-3xl p-8 flex flex-col md:flex-row gap-8 border border-gray-100 shadow-sm">
            <div className="flex-1 space-y-8 py-4">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-gray-500 font-semibold">Montant souhaité</span>
                  <span className="text-3xl font-bold text-[#0b1a2a]">{montant.toFixed(2)} €</span>
                </div>
                <input type="range" min="200" max="5000" step="100" value={montant} onChange={(e) => setMontant(Number(e.target.value))} className="w-full accent-emerald-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-2"><span>200 €</span><span>5 000 €</span></div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-gray-500 font-semibold">Durée de remboursement</span>
                  <span className="text-3xl font-bold text-[#0b1a2a]">{duree} <span className="text-lg">mois</span></span>
                </div>
                <input type="range" min="3" max="24" step="1" value={duree} onChange={(e) => setDuree(Number(e.target.value))} className="w-full accent-emerald-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-2"><span>3 mois</span><span>24 mois</span></div>
              </div>
            </div>

            <div className="bg-[#0b1a2a] rounded-2xl p-8 text-white md:w-[300px] flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Votre mensualité estimée</p>
                <p className="text-4xl font-bold mb-6">{mensualite.toFixed(2)} € <span className="text-lg text-gray-400 font-normal">/mois</span></p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Taux fixe</span><span className="font-bold">{taux} %</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Coût des intérêts</span><span className="font-bold">{interets.toFixed(2)} €</span></div>
                  <div className="border-t border-gray-700 my-2"></div>
                  <div className="flex justify-between"><span className="text-gray-400">Total à rembourser</span><span className="font-bold">{totalRembourser.toFixed(2)} €</span></div>
                </div>
              </div>
              <Link to="/register" className="mt-8 bg-emerald-500 hover:bg-emerald-600 transition text-white font-bold py-3 px-4 rounded-xl flex justify-between items-center">
                Continuer ma demande <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMMENT CA MARCHE (Avec nouvelles icônes pro) */}
      <section id="comment-ca-marche" className="py-24 px-8 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-emerald-500 font-bold tracking-wider text-sm mb-2">VOTRE PRÊT, SIMPLEMENT</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0b1a2a] mb-4">Trois étapes. Pas une de plus.</h2>
          <p className="text-gray-500 mb-16 max-w-2xl mx-auto">Du besoin au financement, nous avons supprimé tout ce qui complique.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", titre: "Déposez votre demande", desc: "Quelques informations suffisent. Comptez moins de 5 minutes.", icon: <FileText size={28} /> },
              { num: "02", titre: "Recevez une réponse", desc: "Votre dossier est étudié avec attention, sans algorithme opaque.", icon: <ShieldCheck size={28} /> },
              { num: "03", titre: "Financez votre projet", desc: "Signez votre contrat et recevez vos fonds en toute sécurité.", icon: <Send size={28} /> }
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
        </div>
      </section>

      {/* 4. CARROUSEL D'AVIS (GAUCHE VERS DROITE) */}
      <section className="py-20 bg-[#0b1a2a] overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 mb-10 text-center md:text-left">
          <h2 className="text-3xl text-white font-serif italic">Ils nous font confiance.</h2>
        </div>
        
        <div className="relative w-full overflow-hidden flex">
          <div 
            className="flex gap-6 whitespace-nowrap px-4 hover:[animation-play-state:paused] group"
            style={{
              animation: 'marquee 30s linear infinite reverse'
            }}
          >
            <style>
              {`
                @keyframes marquee {
                  0% { transform: translateX(-50%); }
                  100% { transform: translateX(0%); }
                }
              `}
            </style>
            {avisDoubles.map((avis, index) => (
              <div key={index} className="bg-white/10 border border-white/20 p-8 rounded-2xl w-[400px] shrink-0 text-white backdrop-blur-sm cursor-pointer transition-transform hover:scale-105">
                <div className="text-emerald-400 text-4xl font-serif leading-none mb-4">“</div>
                <p className="text-lg font-serif italic mb-6 whitespace-normal">"{avis.texte}"</p>
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                    {avis.initiales}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{avis.nom}</p>
                    <p className="text-xs text-gray-400">{avis.ville}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL (Vert) */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-5xl mx-auto bg-emerald-500 rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div>
            <p className="text-emerald-100 font-bold tracking-wider text-sm mb-2">UN PROJET EN TÊTE ?</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Faisons-le avancer ensemble.</h2>
            <p className="text-emerald-50 text-lg">Simulez votre prêt gratuitement. Vous gardez toujours le contrôle.</p>
          </div>
          <Link to="/register" className="bg-white text-[#0b1a2a] font-bold py-4 px-8 rounded-xl whitespace-nowrap hover:scale-105 transition shadow-lg flex items-center gap-2">
            Démarrer ma demande <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      
    </div>
  );
}