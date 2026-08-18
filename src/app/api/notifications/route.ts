import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";

// GET: Fetch user notifications
export async function GET(_request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const notifications = await Notification.find({ recipientEmail: session.user.email })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const unreadCount = notifications.filter((n: any) => !n.read).length;

    return NextResponse.json({ success: true, unreadCount, notifications });
  } catch (error: any) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// PUT: Mark notification(s) as read
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { notificationId, markAllRead } = body;

    if (markAllRead) {
      await Notification.updateMany({ recipientEmail: session.user.email }, { $set: { read: true } });
    } else if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, { $set: { read: true } });
    }

    return NextResponse.json({ success: true, message: "Notifications updated" });
  } catch (error: any) {
    console.error("PUT /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to update notification status" }, { status: 500 });
  }
}
