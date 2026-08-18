"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sprout, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry"
];

const COMMON_CROPS = [
  "Wheat", "Paddy (Rice)", "Cotton", "Sugarcane", "Soybean", "Maize (Corn)",
  "Mustard", "Chickpea (Chana)", "Potato", "Onion", "Tomato", "Turmeric", "Groundnut", "Banana"
];

export default function AddProduceListingPage() {
  const sessionData = useSession();
  const sessionStatus = sessionData?.status || "unauthenticated";
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Quintal");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [croppingDate, setCroppingDate] = useState("");
  const [harvestDate, setHarvestDate] = useState("");

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [pincode, setPincode] = useState("");

  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cropName || !quantity || !expectedPrice || !harvestDate || !city || !state) {
      setError("Please fill in all required fields marked with *.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName,
          variety,
          quantity: Number(quantity),
          unit,
          expectedPricePerUnit: Number(expectedPrice),
          croppingDate,
          harvestDate,
          location: { city, district, state, pincode },
          images: images.length > 0 ? images : ["/resources/card1.png"],
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to create produce listing.");
      } else {
        router.push("/fdashboard/listing");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sessionStatus === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Minimal farming background overlay */}
      <div className="fixed inset-0 -z-10 bg-[url('/resources/background5.jpeg')] bg-cover bg-center opacity-15" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
      <Header />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-24">
        <Link
          href="/fdashboard/listing"
          className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Produce Listings
        </Link>

        <Card className="bg-slate-900 border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Sprout className="h-7 w-7 text-emerald-400" />
              Create New Produce Listing
            </CardTitle>
            <CardDescription className="text-slate-400">
              Publish your upcoming crop harvest to connect directly with corporate buyers, food processors, and traders.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="p-4 mb-6 text-sm text-red-300 bg-red-950/50 border border-red-800 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Crop Specifications */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-emerald-400 border-b border-slate-800 pb-2">
                  1. Crop & Harvest Details
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cropName" className="text-slate-300">
                      Crop Name <span className="text-red-400">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="cropName"
                        value={cropName}
                        onChange={(e) => setCropName(e.target.value)}
                        placeholder="e.g. Organic Sharbati Wheat"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        required
                      />
                      <Select onValueChange={(val) => setCropName(val)}>
                        <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Quick Pick" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                          {COMMON_CROPS.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variety" className="text-slate-300">Crop Variety / Grade</Label>
                    <Input
                      id="variety"
                      value={variety}
                      onChange={(e) => setVariety(e.target.value)}
                      placeholder="e.g. Lokwan / Grade A / Hybrid 101"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-slate-300">
                      Quantity Available <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 500"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit" className="text-slate-300">Quantity Unit</Label>
                    <Select value={unit} onValueChange={(val) => setUnit(val)}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select Unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="Quintal">Quintal (100 kg)</SelectItem>
                        <SelectItem value="Ton">Ton (1000 kg)</SelectItem>
                        <SelectItem value="Kg">Kilogram (kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-slate-300">
                      Expected Price (₹ per {unit}) <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="1"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value)}
                      placeholder="e.g. 2450"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="croppingDate" className="text-slate-300">Cropping / Sowing Date</Label>
                    <Input
                      id="croppingDate"
                      type="date"
                      value={croppingDate}
                      onChange={(e) => setCroppingDate(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="harvestDate" className="text-slate-300">
                      Expected Harvest Date <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="harvestDate"
                      type="date"
                      value={harvestDate}
                      onChange={(e) => setHarvestDate(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Farm Location */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-emerald-400 border-b border-slate-800 pb-2">
                  2. Farm Location & Logistics
                </h3>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-slate-300">
                      City / Village <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Nashik"
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-slate-300">District</Label>
                    <Input
                      id="district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Nashik District"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-slate-300">
                      State <span className="text-red-400">*</span>
                    </Label>
                    <Select value={state} onValueChange={(val) => setState(val)}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {INDIAN_STATES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-slate-300">Pincode</Label>
                    <Input
                      id="pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 422001"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Crop Photos (Multiple Images) */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-emerald-400 border-b border-slate-800 pb-2">
                  3. Crop Photos (Multi-Image Upload)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-950 aspect-video">
                      <img src={img} alt={`Crop photo ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-800/40 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer p-4 text-center transition-colors">
                    <Plus className="h-6 w-6 text-emerald-400 mb-1" />
                    <span className="text-xs text-slate-300 font-medium">Add Photo</span>
                    <span className="text-[10px] text-slate-500">JPG, PNG</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg shadow-lg text-base"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> Publishing Produce Listing...
                  </span>
                ) : (
                  "Publish Produce Listing on AgroConnect Marketplace"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
