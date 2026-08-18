"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bell, Check, Tag, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationBell() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;

    const loadNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [userEmail]);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-800 relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-100 w-80 max-h-96 overflow-y-auto">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Check className="h-3 w-3" /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">No notifications yet</div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem key={n._id} asChild className="p-3 border-b border-slate-800/50 hover:bg-slate-800 cursor-pointer focus:bg-slate-800">
              <Link href={n.link || "#"} className="flex items-start gap-2.5">
                <div className="p-1.5 bg-slate-800 text-emerald-400 rounded mt-0.5 shrink-0">
                  {n.type === "Offer" ? <Tag className="h-3.5 w-3.5" /> : n.type === "Contract" ? <FileText className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${n.read ? "text-slate-300" : "text-emerald-300 font-bold"}`}>{n.title}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{n.message}</p>
                  <p className="text-[9px] text-slate-500 mt-1 font-mono">{new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
