import { Schema, model, models } from "mongoose";

const messageItemSchema = new Schema({
  senderEmail: { type: String, required: true },
  senderName: { type: String, default: "" },
  text: { type: String, default: "" },
  isOffer: { type: Boolean, default: false },
  offerAmount: { type: Number },
  offerQuantity: { type: Number },
  offerStatus: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Countered"],
  },
  timestamp: { type: Date, default: Date.now },
});

const chatMessageSchema = new Schema(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    cropName: { type: String, default: "" },
    farmerEmail: { type: String, required: true },
    farmerName: { type: String, default: "" },
    buyerEmail: { type: String, required: true },
    buyerName: { type: String, default: "" },
    messages: [messageItemSchema],
    farmerAgreed: { type: Boolean, default: false },
    buyerAgreed: { type: Boolean, default: false },
    agreedPrice: { type: Number },
    agreedQuantity: { type: Number },
    status: {
      type: String,
      enum: ["Active", "Agreed", "Rejected"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const ChatMessage = models.ChatMessage || model("ChatMessage", chatMessageSchema);

export default ChatMessage;
