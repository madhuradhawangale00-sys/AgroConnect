import { Schema, model, models } from "mongoose";

const kycDocumentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, default: "" },
    userRole: { type: String, required: true },
    idProofType: {
      type: String,
      enum: ["Aadhar", "PAN", "VoterID", "DrivingLicense"],
      required: true,
    },
    idProofNumber: { type: String, default: "" },
    idProofUrl: { type: String, required: true }, // Base64 data URL or URL
    addressProofUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    rejectionReason: { type: String, default: "" },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

const KYCDocument = models.KYCDocument || model("KYCDocument", kycDocumentSchema);

export default KYCDocument;
