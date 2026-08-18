"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KYCBadge from "@/components/KYCBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Tag, Filter, Loader2, Sparkles, ArrowRight, Sprout } from "lucide-react";
import Link from "next/link";

const INDIAN_STATES = [
  "All", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

export default function BuyerMarketplacePage() {
  const sessionData = useSession();
  const session = sessionData?.data;

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [cropSearch, setCropSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [minQuantityFilter, setMinQuantityFilter] = useState("");

  const buyerState = (session?.user as any)?.state || "Maharashtra";

  useEffect(() => {
    const fetchMarketplaceListings = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (cropSearch.trim()) params.append("crop", cropSearch.trim());
        if (stateFilter && stateFilter !== "All") params.append("state", stateFilter);
        if (maxPriceFilter.trim()) params.append("maxPrice", maxPriceFilter.trim());
        if (minQuantityFilter.trim()) params.append("minQuantity", minQuantityFilter.trim());

        const res = await fetch(`/api/listings?${params.toString()}`);
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

    fetchMarketplaceListings();
  }, [cropSearch, stateFilter, maxPriceFilter, minQuantityFilter]);

  // Split listings into "Recommended Near You" (matching buyer state) and "All Listings"
  const recommendedListings = listings.filter((l) => {
    const itemState = l.location?.state || l.fstate;
    return itemState && itemState.toLowerCase() === buyerState.toLowerCase();
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
      {/* Agricultural Radial Gradient Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-600/15 blur-[120px] rounded-full pointer-events-none -z-0" />
      <div className="absolute top-[300px] right-0 w-[500px] h-[350px] bg-amber-600/10 blur-[130px] rounded-full pointer-events-none -z-0" />

      {/* Background image overlay */}
      <div className="absolute inset-0 bg-[url('/resources/background2.jpeg')] bg-cover bg-center opacity-15 pointer-events-none -z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950 pointer-events-none -z-0" />

      <Header />

      <main className="flex-1 container max-w-7xl mx-auto px-4 py-24 relative z-10">
        {/* Header Hero */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sprout className="h-4 w-4" /> Live Harvest Procurement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Produce Marketplace & Contract Sourcing
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Browse verified crop listings directly from farmers across India, negotiate price terms, and form transparent contract farming deals.
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="bg-slate-900/90 border-slate-700/80 mb-10 shadow-2xl backdrop-blur-md">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-1.5 lg:col-span-2">
                <Label className="text-xs text-slate-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-emerald-400" /> Search Crop / Variety
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search Wheat, Paddy, Cotton, Soybean..."
                    value={cropSearch}
                    onChange={(e) => setCropSearch(e.target.value)}
                    className="pl-9 bg-slate-950 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500 h-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-200 font-bold uppercase tracking-wider">Farm State</Label>
                <Select value={stateFilter} onValueChange={(val) => setStateFilter(val)}>
                  <SelectTrigger className="bg-slate-950 border-slate-700 text-white h-11">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-60">
                    {INDIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-200 font-bold uppercase tracking-wider">Max Price (₹/unit)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 3000"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500 h-11"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setCropSearch("");
                  setStateFilter("All");
                  setMaxPriceFilter("");
                  setMinQuantityFilter("");
                }}
                className="border-slate-700 bg-slate-950/60 text-slate-200 hover:text-white hover:bg-slate-800 h-11 font-bold"
              >
                <Filter className="h-4 w-4 mr-2 text-amber-400" /> Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Near You Section */}
        {recommendedListings.length > 0 && !cropSearch && stateFilter === "All" && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-extrabold text-white">Recommended Near You ({buyerState})</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedListings.slice(0, 3).map((item) => (
                <MarketplaceCard key={`rec-${item._id}`} item={item} highlight />
              ))}
            </div>
          </div>
        )}

        {/* All Marketplace Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-white">All Crop Produce Listings</h2>
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              {listings.length} Available Listings
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-300 font-medium">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mr-2" /> Searching produce listings...
            </div>
          ) : listings.length === 0 ? (
            <Card className="bg-slate-900/90 border border-slate-700/80 text-center py-16 shadow-2xl backdrop-blur-md">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 text-amber-400 rounded-2xl shadow-inner">
                  <Search className="h-10 w-10" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="text-xl font-bold text-white">No Crop Listings Found</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    No farmers have listed produce matching your current search criteria. Try clearing or relaxing your search filters.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setCropSearch("");
                    setStateFilter("All");
                    setMaxPriceFilter("");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg mt-2"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <MarketplaceCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Marketplace Listing Card Component
function MarketplaceCard({ item, highlight = false }: { item: any; highlight?: boolean }) {
  return (
    <Card className={`bg-slate-900/90 border-slate-700/80 flex flex-col justify-between overflow-hidden group hover:border-emerald-500/60 transition-all shadow-xl rounded-2xl ${highlight ? "ring-2 ring-amber-500/50" : ""}`}>
      <div>
        {/* Banner Image */}
        <div className="h-48 w-full bg-slate-950 relative overflow-hidden">
          <img
            src={item.images?.[0] || "/resources/card1.png"}
            alt={item.cropName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <KYCBadge status={item.farmerKycStatus} size="sm" />
          </div>
          <div className="absolute top-3 right-3">
            <Badge className="bg-slate-950/90 backdrop-blur-md text-white font-mono border border-slate-700 font-bold px-2.5 py-1">
              {item.quantity} {item.unit || "Quintal"}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl text-white font-extrabold">{item.cropName}</CardTitle>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Farmer: <span className="text-emerald-400 font-bold">{item.farmerName || "Verified Farmer"}</span></p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-slate-200 pb-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-slate-300 text-xs font-semibold flex items-center gap-1">
              <Tag className="h-4 w-4 text-emerald-400" /> Expected Rate:
            </span>
            <span className="text-emerald-400 font-black text-lg bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
              ₹{item.expectedPricePerUnit} / {item.unit || "Quintal"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-amber-400" /> Expected Harvest:
            </span>
            <span className="text-white font-bold">
              {new Date(item.harvestDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" /> Location:
            </span>
            <span className="text-white font-bold truncate max-w-[160px]">
              {item.location?.city || item.fcity || "City"}, {item.location?.state || item.fstate || "State"}
            </span>
          </div>
        </CardContent>
      </div>

      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <Link href={`/listings/${item._id}`} className="w-full block">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-xl py-2.5 rounded-xl">
            View Produce & Start Deal <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
