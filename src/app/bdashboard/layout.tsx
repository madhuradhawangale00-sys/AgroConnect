import '@/app/globals.css'; // Absolute import based on the project root
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'AgroConnect - Buyer Dashboard',
  description: 'Personalized dashboard for crop buyers',
};

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

