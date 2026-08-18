"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const register = async (values: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  aadhar: string;
  role: string;
  city: string;
  state: string;
  pincode: string;
}) => {
  const { fullName, email, phone, password, aadhar, role, city, state, pincode } = values;

  try {
    await connectDB();

    const cleanEmail = (email || "").toLowerCase().trim();
    const cleanPhone = (phone || "").replace(/\s+/g, "").trim();
    const cleanAadhar = (aadhar || "").replace(/\s+/g, "").trim();

    if (!fullName || !cleanEmail || !cleanPhone || !password || !cleanAadhar || !city || !state || !pincode) {
      return { error: "Please fill in all required fields." };
    }

    // Check if email already exists
    const userFound = await User.findOne({ email: cleanEmail });
    if (userFound) {
      return { error: "An account with this email address already exists!" };
    }

    // Validate role (matching Farmer, Buyer, Admin case-insensitively)
    const validRoles = ["Farmer", "Buyer", "Admin"];
    const matchedRole = validRoles.find(
      (r) => r.toLowerCase() === (role || "").toLowerCase()
    );
    const userRole = matchedRole || "Farmer";

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const newUser = new User({
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      aadhar: cleanAadhar,
      role: userRole,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      kycStatus: "Not Submitted",
    });

    const savedUser = await newUser.save();

    // Convert to plain object and exclude sensitive data
    const userObject = savedUser.toObject();
    delete userObject.password;
    delete userObject.__v;

    return { success: true, user: JSON.parse(JSON.stringify(userObject)) };
  } catch (error: any) {
    console.error("Registration error details:", error);

    // Handle Mongoose Validation Error (e.g. phone/aadhar digit length rules)
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return { error: errors.join(", ") };
    }

    // Handle Mongo E11000 Duplicate Key Error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return { error: `An account with this ${field} already exists!` };
    }

    return { error: error.message || "Registration failed! Please try again." };
  }
};
