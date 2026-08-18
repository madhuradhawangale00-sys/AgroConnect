// import mongoose, { Schema, model } from "mongoose";

// export interface UserDocument {
//   _id: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   password: string;
//   aadhar: string;
//   role: string;
//   city: string;
//   state: string;
//   pincode: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const UserSchema = new Schema<UserDocument>(
//   {
//     fullName: { type: String, required: true },
//     email: {
//       type: String,
//       unique: true,
//       required: true,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         "Email is invalid",
//       ],
//     },
//     phone: {
//       type: String,
//       required: true,
//       match: [/^\d{10}$/, "Phone number must be 10 digits"],
//     },
//     password: { type: String, required: true },
//     aadhar: {
//       type: String,
//       required: true,
//       match: [/^\d{12}$/, "Aadhar number must be 12 digits"],
//     },
//     role: { type: String, required: true },
//     city: { type: String, required: true },
//     state: { type: String, required: true },
//     pincode: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
// export default User;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, "Full name is required."] },
    email: { type: String, required: [true, "Email is required."], unique: true },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      minlength: [10, "Phone number must be 10 digits."],
      maxlength: [10, "Phone number must be 10 digits."],
    },
    password: { type: String, required: [true, "Password is required."] },
    aadhar: {
      type: String,
      required: [true, "Aadhar number is required."],
      minlength: [12, "Aadhar number must be 12 characters."],
      maxlength: [12, "Aadhar number must be 12 characters."],
    },
    role: {
      type: String,
      required: [true, "Role is required."],
      enum: ["Farmer", "Buyer", "Admin"],
      default: "Farmer",
    },
    city: { type: String, required: [true, "City is required."] },
    state: { type: String, required: [true, "State is required."] },
    pincode: { type: String, required: [true, "Pincode is required."] },
    kycStatus: {
      type: String,
      enum: ["Not Submitted", "Pending", "Verified", "Rejected"],
      default: "Not Submitted",
    },
    kycVerifiedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

