"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KYCBadge from "@/components/KYCBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, MapPin, Calendar, Tag, User as UserIcon, ArrowLeft, Loader2, Sprout } from "lucide-react";
import Link from "next/link";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [initiatingChat, setInitiatingChat] = useState(false);

  const listingId = params?.id as string;

  useEffect(() => {
    if (listingId) {
      fetchListingDetails();
    }
  }, [listingId]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/listings?id=${listingId}`);
      const data = await res.json();
      if (data.success) {
        setListing(data.listing);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNegotiation = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      setInitiatingChat(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing._id,
          farmerEmail: listing.farmerEmail || listing.email,
        }),
      });

      const data = await res.json();
      if (data.success && data.chatId) {
        router.push(`/chat/${data.chatId}`);
      } else {
        alert(data.error || "Failed to start negotiation chat.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInitiatingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="flex items-center gap-3 text-lg font-medium text-slate-300">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            Loading Produce Details...
          </div>
        </main>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Header />
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-24 text-center">
          <Card className="bg-slate-900 border-slate-800 p-8">
            <CardContent>
              <h2 className="text-xl font-bold text-white mb-2">Produce Listing Not Found</h2>
              <p className="text-slate-400 mb-6">The crop listing you are looking for does not exist or has been removed.</p>
              <Link href="/bdashboard/marketplace">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Back to Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const images = listing.images && listing.images.length > 0 ? listing.images : ["/resources/card1.png"];
  const isOwner = session?.user?.email === (listing.farmerEmail || listing.email);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-24">
        <Link
          href={(session?.user as any)?.role === "Farmer" ? "/fdashboard/listing" : "/bdashboard/marketplace"}
          className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Listings
        </Link>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden aspect-video relative shadow-xl">
              <img
                src={images[activeImageIndex]}
                alt={listing.cropName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 px-3 py-1 font-semibold">
                  {listing.status || "Active"}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative rounded-lg overflow-hidden h-20 w-28 border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? "border-emerald-500 scale-105" : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Farm Location Details Card */}
            <Card className="bg-slate-900 border-slate-800 text-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-400" /> Farm Location & Regional Logistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">City / Village:</span>
                  <span className="text-white font-medium">{listing.location?.city || listing.fcity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">State:</span>
                  <span className="text-white font-medium">{listing.location?.state || listing.fstate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Pincode:</span>
                  <span className="text-white font-medium">{listing.location?.pincode || listing.fpincode || "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Specifications & Farmer Profile */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-slate-900 border-slate-800 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                    {listing.unit || "Quintal"} Listing
                  </span>
                  <KYCBadge status={listing.farmerKycStatus} size="sm" />
                </div>
                <CardTitle className="text-3xl font-bold text-white mt-2">{listing.cropName}</CardTitle>
                {listing.variety && (
                  <CardDescription className="text-slate-400 text-sm">
                    Variety / Grade: <span className="text-white font-medium">{listing.variety}</span>
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price Display */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Expected Price</p>
                    <p className="text-3xl font-extrabold text-emerald-400 mt-0.5">
                      ₹{listing.expectedPricePerUnit}
                      <span className="text-sm font-normal text-slate-400"> / {listing.unit || "Quintal"}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Total Crop Value</p>
                    <p className="text-xl font-bold text-white mt-0.5">
                      ₹{(listing.expectedPricePerUnit * listing.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Specs List */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-slate-500" /> Quantity Offered:
                    </span>
                    <span className="text-white font-bold">{listing.quantity} {listing.unit || "Quintal"}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" /> Expected Harvest Date:
                    </span>
                    <span className="text-white font-semibold">{new Date(listing.harvestDate).toLocaleDateString()}</span>
                  </div>

                  {listing.croppingDate && (
                    <div className="flex items-center justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-slate-500" /> Sowing Date:
                      </span>
                      <span className="text-slate-200 font-medium">{new Date(listing.croppingDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Farmer Info Box */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-800 rounded-full text-emerald-400">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{listing.farmerName || "Farmer"}</p>
                        <p className="text-xs text-slate-400">{listing.farmerEmail || listing.email}</p>
                      </div>
                    </div>
                    <KYCBadge status={listing.farmerKycStatus} size="sm" showText={false} />
                  </div>
                </div>

                {/* Action CTA */}
                {!isOwner ? (
                  <Button
                    onClick={handleStartNegotiation}
                    disabled={initiatingChat}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg text-base flex items-center justify-center gap-2"
                  >
                    {initiatingChat ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" /> Initializing Negotiation Chat...
                      </span>
                    ) : (
                      <>
                        <MessageSquare className="h-5 w-5" /> Start Negotiation & Make Offer
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-lg text-center text-xs text-emerald-300 font-medium">
                    This is your produce listing. You will receive negotiation messages when buyers express interest.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
