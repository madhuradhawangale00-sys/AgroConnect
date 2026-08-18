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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Upload, FileCheck, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function KYCPage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const sessionStatus = sessionData?.status || "unauthenticated";
  const update = sessionData?.update || (async () => {});
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState<string>("Not Submitted");
  const [kycDoc, setKycDoc] = useState<any>(null);

  const [idProofType, setIdProofType] = useState<string>("Aadhar");
  const [idProofNumber, setIdProofNumber] = useState<string>("");
  const [idProofFile, setIdProofFile] = useState<string>("");
  const [addressProofFile, setAddressProofFile] = useState<string>("");

  const [idFileName, setIdFileName] = useState<string>("");
  const [addressFileName, setAddressFileName] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (sessionStatus === "authenticated") {
      fetchKYCStatus();
    }
  }, [sessionStatus]);

  const fetchKYCStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/kyc");
      const data = await res.json();
      if (data.success) {
        setKycStatus(data.userKycStatus);
        setKycDoc(data.document);
        if (data.document) {
          setIdProofType(data.document.idProofType || "Aadhar");
          setIdProofNumber(data.document.idProofNumber || "");
          setIdProofFile(data.document.idProofUrl || "");
          setAddressProofFile(data.document.addressProofUrl || "");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFileState: (val: string) => void,
    setNameState: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNameState(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileState(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!idProofFile || !addressProofFile) {
      setError("Please select both ID proof and Address proof documents.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProofType,
          idProofNumber,
          idProofUrl: idProofFile,
          addressProofUrl: addressProofFile,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to submit KYC documents.");
      } else {
        setSuccessMsg("KYC documents submitted successfully! Your account is under verification.");
        setKycStatus("Pending");
        setKycDoc(data.document);
        // Refresh session token so kycStatus reflects immediately across the app
        await update({ kycStatus: "Pending" });
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="flex items-center gap-3 text-lg font-medium text-slate-300">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            Loading KYC Verification details...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={(session?.user as any)?.role === "Buyer" ? "/bdashboard" : (session?.user as any)?.role === "Admin" ? "/admin/kyc" : "/fdashboard"}
              className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
              KYC Identity Verification
            </h1>
            <p className="text-slate-400 mt-1">
              Verify your identity to gain verified badge and unlock full contract farming capabilities on AgroConnect.
            </p>
          </div>

          <KYCBadge status={kycStatus} size="lg" />
        </div>

        {/* Status Callout Card */}
        {kycStatus === "Verified" && (
          <Card className="bg-emerald-950/40 border-emerald-500/40 mb-8">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-full">
                <FileCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-300">Your Identity is Verified!</h3>
                <p className="text-sm text-emerald-200/80 mt-1">
                  Your identity documents have been approved by the platform administration. Your listings and profile now display a green "KYC Verified" badge, giving buyers and sellers maximum trust.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {kycStatus === "Pending" && (
          <Card className="bg-amber-950/40 border-amber-500/40 mb-8">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-300">Verification Under Review</h3>
                <p className="text-sm text-amber-200/80 mt-1">
                  Your uploaded ID and address proof documents have been submitted to the Admin Approval Queue. Verification usually takes a few hours. You can update your submission below if needed.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {kycStatus === "Rejected" && (
          <Card className="bg-red-950/40 border-red-500/40 mb-8">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 bg-red-500/20 text-red-400 rounded-full">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-300">KYC Verification Rejected</h3>
                <p className="text-sm text-red-200/80 mt-1">
                  <span className="font-semibold text-white">Reason:</span>{" "}
                  {kycDoc?.rejectionReason || "Uploaded documents were blurry or incomplete."}
                </p>
                <p className="text-sm text-red-300/80 mt-2">
                  Please review the feedback above and re-upload clear photos of your valid identity and address documents.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Form Card */}
        <Card className="bg-slate-900 border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              {kycStatus === "Verified" ? "Uploaded Identity Documents" : "Upload Verification Documents"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Provide government-issued identity proof (Aadhar / PAN / Voter ID) and valid address proof.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-4 mb-6 text-sm text-red-300 bg-red-950/50 border border-red-800 rounded-lg">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-4 mb-6 text-sm text-emerald-300 bg-emerald-950/50 border border-emerald-800 rounded-lg">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="idType" className="text-slate-300">Identity Proof Type</Label>
                  <Select
                    value={idProofType}
                    onValueChange={(val) => setIdProofType(val)}
                    disabled={kycStatus === "Verified"}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="Aadhar">Aadhar Card</SelectItem>
                      <SelectItem value="PAN">PAN Card</SelectItem>
                      <SelectItem value="VoterID">Voter ID</SelectItem>
                      <SelectItem value="DrivingLicense">Driving License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idNumber" className="text-slate-300">Identity Document Number</Label>
                  <Input
                    id="idNumber"
                    value={idProofNumber}
                    onChange={(e) => setIdProofNumber(e.target.value)}
                    placeholder="Enter document number (e.g. 12-digit Aadhar)"
                    disabled={kycStatus === "Verified"}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Document File Selectors */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* ID Proof */}
                <div className="space-y-3">
                  <Label className="text-slate-300">1. ID Proof Photo / Document</Label>
                  <div className="border-2 border-dashed border-slate-700 bg-slate-800/50 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-colors">
                    {idProofFile ? (
                      <div className="space-y-3">
                        <img
                          src={idProofFile}
                          alt="ID Proof Preview"
                          className="max-h-40 mx-auto rounded-md object-contain border border-slate-700"
                        />
                        <p className="text-xs text-slate-400 truncate">{idFileName || "ID_Proof_Uploaded"}</p>
                        {kycStatus !== "Verified" && (
                          <Label htmlFor="idProofInput" className="cursor-pointer text-xs text-emerald-400 hover:underline">
                            Change ID Proof Photo
                          </Label>
                        )}
                      </div>
                    ) : (
                      <Label htmlFor="idProofInput" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Click to upload ID Proof</span>
                        <span className="text-xs text-slate-500">JPG, PNG, WebP up to 5MB</span>
                      </Label>
                    )}
                    <input
                      id="idProofInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={kycStatus === "Verified"}
                      onChange={(e) => handleFileChange(e, setIdProofFile, setIdFileName)}
                    />
                  </div>
                </div>

                {/* Address Proof */}
                <div className="space-y-3">
                  <Label className="text-slate-300">2. Address Proof Photo / Document</Label>
                  <div className="border-2 border-dashed border-slate-700 bg-slate-800/50 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-colors">
                    {addressProofFile ? (
                      <div className="space-y-3">
                        <img
                          src={addressProofFile}
                          alt="Address Proof Preview"
                          className="max-h-40 mx-auto rounded-md object-contain border border-slate-700"
                        />
                        <p className="text-xs text-slate-400 truncate">{addressFileName || "Address_Proof_Uploaded"}</p>
                        {kycStatus !== "Verified" && (
                          <Label htmlFor="addressProofInput" className="cursor-pointer text-xs text-emerald-400 hover:underline">
                            Change Address Proof Photo
                          </Label>
                        )}
                      </div>
                    ) : (
                      <Label htmlFor="addressProofInput" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Click to upload Address Proof</span>
                        <span className="text-xs text-slate-500">Electricity Bill / Ration Card / Bank Passbook</span>
                      </Label>
                    )}
                    <input
                      id="addressProofInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={kycStatus === "Verified"}
                      onChange={(e) => handleFileChange(e, setAddressProofFile, setAddressFileName)}
                    />
                  </div>
                </div>
              </div>

              {kycStatus !== "Verified" && (
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg shadow-lg transition-colors"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting Verification...
                    </span>
                  ) : kycStatus === "Pending" || kycStatus === "Rejected" ? (
                    "Update & Re-Submit KYC Documents"
                  ) : (
                    "Submit Documents for KYC Verification"
                  )}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
