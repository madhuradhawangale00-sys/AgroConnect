"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Tag, Loader2, Sprout } from "lucide-react";
import Link from "next/link";

export default function ContractsDashboardPage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const sessionStatus = sessionData?.status || "unauthenticated";
  const router = useRouter();

  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (sessionStatus === "authenticated") {
      fetchUserContracts();
    }
  }, [sessionStatus, router]);

  const fetchUserContracts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/contracts");
      const data = await res.json();
      if (data.success) {
        setContracts(data.contracts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter((c) => {
    if (filter === "All") return true;
    if (filter === "Active") return ["Confirmed", "In Progress"].includes(c.status);
    if (filter === "Completed") return ["Delivered", "Payment Completed", "Closed"].includes(c.status);
    if (filter === "Disputed") return c.status === "Disputed";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="flex items-center gap-3 text-lg font-medium text-slate-300">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            Loading Contract Farming Records...
          </div>
        </main>
      </div>
    );
  }

  const currentUserEmail = session?.user?.email;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-[url('/resources/background1.jpeg')] bg-cover bg-center opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/60 pointer-events-none" />
      <Header />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-24 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <FileText className="h-9 w-9 text-emerald-400" />
              Digital Contracts & Order Tracking
            </h1>
            <p className="text-slate-200 mt-2 text-base font-normal">
              Track contract milestones, delivery schedules, payment confirmations, and digital signature records.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 border-b-2 border-slate-800 pb-4 mb-8">
          {["All", "Active", "Completed", "Disputed"].map((st) => (
            <Button
              key={st}
              variant={filter === st ? "default" : "ghost"}
              onClick={() => setFilter(st)}
              className={
                filter === st
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  : "text-slate-200 hover:text-white hover:bg-slate-800 font-medium border border-slate-800"
              }
            >
              {st} Contracts
            </Button>
          ))}
        </div>

        {/* Contracts List Grid */}
        {filteredContracts.length === 0 ? (
          <Card className="bg-slate-900 border-2 border-slate-700/80 shadow-2xl rounded-2xl py-16 text-center">
            <CardContent className="flex flex-col items-center gap-3">
              <div className="p-3 bg-emerald-950 border border-emerald-500/30 rounded-xl text-emerald-400">
                <Sprout className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-white mt-2">No {filter !== "All" ? filter : ""} digital contracts found.</h3>
              <p className="text-slate-200 text-sm max-w-md">
                Contracts are generated automatically when a farmer and buyer accept terms during in-chat negotiation.
              </p>
              <Link href="/bdashboard/marketplace" className="mt-3">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg">Browse Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredContracts.map((c) => {
              const isFarmer = currentUserEmail === c.farmerEmail;
              const counterpartyName = isFarmer ? c.buyerName || c.buyerEmail : c.farmerName || c.farmerEmail;

              return (
                <Card key={c._id} className="bg-slate-900 border-2 border-slate-700/80 shadow-xl rounded-2xl flex flex-col justify-between hover:border-slate-600 transition-all overflow-hidden">
                  <CardHeader className="bg-slate-800/80 border-b border-slate-700 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                          #{c._id.toString().slice(-6).toUpperCase()}
                        </span>
                        <CardTitle className="text-xl text-white font-extrabold mt-2">{c.cropName}</CardTitle>
                      </div>
                      <Badge className={c.status === "Closed" ? "bg-slate-700 text-white font-semibold" : c.status === "Disputed" ? "bg-red-600 text-white font-semibold" : "bg-emerald-600 text-white font-bold"}>
                        {c.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-200 text-xs font-medium mt-1">
                      Counterparty: <span className="text-white font-bold">{counterpartyName}</span> ({isFarmer ? "Buyer" : "Farmer"})
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-3 text-sm text-slate-200 pb-4">
                    <div className="bg-slate-950 p-4 rounded-xl border-2 border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Agreed Rate</p>
                        <p className="text-xl font-black text-emerald-400">₹{c.agreedPricePerUnit} <span className="text-xs font-medium text-slate-300">/ {c.unit || "Quintal"}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Total Value</p>
                        <p className="text-lg font-extrabold text-white">₹{c.totalAmount?.toLocaleString("en-IN")}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-medium pt-1">
                      <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                        <Tag className="h-4 w-4 text-emerald-400" /> Quantity:
                      </span>
                      <span className="text-white font-bold text-sm">{c.quantity} {c.unit || "Quintal"}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                        <Calendar className="h-4 w-4 text-emerald-400" /> Delivery Date:
                      </span>
                      <span className="text-white font-bold text-sm">
                        {new Date(c.deliveryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>

                  <div className="p-4 border-t border-slate-800 bg-slate-950/60">
                    <Link href={`/contracts/${c._id}`} className="w-full block">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50">
                        <FileText className="h-4 w-4" /> View Digital Contract & PDF
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
