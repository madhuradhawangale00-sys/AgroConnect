import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/resources/background1.jpeg')] bg-cover bg-center opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-24 relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-white mb-8 border-b border-slate-800 pb-4">Terms of Service</h1>
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-emerald-400 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing and using AgroConnect services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-emerald-400 mb-2">2. Description of Service</h2>
              <p>
                AgroConnect provides a transparent digital platform for farmers and corporate buyers to engage in direct contract farming. Our services include crop listings, direct negotiation rooms, automated digital contract generation, and milestone tracking.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-emerald-400 mb-2">3. User Obligations & KYC</h2>
              <p>
                Users of AgroConnect agree to:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                <li>Provide accurate identity and address verification documents for KYC approval</li>
                <li>Honor contracted produce quantities, agreed prices, and harvest delivery schedules</li>
                <li>Use the platform for lawful agricultural trade and fair market negotiation</li>
                <li>Comply with all applicable Indian agricultural trade laws and contract farming regulations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-emerald-400 mb-2">4. Intellectual Property</h2>
              <p>
                All content, trademarks, software code, and design materials available on AgroConnect are protected by applicable intellectual property laws.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-emerald-400 mb-2">5. Limitation of Liability</h2>
              <p>
                AgroConnect facilitates direct agreements between verified farmers and buyers. Platform liability is limited to digital contract records and dispute review tools provided to platform users.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


