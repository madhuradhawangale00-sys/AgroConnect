'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageBackground } from '@/components/PageBackground';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Contract {
  _id: string;
  cropName: string;
  agreedPricePerUnit: number;
  quantity: number;
  unit?: string;
  totalAmount: number;
  status: string;
  buyerEmail: string;
  buyerName?: string;
  createdAt: string;
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/contracts');
        const data = await response.json();

        if (data.success && Array.isArray(data.contracts)) {
          setContracts(data.contracts);
        } else if (data.error) {
          setError(data.error);
        } else {
          setContracts([]);
        }
      } catch (err) {
        setError('Failed to fetch contracts.');
        console.error('Error fetching contracts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  return (
    <DashboardLayout>
      <PageBackground imageSrc="/resources/background2.jpeg" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Farmer Digital Contracts</h1>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white">
          <Link href="/contracts">Full Contracts Portal</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-white text-lg">Loading contracts...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-12">
          <p>{error}</p>
        </div>
      ) : contracts.length === 0 ? (
        <div className="text-center text-white bg-slate-900/80 p-8 rounded-xl border border-slate-800">
          <p className="text-lg font-semibold">No active contracts found.</p>
          <p className="text-slate-400 text-sm mt-1">Accept deal proposals in negotiation chat to generate digital contracts.</p>
        </div>
      ) : (
        <div className="bg-white/95 rounded-xl shadow-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="font-bold text-slate-900">Buyer</TableHead>
                <TableHead className="font-bold text-slate-900">Crop</TableHead>
                <TableHead className="font-bold text-slate-900">Quantity</TableHead>
                <TableHead className="font-bold text-slate-900">Rate</TableHead>
                <TableHead className="font-bold text-slate-900">Total Deal</TableHead>
                <TableHead className="font-bold text-slate-900">Status</TableHead>
                <TableHead className="font-bold text-slate-900 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract._id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{contract.buyerName || contract.buyerEmail}</TableCell>
                  <TableCell className="font-bold text-emerald-700">{contract.cropName}</TableCell>
                  <TableCell className="text-slate-800">{contract.quantity} {contract.unit || "Quintal"}</TableCell>
                  <TableCell className="text-slate-800">₹{contract.agreedPricePerUnit}</TableCell>
                  <TableCell className="font-bold text-slate-900">₹{contract.totalAmount?.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      {contract.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild className="border-slate-300 text-slate-800 hover:bg-slate-100">
                      <Link href={`/contracts/${contract._id}`}>View Digital PDF</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </DashboardLayout>
  );
}

