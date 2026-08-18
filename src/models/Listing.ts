import { Schema, model, models } from "mongoose";

const listingSchema = new Schema(
  {
    cropName: { type: String, required: true },
    croptype: { type: String }, // Legacy alias
    variety: { type: String, default: "" },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ["Quintal", "Kg", "Ton"], default: "Quintal" },
    expectedPricePerUnit: { type: Number, required: true },
    price: { type: Number }, // Legacy alias
    croppingDate: { type: Date },
    croppingtime: { type: String }, // Legacy alias
    harvestDate: { type: Date, required: true },
    harvestingtime: { type: String }, // Legacy alias
    location: {
      city: { type: String, required: true },
      district: { type: String, default: "" },
      state: { type: String, required: true },
      pincode: { type: String, default: "" },
    },
    fcity: { type: String },
    fstate: { type: String },
    fpincode: { type: String },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["Active", "Under Negotiation", "Contracted", "Completed", "Cancelled"],
      default: "Active",
    },
    farmerEmail: { type: String, required: true },
    email: { type: String }, // Legacy alias
    farmerName: { type: String, default: "" },
    farmerId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Pre-save hook to populate legacy aliases automatically if missing
listingSchema.pre("save", function (next) {
  if (!this.croptype) this.croptype = this.cropName;
  if (!this.price) this.price = this.expectedPricePerUnit;
  if (!this.email) this.email = this.farmerEmail;
  if (!this.fcity && this.location?.city) this.fcity = this.location.city;
  if (!this.fstate && this.location?.state) this.fstate = this.location.state;
  if (!this.fpincode && this.location?.pincode) this.fpincode = this.location.pincode;
  next();
});

const Listing = models.Listing || model("Listing", listingSchema);

export default Listing;

