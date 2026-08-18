"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Sun, Moon, Languages, ShieldCheck, User as UserIcon, LogOut, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoogleTranslate from "@/components/GoogleTranslate";
import KYCBadge from "@/components/KYCBadge";
import NotificationBell from "@/components/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = ["English", "हिन्दी", "मराठी"];

export default function Header() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark" | null) || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const userRole = (session?.user as any)?.role || "Farmer";
  const kycStatus = (session?.user as any)?.kycStatus || "Not Submitted";
  const dashboardLink = userRole === "Buyer" ? "/bdashboard" : userRole === "Admin" ? "/admin/kyc" : "/fdashboard";

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* AgroConnect Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-emerald-600 rounded-lg text-white group-hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-950">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
              AgroConnect
            </span>
            <span className="text-[10px] text-emerald-400/90 font-medium tracking-wide">
              Contract Farming Portal
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-3 md:space-x-5 ml-auto">
          <Link href="/" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Home
          </Link>

          {session ? (
            <>
              <Link href={dashboardLink} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/contracts" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
                Contracts
              </Link>
              <Link href="/kyc" className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
                <KYCBadge status={kycStatus} size="sm" showText={false} />
                <span className="hidden sm:inline">KYC</span>
              </Link>

              {userRole === "Admin" && (
                <Link href="/admin/kyc" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors font-semibold">
                  Admin Queue
                </Link>
              )}

              <NotificationBell />

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-slate-200 hover:bg-slate-800 flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold max-w-[100px] truncate">{session.user?.name || session.user?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200 min-w-[200px]">
                  <div className="p-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white truncate">{session.user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{session.user?.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                        {userRole}
                      </span>
                      <KYCBadge status={kycStatus} size="sm" />
                    </div>
                  </div>
                  <DropdownMenuItem asChild className="hover:bg-slate-800 cursor-pointer">
                    <Link href="/kyc" className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" /> KYC Verification
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-400 hover:bg-red-950/40 hover:text-red-300 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
                Login
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm">
                  Register
                </Button>
              </Link>
            </>
          )}

          {/* Google Translate Multi-Lingual Selector */}
          <GoogleTranslate />

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-slate-300 hover:text-white hover:bg-slate-800">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </nav>
      </div>
    </header>
  );
}
