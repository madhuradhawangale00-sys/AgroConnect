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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, CheckCircle2, Clock, ShieldCheck, ArrowLeft, Loader2, Truck, CreditCard, AlertTriangle, Sprout } from "lucide-react";
import Link from "next/link";

const MILESTONES = [
  { id: "Confirmed", label: "Confirmed & Signed", icon: CheckCircle2 },
  { id: "In Progress", label: "Harvesting & Logistics", icon: Truck },
  { id: "Delivered", label: "Produce Delivered", icon: CheckCircle2 },
  { id: "Payment Completed", label: "Payment Settled", icon: CreditCard },
  { id: "Closed", label: "Contract Completed", icon: ShieldCheck },
];

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const contractId = params?.id as string;

  const [contract, setContract] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (contractId) {
      fetchContractDetails();
    }
  }, [contractId]);

  const fetchContractDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contracts?id=${contractId}`);
      const data = await res.json();
      if (data.success) {
        setContract(data.contract);
        setNewStatus(data.contract.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || updating) return;

    try {
      setUpdating(true);
      const res = await fetch("/api/contracts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setContract(data.contract);
        setShowStatusModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="flex items-center gap-3 text-lg font-medium text-slate-300">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            Loading Digital Contract Document...
          </div>
        </main>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Header />
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-24 text-center">
          <Card className="bg-slate-900 border-slate-800 p-8">
            <CardContent>
              <h2 className="text-xl font-bold text-white mb-2">Contract Document Not Found</h2>
              <p className="text-slate-400 mb-6">The requested digital contract does not exist or you do not have permission.</p>
              <Link href="/contracts">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Back to Contracts</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentMilestoneIdx = MILESTONES.findIndex((m) => m.id === contract.status);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            href="/contracts"
            className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Contracts
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowStatusModal(true)}
              className="border-slate-700 text-slate-200 hover:text-white"
            >
              Update Milestone Status
            </Button>

            <Button onClick={handleDownloadPDF} className="bg-emerald-600 hover:bg-emerald-500 text-white">
              <Download className="h-4 w-4 mr-2" /> Download / Print PDF
            </Button>
          </div>
        </div>

        {/* Milestone Tracker Card */}
        <Card className="bg-slate-900 border-slate-800 mb-8 print:hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-white">Contract Order Milestone Tracker</CardTitle>
              <Badge className="bg-emerald-600 text-white">{contract.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-5 gap-2 text-center relative">
              {MILESTONES.map((m, idx) => {
                const IconComponent = m.icon;
                const isPassed = currentMilestoneIdx >= idx;
                const isCurrent = currentMilestoneIdx === idx;

                return (
                  <div key={m.id} className="flex flex-col items-center gap-2">
                    <div
                      className={`p-3 rounded-full border-2 transition-all ${
                        isPassed
                          ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-950"
                          : "bg-slate-800 border-slate-700 text-slate-500"
                      } ${isCurrent ? "ring-4 ring-emerald-500/30 scale-110" : ""}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className={`text-[11px] font-medium ${isPassed ? "text-emerald-300" : "text-slate-500"}`}>
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Official Digital Contract Document (Printable) */}
        <Card className="bg-slate-900 border-slate-800 shadow-2xl text-slate-100 p-8 print:bg-white print:text-black print:border-none print:shadow-none">
          <div className="border-b-2 border-emerald-500 pb-6 mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sprout className="h-7 w-7 text-emerald-400 print:text-emerald-700" />
                <span className="text-2xl font-black tracking-tight text-white print:text-black">AgroConnect</span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600 font-mono">
                Official Digital Contract Farming Agreement (SIH 2024 Workflow)
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400 print:text-gray-600 uppercase font-semibold">Contract ID</p>
              <p className="text-sm font-mono font-bold text-emerald-400 print:text-emerald-800">
                #{contract._id.toString().toUpperCase()}
              </p>
              <p className="text-xs text-slate-500 print:text-gray-500 mt-1">
                Date Generated: {new Date(contract.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 bg-slate-950/60 p-4 rounded-xl border border-slate-800 print:bg-gray-100 print:border-gray-300">
            <div>
              <p className="text-xs font-bold text-emerald-400 print:text-emerald-700 uppercase tracking-wider mb-2">
                FARMER (PRODUCER)
              </p>
              <p className="text-base font-bold text-white print:text-black">{contract.farmerName || "Farmer"}</p>
              <p className="text-xs text-slate-400 print:text-gray-600">{contract.farmerEmail}</p>
              <div className="mt-2">
                <Badge variant="outline" className="border-emerald-600 text-emerald-400 text-[10px]">
                  Signatory Confirmed ✓
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-amber-400 print:text-amber-700 uppercase tracking-wider mb-2">
                BUYER (PROCUREMENT AGENT)
              </p>
              <p className="text-base font-bold text-white print:text-black">{contract.buyerName || "Buyer"}</p>
              <p className="text-xs text-slate-400 print:text-gray-600">{contract.buyerEmail}</p>
              <div className="mt-2">
                <Badge variant="outline" className="border-amber-600 text-amber-400 text-[10px]">
                  Signatory Confirmed ✓
                </Badge>
              </div>
            </div>
          </div>

          {/* Agreed Terms Table */}
          <div className="space-y-4 mb-8">
            <h3 className="text-sm font-bold uppercase text-slate-300 print:text-black tracking-wider border-b border-slate-800 print:border-gray-300 pb-2">
              Agreed Produce & Financial Specifications
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <p className="text-xs text-slate-400 print:text-gray-500 font-semibold">Crop Produce</p>
                <p className="text-base font-bold text-white print:text-black mt-1">{contract.cropName}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <p className="text-xs text-slate-400 print:text-gray-500 font-semibold">Contracted Quantity</p>
                <p className="text-base font-bold text-white print:text-black mt-1">{contract.quantity} {contract.unit || "Quintal"}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <p className="text-xs text-slate-400 print:text-gray-500 font-semibold">Agreed Unit Price</p>
                <p className="text-base font-bold text-emerald-400 print:text-emerald-800 mt-1">₹{contract.agreedPricePerUnit} / {contract.unit || "Quintal"}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <p className="text-xs text-slate-400 print:text-gray-500 font-semibold">Total Contract Value</p>
                <p className="text-base font-extrabold text-emerald-400 print:text-emerald-800 mt-1">₹{contract.totalAmount?.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm pt-2">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <p className="text-xs text-slate-400 print:text-gray-500 font-semibold">Scheduled Delivery Date</p>
                <p className="text-sm font-semibold text-white print:text-black mt-1">
                  {new Date(contract.deliveryDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <p className="text-xs text-slate-400 print:text-gray-500 font-semibold">Payment & Milestone Terms</p>
                <p className="text-xs text-slate-300 print:text-gray-800 mt-1">{contract.paymentTerms}</p>
              </div>
            </div>
          </div>

          {/* Digital Signatures Box */}
          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-800 print:border-gray-300">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 print:bg-gray-50 print:border-gray-200">
              <p className="text-xs font-bold text-slate-400 print:text-gray-500 uppercase">DIGITAL SIGNATURE — FARMER</p>
              <p className="text-base font-serif italic text-emerald-300 print:text-emerald-800 my-2">
                {contract.farmerSignature?.signed ? `Signed by ${contract.farmerName}` : "Pending Signature"}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Timestamp: {contract.farmerSignature?.signedAt ? new Date(contract.farmerSignature.signedAt).toUTCString() : "N/A"}
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 print:bg-gray-50 print:border-gray-200">
              <p className="text-xs font-bold text-slate-400 print:text-gray-500 uppercase">DIGITAL SIGNATURE — BUYER</p>
              <p className="text-base font-serif italic text-amber-300 print:text-amber-800 my-2">
                {contract.buyerSignature?.signed ? `Signed by ${contract.buyerName}` : "Pending Signature"}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Timestamp: {contract.buyerSignature?.signedAt ? new Date(contract.buyerSignature.signedAt).toUTCString() : "N/A"}
              </p>
            </div>
          </div>
        </Card>

        {/* Milestone Update Modal */}
        <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Update Contract Milestone Status</DialogTitle>
              <DialogDescription className="text-slate-400">
                Update status as harvest progress, delivery, or payment milestones complete.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Select New Status</label>
                <Select value={newStatus} onValueChange={(val) => setNewStatus(val)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="In Progress">In Progress (Harvesting/Packing)</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Payment Completed">Payment Completed</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Disputed">Disputed (Admin Intervention)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setShowStatusModal(false)}>Cancel</Button>
              <Button onClick={handleUpdateStatus} disabled={updating} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Milestone"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}
