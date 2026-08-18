"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KYCBadge from "@/components/KYCBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Loader2, Users } from "lucide-react";

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
  }, [sessionStatus, session?.user, router]);

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
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 pointer-events-none" />
      <Header />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-24 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
              Admin KYC Approval Queue
            </h1>
            <p className="text-slate-300 font-medium mt-1">
              Review submitted farmer & buyer identity documents, grant verified badges, or issue rejection feedback.
            </p>
          </div>

          <Badge className="bg-emerald-950/80 text-emerald-300 border-2 border-emerald-500/50 px-3.5 py-1.5 text-sm font-bold flex items-center gap-2 shadow-lg">
            <Users className="h-4 w-4 text-emerald-400" /> Admin Portal Access
          </Badge>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/90 border-2 border-slate-700/80 shadow-xl">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-300 uppercase font-black tracking-wider">Total Submissions</p>
              <p className="text-4xl font-black text-white mt-1">{documents.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/90 border-2 border-amber-500/50 shadow-xl">
            <CardContent className="pt-6">
              <p className="text-xs text-amber-400 uppercase font-black tracking-wider">Pending Review</p>
              <p className="text-4xl font-black text-amber-400 mt-1">{pendingCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/90 border-2 border-emerald-500/50 shadow-xl">
            <CardContent className="pt-6">
              <p className="text-xs text-emerald-400 uppercase font-black tracking-wider">Verified Users</p>
              <p className="text-4xl font-black text-emerald-400 mt-1">{verifiedCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/90 border-2 border-rose-500/50 shadow-xl">
            <CardContent className="pt-6">
              <p className="text-xs text-rose-400 uppercase font-black tracking-wider">Rejected</p>
              <p className="text-4xl font-black text-rose-400 mt-1">{rejectedCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-700/80 pb-4 mb-8 overflow-x-auto">
          {["Pending", "Verified", "Rejected", "All"].map((st) => (
            <Button
              key={st}
              variant={filterStatus === st ? "default" : "outline"}
              onClick={() => setFilterStatus(st)}
              className={
                filterStatus === st
                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 shadow-lg shadow-emerald-950/50"
                  : "bg-slate-900/90 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 font-bold px-5"
              }
            >
              {st} {st === "Pending" ? `(${pendingCount})` : st === "Verified" ? `(${verifiedCount})` : st === "Rejected" ? `(${rejectedCount})` : `(${documents.length})`}
            </Button>
          ))}
        </div>

        {/* Documents Queue List */}
        {filteredDocs.length === 0 ? (
          <Card className="bg-slate-900/90 border-2 border-slate-700/80 py-16 text-center shadow-2xl">
            <CardContent className="flex flex-col items-center gap-3">
              <AlertCircle className="h-14 w-14 text-emerald-400" />
              <p className="text-xl font-extrabold text-white">No {filterStatus} KYC submissions found.</p>
              <p className="text-sm font-semibold text-slate-300">All submitted documents in this category have been processed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredDocs.map((doc) => (
              <Card key={doc._id} className="bg-slate-900/90 border-2 border-slate-700/80 shadow-2xl flex flex-col justify-between hover:border-emerald-500/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-white font-extrabold">{doc.userName || "User"}</CardTitle>
                      <p className="text-xs text-slate-300 font-medium">{doc.userEmail}</p>
                    </div>
                    <KYCBadge status={doc.status} />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="border-slate-600 bg-slate-800/80 text-slate-100 font-bold">
                      Role: {doc.userRole || "Farmer"}
                    </Badge>
                    <Badge variant="outline" className="border-slate-600 bg-slate-800/80 text-slate-100 font-bold">
                      ID: {doc.idProofType} ({doc.idProofNumber || "N/A"})
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Proof Thumbnails */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-700 text-center">
                      <p className="text-xs font-bold text-slate-300 mb-1.5">ID Proof ({doc.idProofType})</p>
                      <img
                        src={doc.idProofUrl}
                        alt="ID Proof"
                        className="h-32 w-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-slate-800"
                        onClick={() => setPreviewImage(doc.idProofUrl)}
                      />
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-700 text-center">
                      <p className="text-xs font-bold text-slate-300 mb-1.5">Address Proof</p>
                      <img
                        src={doc.addressProofUrl}
                        alt="Address Proof"
                        className="h-32 w-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-slate-800"
                        onClick={() => setPreviewImage(doc.addressProofUrl)}
                      />
                    </div>
                  </div>

                  {doc.rejectionReason && (
                    <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-lg text-xs text-red-200 font-medium">
                      <span className="font-bold text-rose-300">Rejection Note:</span> {doc.rejectionReason}
                    </div>
                  )}
                </CardContent>

                <div className="p-4 border-t border-slate-700/80 flex items-center justify-between gap-3 bg-slate-950/80 rounded-b-xl">
                  <span className="text-xs text-slate-300 font-mono font-medium">
                    Submitted: {new Date(doc.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-rose-950/80 border-2 border-rose-500/80 text-rose-300 hover:bg-rose-900 hover:text-white font-extrabold"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setReviewAction("Rejected");
                        setRejectionReason(doc.rejectionReason || "");
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1 text-rose-400" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setReviewAction("Verified");
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1 text-slate-950" /> Approve Badge
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Full Image Preview Modal */}
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="bg-slate-900 border-2 border-slate-700 max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-white font-extrabold text-xl">Document Preview</DialogTitle>
            </DialogHeader>
            {previewImage && (
              <img src={previewImage} alt="Document Full View" className="max-h-[70vh] w-full object-contain rounded-lg border border-slate-700" />
            )}
          </DialogContent>
        </Dialog>

        {/* Review Action Confirmation Modal */}
        <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
          <DialogContent className="bg-slate-900 border-2 border-slate-700 text-slate-100 max-w-md shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-white font-extrabold text-xl">
                {reviewAction === "Verified" ? "Approve KYC Verification" : "Reject KYC Application"}
              </DialogTitle>
              <DialogDescription className="text-slate-300 font-medium">
                Applicant: <span className="text-white font-bold">{selectedDoc?.userName}</span> ({selectedDoc?.userEmail})
              </DialogDescription>
            </DialogHeader>

            {reviewAction === "Verified" ? (
              <p className="text-sm text-slate-200 font-medium">
                Approving this KYC application will grant a green <span className="text-emerald-400 font-bold">"KYC Verified"</span> badge on this user's profile and produce listings.
              </p>
            ) : (
              <div className="space-y-2">
                <label className="text-sm text-slate-200 font-bold">Rejection Reason Feedback</label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why the identity document was rejected (e.g. Blurry photo, name mismatch)..."
                  className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-400 text-sm min-h-[100px]"
                />
              </div>
            )}

            <DialogFooter className="mt-4 gap-2">
              <Button variant="ghost" onClick={() => setSelectedDoc(null)} disabled={processing} className="text-slate-300 hover:text-white">
                Cancel
              </Button>
              <Button
                onClick={handleReviewSubmit}
                disabled={processing || (reviewAction === "Rejected" && !rejectionReason.trim())}
                className={reviewAction === "Verified" ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black" : "bg-rose-600 hover:bg-rose-500 text-white font-bold"}
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
