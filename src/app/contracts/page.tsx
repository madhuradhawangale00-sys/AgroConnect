"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Tag, User as UserIcon, ShieldCheck, ArrowRight, Loader2, Sprout } from "lucide-react";
import Link from "next/link";

export default function ContractsDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
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
  }, [sessionStatus]);

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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileText className="h-8 w-8 text-emerald-400" />
              Digital Contracts & Order Tracking
            </h1>
            <p className="text-slate-400 mt-1">
              Track contract milestones, delivery schedules, payment confirmations, and digital signature records.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8">
          {["All", "Active", "Completed", "Disputed"].map((st) => (
            <Button
              key={st}
              variant={filter === st ? "default" : "ghost"}
              onClick={() => setFilter(st)}
              className={
                filter === st
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }
            >
              {st} Contracts
            </Button>
          ))}
        </div>

        {/* Contracts List Grid */}
        {filteredContracts.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800 py-16 text-center">
            <CardContent className="flex flex-col items-center gap-3">
              <Sprout className="h-10 w-10 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-300">No {filter !== "All" ? filter : ""} digital contracts found.</h3>
              <p className="text-sm text-slate-500">
                Contracts are generated automatically when a farmer and buyer accept terms during in-chat negotiation.
              </p>
              <Link href="/bdashboard/marketplace" className="mt-2">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Browse Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredContracts.map((c) => {
              const isFarmer = currentUserEmail === c.farmerEmail;
              const counterpartyName = isFarmer ? c.buyerName || c.buyerEmail : c.farmerName || c.farmerEmail;

              return (
                <Card key={c._id} className="bg-slate-900 border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          #{c._id.toString().slice(-6).toUpperCase()}
                        </span>
                        <CardTitle className="text-xl text-white font-bold mt-2">{c.cropName}</CardTitle>
                      </div>
                      <Badge className={c.status === "Closed" ? "bg-slate-700" : c.status === "Disputed" ? "bg-red-600" : "bg-emerald-600"}>
                        {c.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-400 text-xs">
                      Counterparty: <span className="text-slate-200 font-semibold">{counterpartyName}</span> ({isFarmer ? "Buyer" : "Farmer"})
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm text-slate-300 pb-4">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase">Agreed Rate</p>
                        <p className="text-lg font-extrabold text-emerald-400">₹{c.agreedPricePerUnit} <span className="text-xs font-normal text-slate-400">/ {c.unit || "Quintal"}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-semibold uppercase">Total Value</p>
                        <p className="text-base font-bold text-white">₹{c.totalAmount?.toLocaleString("en-IN")}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5 text-slate-500" /> Quantity:
                      </span>
                      <span className="text-slate-200 font-medium">{c.quantity} {c.unit || "Quintal"}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" /> Delivery Date:
                      </span>
                      <span className="text-slate-200 font-medium">
                        {new Date(c.deliveryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>

                  <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
                    <Link href={`/contracts/${c._id}`} className="w-full block">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center justify-center gap-2">
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
