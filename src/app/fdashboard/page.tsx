'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, List, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PageBackground } from '@/components/PageBackground'
// import { Listing } from './listing/mockData'

export default function DashboardPage() {
  const [listings, setListings] = useState<Listing[]>([]) // Ensure listings is always an array
  const [loading, setLoading] = useState(true) // Track the loading state for the API request
  const [error, setError] = useState<string | null>(null) // Handle errors

  interface Listing {
    id: string;              // Unique identifier for the listing
    title: string;            // Title of the listing (e.g., product name, crop name)
    description: string;       // Description of the listing
    price: number;             // Price of the item
    location: string;          // Location where the listing is available
    category?: string;         // Optional category for better classification
    contactInfo?: {
      name: string;            // Contact person's name
      phone: string;            // Contact phone number
      email?: string;           // Optional contact email
    };
    croptype:string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    quantity: string;

  }
  

  // Fetch listings from the API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/listings?myListings=true");
        const data = await response.json();
        if (data.success && Array.isArray(data.listings)) {
          const mappedListings = data.listings.map((item: any) => ({
            id: item._id,
            title: item.title || item.cropName,
            description: item.description || "",
            price: item.pricePerUnit || item.price,
            location: typeof item.location === "object" ? `${item.location.city || ""}, ${item.location.state || ""}` : (item.location || ""),
            croptype: item.cropName || item.croptype || "Crop",
            status: item.status === "Active" ? "Accepted" : item.status || "Pending",
            quantity: `${item.quantity || ""} ${item.quantityUnit || "Quintal"}`.trim(),
          }));
          setListings(mappedListings);
        } else {
          setListings([]);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching listings:", error.message);
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <DashboardLayout>
      <PageBackground imageSrc="/resources/background2.jpeg" />
      <div className="space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Farmer Control Center</h1>
            <p className="text-slate-300 text-sm mt-1">Manage active crop produce listings, contracts, and buyer proposals.</p>
          </div>
          <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-950/50">
            <Link href="/fdashboard/listing/add">Create New Produce Listing</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-slate-900/90 border-2 border-slate-700/80 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase text-slate-300 tracking-wider">Active Produce Listings</CardTitle>
              <List className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white">{listings.length}</div>
              <p className="text-xs font-semibold text-emerald-400 mt-1">Live in Buyer Marketplace</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/90 border-2 border-amber-500/50 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase text-amber-400 tracking-wider">Pending Negotiations</CardTitle>
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-amber-400">
                {listings.filter((l) => l.status === "Pending").length}
              </div>
              <p className="text-xs font-semibold text-amber-300 mt-1">Awaiting corporate buyer review</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/90 border-2 border-emerald-500/50 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase text-emerald-400 tracking-wider">Active Contracts</CardTitle>
              <Users className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-emerald-400">
                {listings.filter((l) => l.status === "Accepted").length}
              </div>
              <p className="text-xs font-semibold text-emerald-300 mt-1">Signed Digital Contracts</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white mb-4">Your Produce Listings</h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <p className="text-red-400 font-medium">{error}</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {listings.length > 0 ? (
                listings.map((listing: Listing) => {
                  return (
                    <Card key={listing.id} className="bg-slate-900/90 border-2 border-slate-700/80 shadow-2xl hover:border-emerald-500/50 transition-all flex flex-col justify-between">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex justify-between items-center text-white font-extrabold text-xl">
                          {listing.croptype}
                          <Badge variant={getStatusVariant(listing.status)} className="font-bold">
                            {listing.status}
                          </Badge>
                        </CardTitle>
                        <p className="text-xs text-slate-300 font-medium">{listing.title}</p>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-slate-200">
                          <strong className="text-slate-400 font-semibold">Quantity:</strong> <span className="font-bold text-white">{listing.quantity}</span>
                        </p>
                        <p className="text-sm text-slate-200">
                          <strong className="text-slate-400 font-semibold">Price per Unit:</strong> <span className="font-extrabold text-emerald-400">₹{listing.price}</span>
                        </p>
                        {listing.location && (
                          <p className="text-xs text-slate-300 font-medium">
                            📍 {listing.location}
                          </p>
                        )}
                        <div className="flex justify-between items-center pt-3 border-t border-slate-800 mt-2">
                          <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold w-full">
                            <Link href="/fdashboard/listing">Manage Listing</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card className="bg-slate-900/90 border-2 border-slate-700/80 col-span-full p-8 text-center">
                  <p className="text-slate-300 font-medium mb-3">No active produce listings yet.</p>
                  <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black">
                    <Link href="/fdashboard/listing/add">Create Your First Listing</Link>
                  </Button>
                </Card>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <Button variant="outline" asChild className="bg-slate-900 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 font-bold px-6">
              <Link href="/fdashboard/listing">View All Listings Queue</Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'Active':
      return 'success'
    case 'Pending':
      return 'warning'
    default:
      return 'secondary'
  }
}
