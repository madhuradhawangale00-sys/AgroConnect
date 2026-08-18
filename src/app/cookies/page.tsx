import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/resources/background1.jpeg')] bg-cover bg-center opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-24 relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-white mb-8 border-b border-slate-800 pb-4">Cookie Policy</h1>
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
            <p>
              This Cookie Policy explains how AgroConnect uses cookies and similar session tokens to recognize you when you visit our website. It explains what these technologies are and why we use them.
            </p>

            <div>
              <h2 className="text-xl font-bold text-emerald-400 mb-2">What are cookies?</h2>
              <p>
                Cookies are small data files that are placed on your browser when you visit a website. They allow web applications to maintain active user sessions, remember language preferences, and secure API requests.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-emerald-400 mb-2">Why do we use cookies?</h2>
              <p>
                AgroConnect uses essential cookies and JWT session tokens to:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                <li>Maintain secure NextAuth user authentication for farmers, buyers, and administrators</li>
                <li>Store active KYC verification badges and session permissions</li>
                <li>Ensure fast loading of crop marketplace filters and direct negotiation chats</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-emerald-400 mb-2">Managing Cookies</h2>
              <p>
                You can configure your browser to decline cookies if you prefer. However, essential session cookies are required to sign in and access contract farming dashboards.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


