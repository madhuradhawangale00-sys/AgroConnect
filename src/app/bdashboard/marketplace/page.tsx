"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KYCBadge from "@/components/KYCBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    fetchMarketplaceListings();
  }, [cropSearch, stateFilter, maxPriceFilter, minQuantityFilter]);

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

  // Split listings into "Recommended Near You" (matching buyer state) and "All Listings"
  const recommendedListings = listings.filter((l) => {
    const itemState = l.location?.state || l.fstate;
    return itemState && itemState.toLowerCase() === buyerState.toLowerCase();
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Farming background overlay */}
      <div className="absolute inset-0 bg-[url('/resources/background2.jpeg')] bg-cover bg-center opacity-35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950 pointer-events-none" />
      <Header />

      <main className="flex-1 container max-w-7xl mx-auto px-4 py-24">
        {/* Header Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Sprout className="h-8 w-8 text-emerald-400" />
            Produce Marketplace & Contract Sourcing
          </h1>
          <p className="text-slate-400 mt-1">
            Browse verified crop listings directly from farmers, negotiate price terms, and form transparent contract farming deals.
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="bg-slate-900 border-slate-800 mb-10 shadow-xl">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-1.5 lg:col-span-2">
                <Label className="text-xs text-slate-400 font-semibold uppercase">Search Crop / Variety</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search Wheat, Paddy, Cotton, Soybean..."
                    value={cropSearch}
                    onChange={(e) => setCropSearch(e.target.value)}
                    className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400 font-semibold uppercase">Farm State</Label>
                <Select value={stateFilter} onValueChange={(val) => setStateFilter(val)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-60">
                    {INDIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400 font-semibold uppercase">Max Price (₹/unit)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 3000"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
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
                className="border-slate-700 text-slate-300 hover:text-white"
              >
                <Filter className="h-4 w-4 mr-2" /> Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Near You Section */}
        {recommendedListings.length > 0 && !cropSearch && stateFilter === "All" && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Recommended Near You ({buyerState})</h2>
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
            <h2 className="text-xl font-bold text-white">All Crop Produce Listings</h2>
            <span className="text-sm text-slate-400 font-mono">{listings.length} Available Listings</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mr-2" /> Searching produce listings...
            </div>
          ) : listings.length === 0 ? (
            <Card className="bg-slate-900 border-slate-800 text-center py-16">
              <CardContent className="flex flex-col items-center gap-3">
                <Search className="h-10 w-10 text-slate-600" />
                <h3 className="text-lg font-medium text-slate-300">No crop listings match your search criteria.</h3>
                <p className="text-sm text-slate-500">Try clearing or relaxing your search filters above.</p>
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
    <Card className={`bg-slate-900 border-slate-800 flex flex-col justify-between overflow-hidden group hover:border-emerald-500/50 transition-all ${highlight ? "ring-1 ring-amber-500/30" : ""}`}>
      <div>
        {/* Banner */}
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
            <Badge className="bg-slate-900/80 backdrop-blur-md text-white font-mono border border-slate-700">
              {item.quantity} {item.unit || "Quintal"}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl text-white font-bold">{item.cropName}</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">By {item.farmerName || "Farmer"}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2.5 text-sm text-slate-300 pb-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-emerald-400" /> Expected Price:
            </span>
            <span className="text-emerald-400 font-bold text-base">
              ₹{item.expectedPricePerUnit} / {item.unit || "Quintal"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-500" /> Harvest Date:
            </span>
            <span className="text-slate-200 font-medium">
              {new Date(item.harvestDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-500" /> Location:
            </span>
            <span className="text-slate-200 font-medium truncate max-w-[150px]">
              {item.location?.city || item.fcity}, {item.location?.state || item.fstate}
            </span>
          </div>
        </CardContent>
      </div>

      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <Link href={`/listings/${item._id}`} className="w-full block">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center justify-center gap-1.5 shadow-md">
            View Listing & Start Negotiation <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
