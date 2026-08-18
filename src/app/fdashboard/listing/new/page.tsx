'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function NewListingPage() {
  const router = useRouter()
  const [listing, setListing] = useState({
    croptype: '',
    quantity: '',
    harvestingtime: '',
    price: '',
    fcity: '',
    fpincode: '',
    fstate: '',
    email: '',  // Added email field
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListing({ ...listing, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setListing({ ...listing, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: listing.croptype,
          quantity: Number(listing.quantity),
          unit: 'Quintal',
          expectedPricePerUnit: Number(listing.price),
          harvestDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          location: {
            city: listing.fcity,
            state: listing.fstate,
            pincode: listing.fpincode,
          },
        }),
      })

      if (response.ok) {
        router.push('/fdashboard/listing')
      } else {
        console.error('Failed to submit listing')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <DashboardLayout>
      {/* Background set to white-screen_32.jpeg */}
      <div 
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/resources/white-screen_32.jpeg")',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1
        }}
      />
      <Card className="bg-white p-6">
        <CardHeader>
          <CardTitle className="text-black">Add New Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="croptype" className="text-black">Crop Type</label>
              <Input
                id="croptype"
                name="croptype"
                value={listing.croptype}
                onChange={handleChange}
                required
                className="bg-white text-black"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="text-black">Quantity (in kgs)</label>
              <Input
                id="quantity"
                name="quantity"
                value={listing.quantity}
                onChange={handleChange}
                required
                className="bg-white text-black"
              />
            </div>
            <div>
              <label htmlFor="harvestingtime" className="text-black">Delivery Time</label>
              <Select onValueChange={(value: string) => handleSelectChange('harvestingtime', value)}>
                <SelectTrigger className="bg-white text-black">
                  <SelectValue placeholder="Select Delivery Month" />
                </SelectTrigger>
                <SelectContent className="bg-gray-200">
                  <SelectItem value="January" className="text-black">January</SelectItem>
                  <SelectItem value="February" className="text-black">February</SelectItem>
                  <SelectItem value="March" className="text-black">March</SelectItem>
                  <SelectItem value="April" className="text-black">April</SelectItem>
                  <SelectItem value="May" className="text-black">May</SelectItem>
                  <SelectItem value="June" className="text-black">June</SelectItem>
                  <SelectItem value="July" className="text-black">July</SelectItem>
                  <SelectItem value="August" className="text-black">August</SelectItem>
                  <SelectItem value="September" className="text-black">September</SelectItem>
                  <SelectItem value="October" className="text-black">October</SelectItem>
                  <SelectItem value="November" className="text-black">November</SelectItem>
                  <SelectItem value="December" className="text-black">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="price" className="text-black">Price (in ₹)</label>
              <Input
                id="price"
                name="price"
                type="number"
                value={listing.price}
                onChange={handleChange}
                required
                className="bg-white text-black"
              />
            </div>
            <div>
              <label htmlFor="fcity" className="text-black">City</label>
              <Input
                id="fcity"
                name="fcity"
                value={listing.fcity}
                onChange={handleChange}
                required
                className="bg-white text-black"
              />
            </div>
            <div>
              <label htmlFor="fpincode" className="text-black">Pincode</label>
              <Input
                id="fpincode"
                name="fpincode"
                value={listing.fpincode}
                onChange={handleChange}
                required
                className="bg-white text-black"
              />
            </div>
            <div>
              <label htmlFor="fstate" className="text-black">State</label>
              <Input
                id="fstate"
                name="fstate"
                value={listing.fstate}
                onChange={handleChange}
                required
                className="bg-white text-black"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-black">Email</label> {/* New email input field */}
              <Input
                id="email"
                name="email"
                type="email"
                value={listing.email}
                onChange={handleChange}
                required
                className="bg-white text-black"
              />
            </div>
            <Button type="submit" className="bg-black text-white">Create Listing</Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
