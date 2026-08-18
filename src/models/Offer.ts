import { Schema, model, models } from "mongoose";

const offerSchema = new Schema(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    farmerEmail: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    offeredPricePerUnit: { type: Number, required: true },
    offeredQuantity: { type: Number, required: true },
    unit: { type: String, default: "Quintal" },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Countered", "Accepted", "Rejected"],
      default: "Pending",
    },
    counterPricePerUnit: { type: Number },
    counterQuantity: { type: Number },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

const Offer = models.Offer || model("Offer", offerSchema);

export default Offer;
