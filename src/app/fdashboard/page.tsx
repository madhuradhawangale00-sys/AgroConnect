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
      <div className="space-y-6 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-white">Welcome, Farmer!</h1>
          <Button asChild className="shadow-[0_4px_8px_rgba(255,255,255)]">
            <Link href="/fdashboard/listing/add" className="text-white">Create New Listing</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/80 backdrop-blur-sm shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.3)] transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Active Contracts</CardTitle>
              <Users className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">12</div>
              <p className="text-xs text-black">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.3)] transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Active Listings</CardTitle>
              <List className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">8</div>
              <p className="text-xs text-black">+3 since last week</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.3)] transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Pending Negotiations</CardTitle>
              <AlertTriangle className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">3</div>
              <p className="text-xs text-black">Requires your attention</p>
            </CardContent>
          </Card>

          
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-white">Recent Listings</h2>

          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {listings.length > 0 ? (
                listings.map((listing: Listing) => {
                  return (
                    <Card key={listing.id} className="bg-white/80 backdrop-blur-sm shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.3)] transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center text-black">
                          {listing.croptype}
                          <Badge variant={getStatusVariant(listing.status)} className="shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                            {listing.status}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2 text-black"><strong>Quantity:</strong> {listing.quantity}</p>
                        <p className="mb-2 text-black"><strong>Price:</strong> {listing.price}</p>
                        <div className="flex justify-between items-center mt-4">
                          {/* <Button variant="outline" size="sm" asChild className="shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                            <Link href={`/dashboard/listings/${listing.id}`}>View Details</Link>
                          </Button> */}
                          {listing.status === 'Pending' && (
                            <Button size="sm" className="shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                              Review Offers
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="text-black">No listings available</p>
              )}
            </div>
          )}

          <div className="mt-4 text-center">
            <Button variant="outline" asChild className="shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.3)]">
              <Link href="/fdashboard/listing">View All Listings</Link>
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
