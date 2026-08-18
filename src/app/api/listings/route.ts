import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import User from "@/models/User";

// GET: Fetch listings with search, location, price, quantity filters & farmer KYC info
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const crop = searchParams.get("crop");
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minQuantity = searchParams.get("minQuantity");
    const status = searchParams.get("status") || "Active";
    const myListingsOnly = searchParams.get("myListings");
    const listingId = searchParams.get("id");

    // Fetch single listing by ID
    if (listingId) {
      const listing: any = await Listing.findById(listingId).lean();
      if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }
      // Attach farmer KYC status
      const farmer: any = await User.findOne({ email: listing.farmerEmail || listing.email }).select("fullName phone email kycStatus city state").lean();
      return NextResponse.json({
        success: true,
        listing: {
          ...listing,
          farmerName: farmer?.fullName || listing.farmerName || "Farmer",
          farmerPhone: farmer?.phone || "",
          farmerKycStatus: farmer?.kycStatus || "Not Submitted",
        },
      });
    }

    // Filter query builder
    const query: any = {};

    if (myListingsOnly === "true") {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      query.$or = [{ farmerEmail: session.user.email }, { email: session.user.email }];
    } else {
      if (status !== "All") {
        query.status = status;
      }
      if (crop) {
        query.$or = [
          { cropName: { $regex: crop, $options: "i" } },
          { croptype: { $regex: crop, $options: "i" } },
          { variety: { $regex: crop, $options: "i" } },
        ];
      }
      if (state && state !== "All") {
        query.$or = [
          { "location.state": state },
          { fstate: state },
        ];
      }
      if (city) {
        query.$or = [
          { "location.city": { $regex: city, $options: "i" } },
          { fcity: { $regex: city, $options: "i" } },
        ];
      }
      if (minPrice || maxPrice) {
        query.expectedPricePerUnit = {};
        if (minPrice) query.expectedPricePerUnit.$gte = Number(minPrice);
        if (maxPrice) query.expectedPricePerUnit.$lte = Number(maxPrice);
      }
      if (minQuantity) {
        query.quantity = { $gte: Number(minQuantity) };
      }
    }

    const rawListings = await Listing.find(query).sort({ createdAt: -1 }).lean();

    // Enrich listings with farmer KYC status
    const farmerEmails = Array.from(new Set(rawListings.map((l: any) => l.farmerEmail || l.email).filter(Boolean)));
    const farmers = await User.find({ email: { $in: farmerEmails } }).select("email fullName phone kycStatus").lean();
    const farmerMap = new Map(farmers.map((f: any) => [f.email, f]));

    const listings = rawListings.map((l: any) => {
      const fEmail = l.farmerEmail || l.email;
      const fUser: any = farmerMap.get(fEmail);
      return {
        ...l,
        farmerName: fUser?.fullName || l.farmerName || "Farmer",
        farmerPhone: fUser?.phone || "",
        farmerKycStatus: fUser?.kycStatus || "Not Submitted",
        cropName: l.cropName || l.croptype || "Crop",
        expectedPricePerUnit: l.expectedPricePerUnit || l.price || 0,
        unit: l.unit || "Quintal",
        harvestDate: l.harvestDate || l.harvestingtime || l.createdAt,
        location: l.location || { city: l.fcity, state: l.fstate, pincode: l.fpincode },
      };
    });

    return NextResponse.json({ success: true, count: listings.length, listings });
  } catch (error: any) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

// POST: Create a new produce listing (Farmer)
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
    const { cropName, variety, quantity, unit, expectedPricePerUnit, croppingDate, harvestDate, location, images } = body;

    if (!cropName || !quantity || !expectedPricePerUnit || !harvestDate) {
      return NextResponse.json(
        { error: "Crop Name, Quantity, Expected Price, and Harvest Date are required." },
        { status: 400 }
      );
    }

    const newListing = await Listing.create({
      cropName,
      croptype: cropName,
      variety: variety || "",
      quantity: Number(quantity),
      unit: unit || "Quintal",
      expectedPricePerUnit: Number(expectedPricePerUnit),
      price: Number(expectedPricePerUnit),
      croppingDate: croppingDate ? new Date(croppingDate) : undefined,
      croppingtime: croppingDate || "",
      harvestDate: new Date(harvestDate),
      harvestingtime: harvestDate,
      location: {
        city: location?.city || user.city || "",
        district: location?.district || "",
        state: location?.state || user.state || "",
        pincode: location?.pincode || user.pincode || "",
      },
      fcity: location?.city || user.city || "",
      fstate: location?.state || user.state || "",
      fpincode: location?.pincode || user.pincode || "",
      images: Array.isArray(images) && images.length > 0 ? images : ["/resources/card1.png"],
      status: "Active",
      farmerEmail: user.email,
      email: user.email,
      farmerName: user.fullName,
      farmerId: user._id,
    });

    return NextResponse.json({
      success: true,
      message: "Produce listing created successfully!",
      listing: newListing,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}

// DELETE: Delete a produce listing (Farmer/Admin)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("id");

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID required" }, { status: 400 });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (listing.farmerEmail !== session.user.email && listing.email !== session.user.email && user?.role !== "Admin") {
      return NextResponse.json({ error: "Forbidden: You do not own this listing" }, { status: 403 });
    }

    await Listing.findByIdAndDelete(listingId);
    return NextResponse.json({ success: true, message: "Listing deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/listings error:", error);
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}
