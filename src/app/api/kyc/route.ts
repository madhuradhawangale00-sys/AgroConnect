import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import KYCDocument from "@/models/KYCDocument";
import User from "@/models/User";
import Notification from "@/models/Notification";

// GET: Fetch user's own KYC status or list all submissions (Admin)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    // Admin requesting all pending/all KYC documents
    if (mode === "admin" || user.role === "Admin") {
      if (user.role !== "Admin") {
        return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
      }
      const documents = await KYCDocument.find({}).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, documents });
    }

    // Regular user requesting their own KYC submission
    const document = await KYCDocument.findOne({ userId: user._id }).lean();
    return NextResponse.json({
      success: true,
      userKycStatus: user.kycStatus || "Not Submitted",
      document: document || null,
    });
  } catch (error: any) {
    console.error("GET /api/kyc error:", error);
    return NextResponse.json({ error: "Failed to fetch KYC data" }, { status: 500 });
  }
}

// POST: User submits new KYC document
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { idProofType, idProofNumber, idProofUrl, addressProofUrl } = body;

    if (!idProofType || !idProofUrl || !addressProofUrl) {
      return NextResponse.json(
        { error: "ID Proof Type, ID Proof Image, and Address Proof Image are required." },
        { status: 400 }
      );
    }

    // Upsert KYC document
    let document = await KYCDocument.findOne({ userId: user._id });
    if (document) {
      document.idProofType = idProofType;
      document.idProofNumber = idProofNumber || user.aadhar || "";
      document.idProofUrl = idProofUrl;
      document.addressProofUrl = addressProofUrl;
      document.status = "Pending";
      document.rejectionReason = "";
      await document.save();
    } else {
      document = await KYCDocument.create({
        userId: user._id,
        userEmail: user.email,
        userName: user.fullName,
        userRole: user.role,
        idProofType,
        idProofNumber: idProofNumber || user.aadhar || "",
        idProofUrl,
        addressProofUrl,
        status: "Pending",
      });
    }

    // Update user status to Pending
    user.kycStatus = "Pending";
    await user.save();

    // Create notification for user
    await Notification.create({
      recipientEmail: user.email,
      title: "KYC Documents Submitted",
      message: "Your KYC verification documents have been submitted and are under review by an administrator.",
      type: "KYC",
      link: "/kyc",
    });

    return NextResponse.json({
      success: true,
      message: "KYC document submitted successfully!",
      document,
      kycStatus: "Pending",
    });
  } catch (error: any) {
    console.error("POST /api/kyc error:", error);
    return NextResponse.json({ error: "Failed to submit KYC documents" }, { status: 500 });
  }
}

// PUT: Admin reviews (Approve/Reject) a KYC document
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const adminUser = await User.findOne({ email: session.user.email });
    if (!adminUser || adminUser.role !== "Admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { documentId, status, rejectionReason } = body;

    if (!documentId || !["Verified", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "Valid Document ID and status (Verified or Rejected) required." }, { status: 400 });
    }

    const doc = await KYCDocument.findById(documentId);
    if (!doc) {
      return NextResponse.json({ error: "KYC Document not found" }, { status: 404 });
    }

    doc.status = status;
    doc.reviewedBy = adminUser._id;
    doc.reviewedAt = new Date();
    if (status === "Rejected") {
      doc.rejectionReason = rejectionReason || "Documents provided were incomplete or illegible.";
    } else {
      doc.rejectionReason = "";
    }
    await doc.save();

    // Update target user's kycStatus
    const targetUser = await User.findById(doc.userId);
    if (targetUser) {
      targetUser.kycStatus = status;
      if (status === "Verified") {
        targetUser.kycVerifiedAt = new Date();
      }
      await targetUser.save();

      // Notify target user
      await Notification.create({
        recipientEmail: targetUser.email,
        title: status === "Verified" ? "KYC Approved! Badge Granted" : "KYC Application Update",
        message:
          status === "Verified"
            ? "Congratulations! Your identity and address proofs have been verified. You now hold a Verified Badge on AgroConnect."
            : `Your KYC application was not approved. Reason: ${doc.rejectionReason}. Please re-submit valid documents.`,
        type: "KYC",
        link: "/kyc",
      });
    }

    return NextResponse.json({
      success: true,
      message: `KYC document marked as ${status}`,
      document: doc,
    });
  } catch (error: any) {
    console.error("PUT /api/kyc error:", error);
    return NextResponse.json({ error: "Failed to review KYC document" }, { status: 500 });
  }
}
