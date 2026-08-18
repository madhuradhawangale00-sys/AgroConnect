"use client";

export const dynamic = "force-dynamic";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/app/actions/register";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, UserPlus, User, Mail, Phone, ShieldCheck, MapPin, Building, Hash, Lock, Loader2, CheckCircle2 } from "lucide-react";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry",
];

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(formRef.current!);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await register({
        email: formData.get("email") as string,
        password: password,
        fullName: formData.get("fullName") as string,
        phone: formData.get("phone") as string,
        aadhar: formData.get("aadhar") as string,
        role: formData.get("role") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        pincode: formData.get("pincode") as string,
      });

      if (response?.error) {
        setError(response.error);
        setSuccess(null);
        setLoading(false);
      } else {
        setError(null);
        setSuccess(true);
        setLoading(false);
        formRef.current?.reset();
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during registration. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between relative overflow-hidden">
      {/* Background Image & Overlay matching Homepage */}
      <div className="absolute inset-0 -z-10 bg-[url('/resources/background1.jpeg')] bg-cover bg-center opacity-25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center container max-w-7xl mx-auto px-4 py-24 relative z-10">
        <div className="w-full max-w-2xl">
          <Card className="bg-slate-900/80 border-slate-800/80 backdrop-blur-xl shadow-2xl text-slate-100 rounded-2xl overflow-hidden">
            <CardHeader className="text-center space-y-2 pb-6 border-b border-slate-800/60 bg-slate-900/40">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 mx-auto shadow-md">
                <Sprout className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-white">
                Create your AgroConnect Account
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Join as a Farmer or Buyer for direct contract farming deals
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {error && (
                <div className="p-3.5 text-sm text-red-400 bg-red-950/60 border border-red-800/60 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3.5 text-sm text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  Registration successful! Redirecting to login...
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name & Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-400" /> Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="Ramesh Kumar"
                      className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4 text-emerald-400" /> Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="ramesh@example.com"
                      className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl h-11"
                    />
                  </div>
                </div>

                {/* Phone & Aadhar */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-400" /> Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="9876543210"
                      className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhar" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" /> Aadhaar Number
                    </Label>
                    <Input
                      id="aadhar"
                      name="aadhar"
                      maxLength={12}
                      required
                      placeholder="123456789012"
                      className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl h-11"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-emerald-400" /> Select Platform Role
                  </Label>
                  <select
                    id="role"
                    name="role"
                    required
                    defaultValue="Farmer"
                    className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl h-11 px-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                  >
                    <option value="Farmer" className="bg-slate-900 text-white">Farmer (Sell Produce & Form Contracts)</option>
                    <option value="Buyer" className="bg-slate-900 text-white">Buyer (Company / Trader / Procurement Agent)</option>
                    <option value="Admin" className="bg-slate-900 text-white">Admin (KYC Review & Platform Oversight)</option>
                  </select>
                </div>

                {/* Location: City, State, Pincode */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                      <Building className="h-4 w-4 text-emerald-400" /> City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      required
                      placeholder="Nagpur"
                      className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-400" /> State
                    </Label>
                    <select
                      id="state"
                      name="state"
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl h-11 px-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                    >
                      <option value="" className="bg-slate-900 text-slate-500">Select state</option>
                      {STATES.map((st) => (
                        <option key={st} value={st} className="bg-slate-900 text-white">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                      <Hash className="h-4 w-4 text-emerald-400" /> Pincode
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      required
                      placeholder="440001"
                      className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl h-11"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-400" /> Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-400" /> Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl h-11"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl h-11 shadow-lg shadow-emerald-950/50 transition-all gap-2 text-base mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Registering Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" /> Complete Registration
                    </>
                  )}
                </Button>
              </form>

              <div className="pt-4 border-t border-slate-800/60 text-center">
                <p className="text-sm text-slate-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                    Sign In Here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
