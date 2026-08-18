import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import ChatMessage from "@/models/ChatMessage";
import Listing from "@/models/Listing";
import User from "@/models/User";
import Contract from "@/models/Contract";
import Notification from "@/models/Notification";

// GET: Fetch user's chat list or specific chat messages
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    // Fetch specific chat thread details
    if (chatId) {
      const chat: any = await ChatMessage.findById(chatId).lean();
      if (!chat) {
        return NextResponse.json({ error: "Chat thread not found" }, { status: 404 });
      }

      // Ensure user is farmer or buyer in this chat
      if (chat.farmerEmail !== session.user.email && chat.buyerEmail !== session.user.email) {
        return NextResponse.json({ error: "Forbidden: Not part of this conversation" }, { status: 403 });
      }

      // Fetch crop listing
      const listing = await Listing.findById(chat.listingId).lean();

      return NextResponse.json({ success: true, chat, listing });
    }

    // Fetch all active chats for user
    const chats = await ChatMessage.find({
      $or: [{ farmerEmail: session.user.email }, { buyerEmail: session.user.email }],
    })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ success: true, chats });
  } catch (error: any) {
    console.error("GET /api/chat error:", error);
    return NextResponse.json({ error: "Failed to fetch chat messages" }, { status: 500 });
  }
}

// POST: Create a new chat session OR send a message / formal offer inside chat
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { listingId, chatId, text, isOffer, offerAmount, offerQuantity } = body;

    // Sub-case 1: Create or fetch existing chat thread for a listing
    if (listingId && !chatId) {
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }

      const farmerEmail = listing.farmerEmail || listing.email;
      const buyerEmail = session.user.email;

      if (farmerEmail === buyerEmail) {
        return NextResponse.json({ error: "You cannot negotiate on your own listing" }, { status: 400 });
      }

      // Check if chat already exists
      let chat = await ChatMessage.findOne({
        listingId: listing._id,
        farmerEmail,
        buyerEmail,
      });

      if (!chat) {
        const buyerUser = await User.findOne({ email: buyerEmail });
        chat = await ChatMessage.create({
          listingId: listing._id,
          cropName: listing.cropName || listing.croptype,
          farmerEmail,
          farmerName: listing.farmerName || "Farmer",
          buyerEmail,
          buyerName: buyerUser?.fullName || session.user.name || "Buyer",
          messages: [
            {
              senderEmail: buyerEmail,
              senderName: buyerUser?.fullName || session.user.name || "Buyer",
              text: `Hello! I am interested in your ${listing.cropName} produce listing. Let's discuss contract terms.`,
              isOffer: false,
              timestamp: new Date(),
            },
          ],
        });
      }

      return NextResponse.json({ success: true, chatId: chat._id, chat });
    }

    // Sub-case 2: Send message or offer to existing chatId
    if (chatId) {
      const chat = await ChatMessage.findById(chatId);
      if (!chat) {
        return NextResponse.json({ error: "Chat thread not found" }, { status: 404 });
      }

      const senderEmail = session.user.email;
      const senderName = session.user.name || (senderEmail === chat.farmerEmail ? chat.farmerName : chat.buyerName);

      const messageItem: any = {
        senderEmail,
        senderName,
        text: text || (isOffer ? `Proposed Offer: ₹${offerAmount}/unit for ${offerQuantity} units` : ""),
        isOffer: Boolean(isOffer),
        timestamp: new Date(),
      };

      if (isOffer) {
        messageItem.offerAmount = Number(offerAmount);
        messageItem.offerQuantity = Number(offerQuantity);
        messageItem.offerStatus = "Pending";
      }

      chat.messages.push(messageItem);

      // Reset agreement flags when a new message/counter offer is sent
      chat.farmerAgreed = senderEmail === chat.farmerEmail ? chat.farmerAgreed : false;
      chat.buyerAgreed = senderEmail === chat.buyerEmail ? chat.buyerAgreed : false;

      await chat.save();

      // Notify counterparty
      const recipientEmail = senderEmail === chat.farmerEmail ? chat.buyerEmail : chat.farmerEmail;
      await Notification.create({
        recipientEmail,
        title: isOffer ? `New Price Offer Received for ${chat.cropName}` : `New Message in ${chat.cropName} Chat`,
        message: isOffer
          ? `${senderName} offered ₹${offerAmount}/unit for ${offerQuantity} units of ${chat.cropName}.`
          : `${senderName}: "${(text || "").slice(0, 50)}..."`,
        type: "Offer",
        link: `/chat/${chat._id}`,
      });

      return NextResponse.json({ success: true, message: "Message sent", chat });
    }

    return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}

