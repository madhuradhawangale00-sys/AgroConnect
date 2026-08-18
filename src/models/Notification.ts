import { Schema, model, models } from "mongoose";

const notificationSchema = new Schema(
  {
    recipientEmail: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["Offer", "Contract", "KYC", "StatusUpdate", "System"],
      default: "System",
    },
    read: { type: Boolean, default: false },
    link: { type: String, default: "" },
  },
  { timestamps: true }
);

const Notification = models.Notification || model("Notification", notificationSchema);

export default Notification;
