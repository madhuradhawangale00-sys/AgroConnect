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
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1000;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setFileState(compressedBase64);
      };
      img.src = event.target?.result as string;
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-[url('/resources/background6.jpeg')] bg-cover bg-center opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/60 pointer-events-none" />
      <Header />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-24 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={(session?.user as any)?.role === "Buyer" ? "/bdashboard" : (session?.user as any)?.role === "Admin" ? "/admin/kyc" : "/fdashboard"}
              className="inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300 mb-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="h-9 w-9 text-emerald-400" />
              KYC Identity Verification
            </h1>
            <p className="text-slate-200 mt-2 text-base font-normal">
              Verify your identity to gain a green badge and unlock full contract farming capabilities on AgroConnect.
            </p>
          </div>

          <KYCBadge status={kycStatus} size="lg" />
        </div>

        {/* Status Callout Card */}
        {kycStatus === "Verified" && (
          <Card className="bg-emerald-950/80 border-2 border-emerald-500 mb-8 shadow-xl">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-full shrink-0">
                <FileCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-200">Your Identity is Verified!</h3>
                <p className="text-sm text-emerald-100 mt-1 leading-relaxed">
                  Your identity documents have been approved by platform administration. Your produce listings and profile now display a green "KYC Verified" badge.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {kycStatus === "Pending" && (
          <Card className="bg-amber-950/80 border-2 border-amber-500 mb-8 shadow-xl">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-full shrink-0">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-200">Verification Under Review</h3>
                <p className="text-sm text-amber-100 mt-1 leading-relaxed">
                  Your uploaded ID and address proof documents have been submitted to the Admin Queue for verification. You can update your submission below if needed.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {kycStatus === "Rejected" && (
          <Card className="bg-red-950/80 border-2 border-red-500 mb-8 shadow-xl">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 bg-red-500/20 text-red-400 rounded-full shrink-0">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-200">KYC Verification Rejected</h3>
                <p className="text-sm text-red-100 mt-1">
                  <span className="font-bold text-white">Reason:</span>{" "}
                  {kycDoc?.rejectionReason || "Uploaded documents were blurry or incomplete."}
                </p>
                <p className="text-sm text-red-200 mt-2">
                  Please re-upload clear photos of your valid identity and address documents below.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Form Card */}
        <Card className="bg-slate-900 border-2 border-slate-700/80 shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-800/80 border-b border-slate-700/80 pb-5">
            <CardTitle className="text-xl font-bold text-white">
              {kycStatus === "Verified" ? "Uploaded Identity Documents" : "Upload Verification Documents"}
            </CardTitle>
            <CardDescription className="text-slate-200 text-sm font-medium mt-1">
              Provide government-issued identity proof (Aadhaar / PAN / Voter ID) and valid address proof.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <div className="p-4 mb-6 text-sm font-semibold text-red-200 bg-red-950/90 border border-red-700 rounded-xl">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-4 mb-6 text-sm font-semibold text-emerald-200 bg-emerald-950/90 border border-emerald-700 rounded-xl">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="idType" className="text-slate-100 font-semibold text-sm">Identity Proof Type</Label>
                  <Select
                    value={idProofType}
                    onValueChange={(val) => setIdProofType(val)}
                    disabled={kycStatus === "Verified"}
                  >
                    <SelectTrigger className="bg-slate-950 border-2 border-slate-700 text-white font-medium h-11">
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-2 border-slate-700 text-white">
                      <SelectItem value="Aadhar">Aadhaar Card</SelectItem>
                      <SelectItem value="PAN">PAN Card</SelectItem>
                      <SelectItem value="VoterID">Voter ID</SelectItem>
                      <SelectItem value="DrivingLicense">Driving License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idNumber" className="text-slate-100 font-semibold text-sm">Identity Document Number</Label>
                  <Input
                    id="idNumber"
                    value={idProofNumber}
                    onChange={(e) => setIdProofNumber(e.target.value)}
                    placeholder="Enter document number (e.g. 12-digit Aadhaar)"
                    disabled={kycStatus === "Verified"}
                    className="bg-slate-950 border-2 border-slate-700 text-white font-medium placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 h-11"
                  />
                </div>
              </div>

              {/* Document File Selectors */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* ID Proof */}
                <div className="space-y-3">
                  <Label className="text-slate-100 font-semibold text-sm">1. ID Proof Photo / Document</Label>
                  <div className="border-2 border-dashed border-slate-600 bg-slate-950/80 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
                    {idProofFile ? (
                      <div className="space-y-3">
                        <img
                          src={idProofFile}
                          alt="ID Proof Preview"
                          className="max-h-44 mx-auto rounded-lg object-contain border-2 border-slate-700 bg-black/40 p-1"
                        />
                        <p className="text-xs font-medium text-slate-300 truncate">{idFileName || "ID_Proof_Uploaded"}</p>
                        {kycStatus !== "Verified" && (
                          <Label htmlFor="idProofInput" className="cursor-pointer text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline">
                            Change ID Proof Photo
                          </Label>
                        )}
                      </div>
                    ) : (
                      <Label htmlFor="idProofInput" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-emerald-400" />
                        <span className="text-sm font-semibold text-slate-100">Click to upload ID Proof</span>
                        <span className="text-xs text-slate-300 font-medium">JPG, PNG, WebP up to 5MB</span>
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
                  <Label className="text-slate-100 font-semibold text-sm">2. Address Proof Photo / Document</Label>
                  <div className="border-2 border-dashed border-slate-600 bg-slate-950/80 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
                    {addressProofFile ? (
                      <div className="space-y-3">
                        <img
                          src={addressProofFile}
                          alt="Address Proof Preview"
                          className="max-h-44 mx-auto rounded-lg object-contain border-2 border-slate-700 bg-black/40 p-1"
                        />
                        <p className="text-xs font-medium text-slate-300 truncate">{addressFileName || "Address_Proof_Uploaded"}</p>
                        {kycStatus !== "Verified" && (
                          <Label htmlFor="addressProofInput" className="cursor-pointer text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline">
                            Change Address Proof Photo
                          </Label>
                        )}
                      </div>
                    ) : (
                      <Label htmlFor="addressProofInput" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-emerald-400" />
                        <span className="text-sm font-semibold text-slate-100">Click to upload Address Proof</span>
                        <span className="text-xs text-slate-300 font-medium">Electricity Bill / Ration Card / Bank Passbook</span>
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
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl h-12 text-base shadow-lg shadow-emerald-950/60 transition-all gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Submitting Documents...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" /> Submit Documents for KYC Verification
                    </>
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