// PUT: Respond to offer OR Sign/Agree to terms & Auto-Generate Digital Contract
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { chatId, action, offerIndex, agreedPrice, agreedQuantity } = body;

    if (!chatId || !action) {
      return NextResponse.json({ error: "Chat ID and Action required" }, { status: 400 });
    }

    const chat = await ChatMessage.findById(chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat thread not found" }, { status: 404 });
    }

    const userEmail = session.user.email;

    // Action 1: Accept/Reject a specific offer in chat history
    if (action === "accept_offer" || action === "reject_offer") {
      if (typeof offerIndex === "number" && chat.messages[offerIndex]) {
        chat.messages[offerIndex].offerStatus = action === "accept_offer" ? "Accepted" : "Rejected";
        if (action === "accept_offer") {
          chat.agreedPrice = chat.messages[offerIndex].offerAmount;
          chat.agreedQuantity = chat.messages[offerIndex].offerQuantity;
        }
      }
    }

    // Action 2: Sign/Agree to terms for contract generation
    if (action === "agree") {
      if (userEmail === chat.farmerEmail) {
        chat.farmerAgreed = true;
      } else if (userEmail === chat.buyerEmail) {
        chat.buyerAgreed = true;
      }
    }

    await chat.save();

    // Check if BOTH farmer and buyer have agreed -> Auto Generate Digital Contract!
    let generatedContract = null;
    if (chat.farmerAgreed && chat.buyerAgreed) {
      const listing = await Listing.findById(chat.listingId);

      // Check if contract already generated for this chat
      let contract = await Contract.findOne({ listingId: chat.listingId, farmerEmail: chat.farmerEmail, buyerEmail: chat.buyerEmail });
      if (!contract) {
        const finalPrice = chat.agreedPrice || listing?.expectedPricePerUnit || 2000;
        const finalQty = chat.agreedQuantity || listing?.quantity || 100;
        const total = finalPrice * finalQty;
        const harvestDate = listing?.harvestDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        contract = await Contract.create({
          listingId: chat.listingId,
          farmerEmail: chat.farmerEmail,
          farmerName: chat.farmerName,
          buyerEmail: chat.buyerEmail,
          buyerName: chat.buyerName,
          cropName: chat.cropName,
          quantity: finalQty,
          unit: listing?.unit || "Quintal",
          agreedPricePerUnit: finalPrice,
          totalAmount: total,
          deliveryDate: harvestDate,
          paymentTerms: "30% Advance upon contract confirmation, 70% upon verified crop delivery.",
          farmerSignature: { signed: true, signedAt: new Date() },
          buyerSignature: { signed: true, signedAt: new Date() },
          status: "Confirmed",
        });

        // Update listing status to Contracted
        if (listing) {
          listing.status = "Contracted";
          await listing.save();
        }

        chat.status = "Agreed";
        await chat.save();

        // Notify both parties of Contract Generation
        await Notification.create({
          recipientEmail: chat.farmerEmail,
          title: `Digital Contract Generated for ${chat.cropName}`,
          message: `Both parties signed the deal! Official digital contract #${contract._id.toString().slice(-6)} has been generated.`,
          type: "Contract",
          link: `/contracts/${contract._id}`,
        });

        await Notification.create({
          recipientEmail: chat.buyerEmail,
          title: `Digital Contract Generated for ${chat.cropName}`,
          message: `Both parties signed the deal! Official digital contract #${contract._id.toString().slice(-6)} has been generated.`,
          type: "Contract",
          link: `/contracts/${contract._id}`,
        });
      }

      generatedContract = contract;
    }

    return NextResponse.json({
      success: true,
      chat,
      contract: generatedContract,
      contractGenerated: Boolean(generatedContract),
    });
  } catch (error: any) {
    console.error("PUT /api/chat error:", error);
    return NextResponse.json({ error: "Failed to update chat status" }, { status: 500 });
  }
}
