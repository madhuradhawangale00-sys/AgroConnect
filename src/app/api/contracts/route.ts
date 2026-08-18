import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Contract from "@/models/Contract";
import User from "@/models/User";
import Notification from "@/models/Notification";

// GET: Fetch user's contracts or a single contract by ID
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const contractId = searchParams.get("id");

    if (contractId) {
      const contract: any = await Contract.findById(contractId).lean();
      if (!contract) {
        return NextResponse.json({ error: "Contract not found" }, { status: 404 });
      }

      // Ensure user is farmer, buyer, or admin
      const user = await User.findOne({ email: session.user.email });
      if (
        contract.farmerEmail !== session.user.email &&
        contract.buyerEmail !== session.user.email &&
        user?.role !== "Admin"
      ) {
        return NextResponse.json({ error: "Forbidden: Not part of this contract" }, { status: 403 });
      }

      return NextResponse.json({ success: true, contract });
    }

    // List all contracts where user is farmer or buyer
    const user = await User.findOne({ email: session.user.email });
    let query: any = { $or: [{ farmerEmail: session.user.email }, { buyerEmail: session.user.email }] };
    if (user?.role === "Admin") {
      query = {}; // Admin sees all contracts
    }

    const contracts = await Contract.find(query).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ success: true, count: contracts.length, contracts });
  } catch (error: any) {
    console.error("GET /api/contracts error:", error);
    return NextResponse.json({ error: "Failed to fetch contract details" }, { status: 500 });
  }
}

// PUT: Update contract status milestone (In Progress, Delivered, Payment Completed, Closed, Disputed)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { contractId, status, notes } = body;

    const validStatuses = [
      "Pending Signatures",
      "Confirmed",
      "In Progress",
      "Delivered",
      "Payment Completed",
      "Closed",
      "Disputed",
    ];

    if (!contractId || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Valid Contract ID and status required" }, { status: 400 });
    }

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (
      contract.farmerEmail !== session.user.email &&
      contract.buyerEmail !== session.user.email &&
      user?.role !== "Admin"
    ) {
      return NextResponse.json({ error: "Forbidden: Not authorized to update contract" }, { status: 403 });
    }

    contract.status = status;
    if (notes) contract.notes = notes;
    await contract.save();

    // Notify counterparty
    const recipientEmail = session.user.email === contract.farmerEmail ? contract.buyerEmail : contract.farmerEmail;
    await Notification.create({
      recipientEmail,
      title: `Contract Milestone Updated: ${status}`,
      message: `Contract #${contract._id.toString().slice(-6)} status updated to ${status} by ${session.user.name || session.user.email}.`,
      type: "StatusUpdate",
      link: `/contracts/${contract._id}`,
    });

    return NextResponse.json({
      success: true,
      message: `Contract status updated to ${status}`,
      contract,
    });
  } catch (error: any) {
    console.error("PUT /api/contracts error:", error);
    return NextResponse.json({ error: "Failed to update contract milestone" }, { status: 500 });
  }
}
