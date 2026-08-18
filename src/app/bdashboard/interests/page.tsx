'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MessageSquare, ArrowRight, Loader2 } from 'lucide-react'

export default function BuyerInterestsPage() {
  const [chats, setChats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActiveInterests()
  }, [])

  const fetchActiveInterests = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/chat')
      const data = await res.json()
      if (data.success && Array.isArray(data.chats)) {
        setChats(data.chats)
      } else {
        setChats([])
      }
    } catch (err) {
      console.error('Error fetching active interests:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/resources/background4.jpeg')] bg-cover bg-center opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/60 pointer-events-none" />
      <Header />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-24 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-emerald-400" /> Active Negotiations & Expressed Interests
            </h1>
            <p className="text-slate-400 mt-1">Manage active price offer proposals and contract negotiations with farmers.</p>
          </div>
          <Link href="/bdashboard/marketplace">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
              Browse Marketplace <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mr-2" /> Loading active deal negotiations...
          </div>
        ) : chats.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800 text-center py-16">
            <CardContent className="flex flex-col items-center gap-3">
              <MessageSquare className="h-10 w-10 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-300">No Active Deal Negotiations Yet</h3>
              <p className="text-slate-500 text-sm max-w-md">Express interest on produce listings to start negotiating price terms directly with farmers.</p>
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
                  <TableHead className="text-slate-300 font-bold">Crop Produce</TableHead>
                  <TableHead className="text-slate-300 font-bold">Farmer Agreement</TableHead>
                  <TableHead className="text-slate-300 font-bold">Buyer Agreement</TableHead>
                  <TableHead className="text-slate-300 font-bold">Negotiation Status</TableHead>
                  <TableHead className="text-slate-300 font-bold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chats.map((c) => (
                  <TableRow key={c._id} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                    <TableCell className="font-semibold text-white">{c.farmerName || c.farmerEmail}</TableCell>
                    <TableCell className="font-bold text-emerald-400">{c.cropName}</TableCell>
                    <TableCell className="text-slate-300">{c.farmerAgreed ? 'Signed ✓' : 'Pending'}</TableCell>
                    <TableCell className="text-slate-300">{c.buyerAgreed ? 'Signed ✓' : 'Pending'}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {c.status || 'Active'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/chat/${c._id}`}>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                          Open Negotiation Room
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
  )
}

