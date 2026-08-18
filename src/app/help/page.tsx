import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Mail, Phone, Clock, Sprout } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Help() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/resources/background1.jpeg')] bg-cover bg-center opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
      <Header />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sprout className="h-4 w-4" /> AgroConnect Help Center
          </div>
          <h1 className="text-4xl font-extrabold text-white">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-sm">Find answers on digital contract generation, direct farmer-buyer negotiations, and KYC document approval.</p>
        </div>

        <div className="space-y-8">
          <Card className="bg-slate-900/90 border-slate-800 p-6 shadow-2xl backdrop-blur-md">
            <CardContent className="space-y-6 pt-2">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-emerald-400" /> Platform Guidance
              </h2>
              <div className="space-y-6 text-slate-300">
                <div>
                  <h3 className="text-lg font-bold text-emerald-400 mb-1">How do I create a farmer or buyer account?</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Click the <strong>Register</strong> button in the top navigation bar. Choose your role (Farmer or Buyer), enter your name, email, phone, and location details to set up your profile.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-400 mb-1">How does direct deal negotiation work?</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Buyers can express interest on produce marketplace listings to open a real-time direct chat room. Either party can propose a price offer. Once both parties click <strong>Sign Deal & Generate Contract</strong>, an official digital contract PDF is automatically generated.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-400 mb-1">Why is KYC Verification required?</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    KYC verification ensures that both farmers and corporate buyers are authenticated using Aadhar/PAN/GST identity documents, protecting both parties against breach of contract or non-delivery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/90 border-slate-800 p-6 shadow-2xl backdrop-blur-md">
            <CardContent className="space-y-4 pt-2">
              <h2 className="text-2xl font-bold text-white mb-2">Need Additional Support?</h2>
              <p className="text-slate-400 text-sm">Our agricultural support desk is available to assist you with contract execution or technical help.</p>
              
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <Mail className="h-4 w-4" /> Support Email
                  </div>
                  <p className="text-slate-400 font-mono">support@agroconnect-kisanmitra.in</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <Phone className="h-4 w-4" /> Phone Desk
                  </div>
                  <p className="text-slate-400 font-mono">+91 1800 2476 266</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <Clock className="h-4 w-4" /> Operating Hours
                  </div>
                  <p className="text-slate-400">Mon - Sat: 8 AM - 8 PM IST</p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/contact">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">Contact Support Desk</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
