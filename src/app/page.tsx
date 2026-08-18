"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Sprout,
  MessageSquare,
  FileText,
  Truck,
  ArrowRight,
  Building2,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  Award,
  Sparkles,
  Lock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
      {/* Sleek Agricultural Radial Gradient Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-600/15 blur-[120px] rounded-full pointer-events-none -z-0" />
      <div className="absolute top-[400px] right-0 w-[600px] h-[400px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none -z-0" />

      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden z-10">
        <div className="container max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-md">
              <Sparkles className="h-4 w-4 text-emerald-400" /> Direct Contract Farming Platform
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Agro<span className="text-emerald-400">Connect</span>
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-emerald-300 leading-snug">
              Connect directly with buyers. Get paid on time.
            </p>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              A transparent digital marketplace connecting verified farmers directly with corporate buyers — replacing informal deals with legal contracts, real-time negotiations, and automated milestone tracking.
            </p>

            {/* Dual Signup CTA Pathways */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-6 text-base rounded-xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 group">
                  <Sprout className="h-5 w-5" /> Join as a Farmer
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/bdashboard/marketplace" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 hover:text-white px-8 py-6 text-base rounded-xl font-bold shadow-xl flex items-center justify-center gap-2">
                  <Building2 className="h-5 w-5 text-amber-400" /> Join as a Corporate Buyer
                </Button>
              </Link>
            </div>

            {/* Hero Quick Key Metrics */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">100%</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">KYC Verified Parties</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">0%</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Middleman Cuts</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">Auto PDF</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Legal Contracts</p>
              </div>
            </div>
          </div>

          {/* Right Hero Distinctive Visual Accent: Floating Contract Preview UI Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-5 hover:border-emerald-500/40 transition-all duration-300">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-950 border border-emerald-500/40 text-emerald-400 rounded-xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Digital Contract #84920</span>
                    <h3 className="text-base font-extrabold text-white">Organic Durum Wheat</h3>
                  </div>
                </div>
                <Badge variant="verified">
                  Verified ✓
                </Badge>
              </div>

              {/* Deal Calculation Spec */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Contracted Quantity:</span>
                  <span className="text-white font-bold">500 Quintal</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Agreed Rate:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">₹2,450 / Quintal</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-800 pt-2">
                  <span className="text-slate-300 font-bold uppercase">Total Deal Value:</span>
                  <span className="text-white font-black text-base">₹12,25,000</span>
                </div>
              </div>

              {/* Parties Signature Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Farmer Signature</p>
                  <p className="text-emerald-400 font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Signed
                  </p>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Buyer Signature</p>
                  <p className="text-emerald-400 font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Signed
                  </p>
                </div>
              </div>

              {/* Status Bar */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-emerald-400" /> Digital Contract Generated
                </span>
                <span className="font-mono text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded font-bold text-emerald-200">PDF Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-16 bg-slate-900/70 border-y border-slate-800/80 relative z-10">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Built for Agricultural Trust & Transparency</h2>
            <p className="text-slate-400 text-sm mt-1">Enterprise-grade security features protecting both farmers and corporate buyers.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-900 border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-md">
              <CardContent className="p-0 space-y-3">
                <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl w-fit border border-emerald-800">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">100% Verified Users</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every farmer and buyer profile is authenticated through admin-reviewed Aadhar, PAN, and GST identity verification.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-md">
              <CardContent className="p-0 space-y-3">
                <div className="p-3 bg-amber-950 text-amber-400 rounded-xl w-fit border border-amber-800">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Transparent Pricing</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct price negotiations without hidden commissions. Farmers get fair market rates and buyers get guaranteed supply.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-md">
              <CardContent className="p-0 space-y-3">
                <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl w-fit border border-emerald-800">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Legally Binding Contracts</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Mutual agreement auto-generates legal PDF contracts complete with digital signatures and milestone settlement terms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6 flex flex-col justify-between hover:border-sky-500/50 transition-all shadow-md">
              <CardContent className="p-0 space-y-3">
                <div className="p-3 bg-sky-950 text-sky-400 rounded-xl w-fit border border-sky-800">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Milestone Tracking</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Track harvest status pipeline from contract confirmation to crop delivery, quality verification, and payment closure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* "How It Works" Section: 4 Numbered Steps */}
      <section className="py-24 relative z-10">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-950/40">
              Simple 4-Step Process
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">How AgroConnect Works</h2>
            <p className="text-slate-400 text-base">Four simple steps from registration to contract execution and guaranteed payment.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <Card className="bg-slate-900 border-slate-800 p-6 relative flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xl group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-700 font-mono">01</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">1. Register & KYC</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sign up as a Farmer or Buyer and submit identity & address proof documents to receive a verified platform badge.
                </p>
              </div>
              <div className="pt-6">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  Identity Verification <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="bg-slate-900 border-slate-800 p-6 relative flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xl group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Sprout className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-700 font-mono">02</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">2. List Produce</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Farmers post upcoming harvest listings with crop variety, expected price per quintal, delivery month, and farm photos.
                </p>
              </div>
              <div className="pt-6">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  Marketplace Discovery <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="bg-slate-900 border-slate-800 p-6 relative flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-950 text-amber-400 rounded-xl border border-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-700 font-mono">03</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">3. Negotiate Directly</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect in a real-time negotiation room to propose price offers, discuss terms, and align on quantities.
                </p>
              </div>
              <div className="pt-6">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  Direct In-Chat Offers <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>

            {/* Step 4 */}
            <Card className="bg-slate-900 border-slate-800 p-6 relative flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xl group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-700 font-mono">04</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">4. Sign Contract</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Both parties click to sign the agreement, auto-generating a legal PDF contract with milestone tracking.
                </p>
              </div>
              <div className="pt-6">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  Download PDF Contract <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* User Role Portals Section */}
      <section className="py-20 bg-slate-900/60 border-y border-slate-800/80 relative z-10">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-white">Designed for Every Stakeholder</h2>
            <p className="text-slate-400 text-sm mt-1">Dedicated portals built for farmers, corporate procurement teams, and platform administrators.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Farmer Card */}
            <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-xl">
              <CardHeader>
                <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl w-fit mb-3 border border-emerald-800">
                  <Sprout className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-white">Farmer Portal</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  List upcoming harvests with variety, expected price, harvest date, and farm photos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-slate-300">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Submit KYC for green verified badge
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Negotiate price & quantity directly
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Digital signature & PDF contract download
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/fdashboard/listing">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5">
                      Open Farmer Dashboard <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Buyer Card */}
            <Card className="bg-slate-900 border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-xl">
              <CardHeader>
                <div className="p-3 bg-amber-950 text-amber-400 rounded-xl w-fit mb-3 border border-amber-800">
                  <Building2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-white">Buyer & Trader Portal</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Browse crop listings by state, price, and quantity with location matching.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-slate-300">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" /> Filter verified farmers near your state
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" /> Submit formal in-chat price proposals
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" /> Track milestone delivery & settlement
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/bdashboard/marketplace">
                    <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2.5">
                      Explore Buyer Marketplace <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="bg-slate-900 border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between shadow-xl">
              <CardHeader>
                <div className="p-3 bg-sky-950 text-sky-400 rounded-xl w-fit mb-3 border border-sky-800">
                  <Award className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-white">Admin & Verification Queue</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Inspect applicant identity & address proof documents to award verified badges.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-slate-300">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" /> Review Aadhar/PAN identity proofs
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" /> Approve or issue feedback rejections
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" /> Platform audit & contract dispute review
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/admin/kyc">
                    <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:text-white text-xs font-bold py-2.5">
                      Admin Verification Queue <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 relative z-10 text-center">
        <div className="container max-w-4xl mx-auto px-4 space-y-6 bg-slate-900/90 border border-slate-800 p-12 rounded-3xl shadow-2xl backdrop-blur-xl">
          <Badge variant="verified" className="px-3 py-1">Ready to Start Direct Farming Deals?</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Join AgroConnect Today</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Connect directly with verified agricultural buyers and farmers across India. Streamline contract farming with automated digital documents and secure milestone tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register?role=Farmer" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl flex items-center justify-center gap-2">
                <Sprout className="h-5 w-5" /> Register as a Farmer
              </Button>
            </Link>
            <Link href="/register?role=Buyer" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl flex items-center justify-center gap-2">
                <Building2 className="h-5 w-5 text-amber-300" /> Register as a Buyer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

