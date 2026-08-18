"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, ArrowRight, Loader2 } from "lucide-react";

export default function BuyerContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/contracts");
      const data = await res.json();
      if (data.success && Array.isArray(data.contracts)) {
        setContracts(data.contracts);
      } else if (data.error) {
        setError(data.error);
      } else {
        setContracts([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load contracts.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/resources/background4.jpeg')] bg-cover bg-center opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/60 pointer-events-none" />
      <Header />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-24 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <FileText className="h-8 w-8 text-emerald-400" /> My Procurement Contracts
            </h1>
            <p className="text-slate-400 mt-1">View active digital contracts, agreed pricing, and milestone tracking.</p>
          </div>
          <Link href="/contracts">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
              Full Contracts Portal <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mr-2" /> Loading contracts...
          </div>
        ) : error ? (
          <Card className="bg-slate-900 border-slate-800 text-center py-12 text-red-400">
            <CardContent>{error}</CardContent>
          </Card>
        ) : contracts.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800 text-center py-16">
            <CardContent className="flex flex-col items-center gap-3">
              <FileText className="h-10 w-10 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-300">No Procurement Contracts Found</h3>
              <p className="text-slate-500 text-sm max-w-md">Browse produce marketplace listings and negotiate with farmers to finalize deals.</p>
              <Link href="/bdashboard/marketplace" className="mt-2">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Browse Produce Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-950/80 border-b border-slate-800">
                  <TableHead className="text-slate-300 font-bold">Farmer Name</TableHead>
                  <TableHead className="text-slate-300 font-bold">Crop</TableHead>
                  <TableHead className="text-slate-300 font-bold">Quantity</TableHead>
                  <TableHead className="text-slate-300 font-bold">Agreed Rate</TableHead>
                  <TableHead className="text-slate-300 font-bold">Total Deal Value</TableHead>
                  <TableHead className="text-slate-300 font-bold">Status</TableHead>
                  <TableHead className="text-slate-300 font-bold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((c) => (
                  <TableRow key={c._id} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                    <TableCell className="font-semibold text-white">{c.farmerName || c.farmerEmail}</TableCell>
                    <TableCell className="font-bold text-emerald-400">{c.cropName}</TableCell>
                    <TableCell className="text-slate-200">{c.quantity} {c.unit || "Quintal"}</TableCell>
                    <TableCell className="text-slate-200">₹{c.agreedPricePerUnit} / {c.unit || "Quintal"}</TableCell>
                    <TableCell className="font-extrabold text-white">₹{c.totalAmount?.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {c.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/contracts/${c._id}`}>
                        <Button size="sm" variant="outline" className="border-slate-700 text-slate-200 hover:text-white">
                          View PDF Deal
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

