"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KYCBadge from "@/components/KYCBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, CheckCircle2, XCircle, Clock, Eye, AlertCircle, Loader2, Users } from "lucide-react";

export default function AdminKYCQueuePage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const sessionStatus = sessionData?.status || "unauthenticated";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("Pending");

  // Review Modal state
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [reviewAction, setReviewAction] = useState<"Verified" | "Rejected" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (sessionStatus === "authenticated") {
      if ((session?.user as any)?.role !== "Admin") {
        router.push("/");
        return;
      }
      fetchAdminKYCDocuments();
    }
  }, [sessionStatus]);

  const fetchAdminKYCDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/kyc?mode=admin");
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to load admin KYC documents", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedDoc || !reviewAction) return;

    try {
      setProcessing(true);
      const res = await fetch("/api/kyc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: selectedDoc._id,
          status: reviewAction,
          rejectionReason: reviewAction === "Rejected" ? rejectionReason : "",
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local list
        setDocuments((prev) =>
          prev.map((d) =>
            d._id === selectedDoc._id
              ? { ...d, status: reviewAction, rejectionReason: reviewAction === "Rejected" ? rejectionReason : "" }
              : d
          )
        );
        setSelectedDoc(null);
        setReviewAction(null);
        setRejectionReason("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    if (filterStatus === "All") return true;
    return doc.status === filterStatus;
  });

  const pendingCount = documents.filter((d) => d.status === "Pending").length;
  const verifiedCount = documents.filter((d) => d.status === "Verified").length;
  const rejectedCount = documents.filter((d) => d.status === "Rejected").length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="flex items-center gap-3 text-lg font-medium text-slate-300">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            Loading KYC Admin Queue...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Minimal farming background overlay */}
      <div className="fixed inset-0 -z-10 bg-[url('/resources/background3.jpeg')] bg-cover bg-center opacity-15" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
      <Header />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
              Admin KYC Approval Queue
            </h1>
            <p className="text-slate-400 mt-1">
              Review submitted farmer & buyer identity documents, grant verified badges, or issue rejection feedback.
            </p>
          </div>

          <Badge className="bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" /> Admin Portal Access
          </Badge>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-400 uppercase font-semibold">Total Submissions</p>
              <p className="text-3xl font-bold text-white mt-1">{documents.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-xs text-amber-400 uppercase font-semibold">Pending Review</p>
              <p className="text-3xl font-bold text-amber-300 mt-1">{pendingCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-xs text-emerald-400 uppercase font-semibold">Verified Users</p>
              <p className="text-3xl font-bold text-emerald-300 mt-1">{verifiedCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-xs text-red-400 uppercase font-semibold">Rejected</p>
              <p className="text-3xl font-bold text-red-300 mt-1">{rejectedCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
          {["Pending", "Verified", "Rejected", "All"].map((st) => (
            <Button
              key={st}
              variant={filterStatus === st ? "default" : "ghost"}
              onClick={() => setFilterStatus(st)}
              className={
                filterStatus === st
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }
            >
              {st} {st === "Pending" ? `(${pendingCount})` : st === "Verified" ? `(${verifiedCount})` : st === "Rejected" ? `(${rejectedCount})` : `(${documents.length})`}
            </Button>
          ))}
        </div>

        {/* Documents Queue List */}
        {filteredDocs.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800 py-16 text-center">
            <CardContent className="flex flex-col items-center gap-3">
              <AlertCircle className="h-12 w-12 text-slate-600" />
              <p className="text-lg font-medium text-slate-300">No {filterStatus} KYC submissions found.</p>
              <p className="text-sm text-slate-500">All submitted documents in this category have been processed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredDocs.map((doc) => (
              <Card key={doc._id} className="bg-slate-900 border-slate-800 flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-white font-bold">{doc.userName || "User"}</CardTitle>
                      <p className="text-xs text-slate-400">{doc.userEmail}</p>
                    </div>
                    <KYCBadge status={doc.status} />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      Role: {doc.userRole || "Farmer"}
                    </Badge>
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      ID: {doc.idProofType} ({doc.idProofNumber || "N/A"})
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Proof Thumbnails */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                      <p className="text-xs font-medium text-slate-400 mb-1">ID Proof ({doc.idProofType})</p>
                      <img
                        src={doc.idProofUrl}
                        alt="ID Proof"
                        className="h-28 w-full object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setPreviewImage(doc.idProofUrl)}
                      />
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                      <p className="text-xs font-medium text-slate-400 mb-1">Address Proof</p>
                      <img
                        src={doc.addressProofUrl}
                        alt="Address Proof"
                        className="h-28 w-full object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setPreviewImage(doc.addressProofUrl)}
                      />
                    </div>
                  </div>

                  {doc.rejectionReason && (
                    <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-300">
                      <span className="font-semibold">Rejection Note:</span> {doc.rejectionReason}
                    </div>
                  )}
                </CardContent>

                <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-950/50 rounded-b-xl">
                  <span className="text-xs text-slate-500">
                    Submitted: {new Date(doc.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:text-white"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setReviewAction("Rejected");
                        setRejectionReason(doc.rejectionReason || "");
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1 text-red-400" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setReviewAction("Verified");
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Approve Badge
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Full Image Preview Modal */}
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-white">Document Preview</DialogTitle>
            </DialogHeader>
            {previewImage && (
              <img src={previewImage} alt="Document Full View" className="max-h-[70vh] w-full object-contain rounded-lg" />
            )}
          </DialogContent>
        </Dialog>

        {/* Review Action Confirmation Modal */}
        <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">
                {reviewAction === "Verified" ? "Approve KYC Verification" : "Reject KYC Application"}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Applicant: <span className="text-white font-medium">{selectedDoc?.userName}</span> ({selectedDoc?.userEmail})
              </DialogDescription>
            </DialogHeader>

            {reviewAction === "Verified" ? (
              <p className="text-sm text-slate-300">
                Approving this KYC application will grant a green <span className="text-emerald-400 font-semibold">"KYC Verified"</span> badge on this user's profile and produce listings.
              </p>
            ) : (
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Rejection Reason Feedback</label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why the identity document was rejected (e.g. Blurry photo, name mismatch)..."
                  className="bg-slate-800 border-slate-700 text-white text-sm min-h-[100px]"
                />
              </div>
            )}

            <DialogFooter className="mt-4 gap-2">
              <Button variant="ghost" onClick={() => setSelectedDoc(null)} disabled={processing}>
                Cancel
              </Button>
              <Button
                onClick={handleReviewSubmit}
                disabled={processing || (reviewAction === "Rejected" && !rejectionReason.trim())}
                className={reviewAction === "Verified" ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"}
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                  </span>
                ) : reviewAction === "Verified" ? (
                  "Confirm Approval"
                ) : (
                  "Send Rejection"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}
