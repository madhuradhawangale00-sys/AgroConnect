"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KYCBadge from "@/components/KYCBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, MapPin, Tag, Loader2, Sprout, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MyFarmerListingsPage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const sessionStatus = sessionData?.status || "unauthenticated";
  const router = useRouter();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (sessionStatus === "authenticated") {
      fetchMyListings();
    }
  }, [sessionStatus, router]);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/listings?myListings=true");
      const data = await res.json();
      if (data.success) {
        setListings(data.listings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this produce listing?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/listings?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setListings((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const kycStatus = (session?.user as any)?.kycStatus || "Not Submitted";

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-[url('/resources/background4.jpeg')] bg-cover bg-center opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/60 pointer-events-none" />
      <Header />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sprout className="h-8 w-8 text-emerald-400" />
                My Produce Listings
              </h1>
              <KYCBadge status={kycStatus} />
            </div>
            <p className="text-slate-400">
              Manage your active crop listings, view negotiation status, and track contracts with buyers.
            </p>
          </div>

          <Link href="/fdashboard/listing/add">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Produce Listing
            </Button>
          </Link>
        </div>

        {/* Listings List */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mr-2" /> Loading produce listings...
          </div>
        ) : listings.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800 text-center py-16">
            <CardContent className="flex flex-col items-center gap-4">
              <div className="p-4 bg-slate-800 rounded-full text-slate-400">
                <Sprout className="h-10 w-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">No Produce Listings Created Yet</h3>
              <p className="text-slate-400 max-w-md text-sm">
                List your upcoming harvests (wheat, paddy, cotton, vegetables) to receive price offers and sign digital farming contracts.
              </p>
              <Link href="/fdashboard/listing/add">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white mt-2">
                  Create First Crop Listing
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <Card key={item._id} className="bg-slate-900 border-slate-800 flex flex-col justify-between overflow-hidden group hover:border-slate-700 transition-colors">
                <div>
                  {/* Image Banner */}
                  <div className="h-44 w-full bg-slate-950 relative overflow-hidden">
                    <img
                      src={item.images?.[0] || "/resources/card1.png"}
                      alt={item.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={
                          item.status === "Active"
                            ? "bg-emerald-600 text-white"
                            : item.status === "Under Negotiation"
                            ? "bg-amber-500 text-white"
                            : item.status === "Contracted"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-white"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-white font-bold">{item.cropName}</CardTitle>
                    {item.variety && (
                      <CardDescription className="text-emerald-400 text-xs font-medium">
                        Variety: {item.variety}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-2 text-sm text-slate-300 pb-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Tag className="h-4 w-4 text-slate-500" /> Expected Price:
                      </span>
                      <span className="text-white font-bold text-base">
                        ₹{item.expectedPricePerUnit} / {item.unit || "Quintal"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total Quantity:</span>
                      <span className="text-slate-200 font-medium">{item.quantity} {item.unit || "Quintal"}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-slate-500" /> Harvest Date:
                      </span>
                      <span className="text-slate-200 font-medium">
                        {new Date(item.harvestDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-500" /> Location:
                      </span>
                      <span className="text-slate-200 font-medium truncate max-w-[160px]">
                        {item.location?.city || item.fcity}, {item.location?.state || item.fstate}
                      </span>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-2 bg-slate-950/40">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                    disabled={deletingId === item._id}
                    onClick={() => handleDelete(item._id)}
                  >
                    {deletingId === item._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </>
                    )}
                  </Button>

                  <Link href={`/listings/${item._id}`}>
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
                      View Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
