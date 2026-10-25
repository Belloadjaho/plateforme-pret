export default function Footer() {
  return (
    <footer className="bg-[#0b1a2a] py-8 px-8 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
      <div className="flex items-center gap-2">
        <div className="bg-emerald-500 text-white p-1 rounded-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
        </div>
        <span className="text-white font-bold text-lg">Prêt<span className="text-emerald-500">Direct</span></span>
      </div>
      <p className="flex gap-4">
        <a href="#" className="hover:text-white transition">Mentions légales</a>
        <span>·</span>
        <a href="#" className="hover:text-white transition">Confidentialité</a>
        <span>·</span>
        <a href="#" className="hover:text-white transition">Conditions</a>
      </p>
      <p>© 2026 PrêtDirect</p>
    </footer>
  );
}