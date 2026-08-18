"use client";

import Link from "next/link";
import { ShieldCheck, Sprout, MessageSquare, FileText, Search, Truck, ArrowRight, UserCheck, Building2, UserPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[url('/resources/background1.jpeg')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="container max-w-5xl mx-auto px-4 relative z-10 text-center space-y-6 py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold uppercase tracking-wider shadow-lg">
            <Sprout className="h-4 w-4" /> SIH 2024 Problem Statement 1640 Solution
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Agro<span className="text-emerald-400">Connect</span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            A transparent digital contract farming marketplace connecting farmers directly with corporate buyers, replacing informal deals with verified trackable workflows.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-xl shadow-emerald-950 flex items-center gap-2">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/bdashboard/marketplace">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white px-8 py-6 text-base rounded-xl">
                Browse Produce Marketplace
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">Direct Deals</p>
              <p className="text-xs text-emerald-400 mt-1 font-medium">Farmer-to-Buyer</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">KYC Verified</p>
              <p className="text-xs text-emerald-400 mt-1 font-medium">Identity & Address</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">Digital Sign</p>
              <p className="text-xs text-emerald-400 mt-1 font-medium">Auto PDF Contracts</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">Milestones</p>
              <p className="text-xs text-emerald-400 mt-1 font-medium">Order Tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Role Portals Section */}
      <section className="py-20 bg-slate-900/60 border-y border-slate-800/80">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white">Three-Role Platform Ecosystem</h2>
            <p className="text-slate-400 mt-2 text-sm max-w-xl mx-auto">
              Custom tailored portals for Farmers, Corporate Buyers, and System Administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Farmer Card */}
            <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
              <CardHeader>
                <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl w-fit mb-3 border border-emerald-800">
                  <Sprout className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-white">Farmer Portal</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  List upcoming harvests with variety, expected price, harvest date, and multi-photo uploads. Receive price proposals from corporate buyers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Submit KYC documents for verified badge
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Negotiate price & quantity terms directly
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Digital signature & PDF contract download
                </div>
                <div className="pt-4">
                  <Link href="/fdashboard/listing">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
                      Farmer Dashboard <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Buyer Card */}
            <Card className="bg-slate-900 border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between">
              <CardHeader>
                <div className="p-3 bg-amber-950 text-amber-400 rounded-xl w-fit mb-3 border border-amber-800">
                  <Building2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-white">Buyer & Trader Portal</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Search & filter produce listings by crop, location, price, and harvest dates. View recommendations near your location.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" /> Filter verified farmers near your state
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" /> Propose in-chat formal price & quantity offers
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" /> Track delivery & settlement milestones
                </div>
                <div className="pt-4">
                  <Link href="/bdashboard/marketplace">
                    <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs">
                      Buyer Marketplace <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between">
              <CardHeader>
                <div className="p-3 bg-blue-950 text-blue-400 rounded-xl w-fit mb-3 border border-blue-800">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-white">Admin & Oversight</CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Review applicant identity & address proof documents in the KYC queue, award green verified badges, and resolve contract disputes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" /> Inspect identity proof photos & Aadhar IDs
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" /> Approve or issue feedback rejections
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" /> Platform oversight & dispute intervention
                </div>
                <div className="pt-4">
                  <Link href="/admin/kyc">
                    <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:text-white text-xs">
                      Admin KYC Queue <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Set Workflow Section */}
      <section className="py-24 bg-slate-950">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">End-to-End Digital Workflow</h2>
            <p className="text-slate-400 mt-2 text-sm max-w-2xl mx-auto">
              From identity verification to digital contract execution and delivery milestone tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "1. KYC Verification & Badges",
                desc: "Farmers and buyers submit ID & address proof photos. Admins approve submissions to award a trusted green 'KYC Verified' profile badge.",
              },
              {
                icon: Sprout,
                title: "2. Produce Listing Form",
                desc: "Farmers create detailed crop listings with crop name, variety, expected price/quintal, harvest dates, farm location, and multi-image uploads.",
              },
              {
                icon: Search,
                title: "3. Discovery & Filters",
                desc: "Buyers search listings by crop type, farm location, price range, and quantity with 'Recommended Near You' location matching.",
              },
              {
                icon: MessageSquare,
                title: "4. Real-time Chat & Offers",
                desc: "Direct in-app negotiation room per listing with in-chat formal price offer proposals, counter-offers, and accept/reject actions.",
              },
              {
                icon: FileText,
                title: "5. Digital Contract Signing",
                desc: "Mutual deal acceptance automatically generates a structured digital contract with timestamps, signatures, and downloadable PDF document.",
              },
              {
                icon: Truck,
                title: "6. Milestone Order Tracking",
                desc: "Track contract status pipeline: Confirmed ➔ In Progress ➔ Delivered ➔ Payment Settled ➔ Closed with live notifications.",
              },
            ].map((f, i) => {
              const IconComp = f.icon;
              return (
                <Card key={i} className="bg-slate-900 border-slate-800 p-6 flex flex-col justify-between">
                  <div>
                    <div className="p-3 bg-slate-800 text-emerald-400 rounded-xl w-fit mb-4">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
