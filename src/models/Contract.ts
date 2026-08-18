import { Schema, model, models } from "mongoose";

const contractSchema = new Schema(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    farmerEmail: { type: String, required: true },
    farmerName: { type: String, default: "" },
    buyerEmail: { type: String, required: true },
    buyerName: { type: String, default: "" },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: "Quintal" },
    agreedPricePerUnit: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
    paymentTerms: { type: String, default: "30% Advance on signing, 70% on verified delivery" },
    farmerSignature: {
      signed: { type: Boolean, default: false },
      signedAt: { type: Date },
    },
    buyerSignature: {
      signed: { type: Boolean, default: false },
      signedAt: { type: Date },
    },
    status: {
      type: String,
      enum: [
        "Pending Signatures",
        "Confirmed",
        "In Progress",
        "Delivered",
        "Payment Completed",
        "Closed",
        "Disputed",
      ],
      default: "Pending Signatures",
    },
    pdfUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Contract = models.Contract || model("Contract", contractSchema);

export default Contract;
