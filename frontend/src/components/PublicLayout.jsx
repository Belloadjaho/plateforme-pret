import Header from './Header';
import Footer from './Footer';

export default function PublicLayout({ children }) {
  return (
    <div className="font-sans text-gray-900 min-h-screen flex flex-col bg-[#f4f6f8]">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}