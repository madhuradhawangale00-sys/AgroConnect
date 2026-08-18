"use client";

export const dynamic = "force-dynamic";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, LogIn, Lock, Mail, UserCheck, Loader2 } from "lucide-react";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const role = (formData.get("role") as string) || "Farmer";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        role: role.toLowerCase(),
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      if (res?.ok) {
        if (email) {
          localStorage.setItem("email", email);
        }

        const normRole = role.toLowerCase();
        if (normRole === "farmer") {
          router.push("/fdashboard");
        } else if (normRole === "buyer") {
          router.push("/bdashboard");
        } else if (normRole === "admin") {
          router.push("/admin/kyc");
        } else {
          router.push("/fdashboard");
        }
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
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
        <div className="w-full max-w-md">
          <Card className="bg-slate-900/80 border-slate-800/80 backdrop-blur-xl shadow-2xl text-slate-100 rounded-2xl overflow-hidden">
            <CardHeader className="text-center space-y-2 pb-6 border-b border-slate-800/60 bg-slate-900/40">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 mx-auto shadow-md">
                <Sprout className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-white">
                Welcome Back to AgroConnect
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Sign in to manage contract farming deals & orders
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {error && (
                <div className="p-3.5 text-sm text-red-400 bg-red-950/60 border border-red-800/60 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-400" /> Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl h-11"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-400" /> Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
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
                  <Label htmlFor="role" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-emerald-400" /> Select Role
                  </Label>
                  <select
                    id="role"
                    name="role"
                    required
                    defaultValue="Farmer"
                    className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl h-11 px-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                  >
                    <option value="Farmer" className="bg-slate-900 text-white">Farmer (Sell Produce)</option>
                    <option value="Buyer" className="bg-slate-900 text-white">Buyer (Procurement Agent / Company)</option>
                    <option value="Admin" className="bg-slate-900 text-white">Admin (KYC Review)</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl h-11 shadow-lg shadow-emerald-950/50 transition-all gap-2 text-base mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" /> Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="pt-4 border-t border-slate-800/60 text-center">
                <p className="text-sm text-slate-400">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                    Register Here
                  </Link>
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800/60 rounded-xl text-xs space-y-1 text-slate-400">
                <p className="font-semibold text-slate-300">Testing Credentials:</p>
                <p><span className="text-slate-500">ID:</span> Tester23@gmail.com</p>
                <p><span className="text-slate-500">Password:</span> 1234</p>
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
