import { connectDB } from "./mongodb";
import User from "../models/User";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const email = credentials?.email?.toLowerCase().trim();
        const user = await User.findOne({ email }).select("+password");

        if (!user) throw new Error("Invalid Email or Password");

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!passwordMatch) throw new Error("Invalid Email or Password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          role: user.role,
          kycStatus: user.kycStatus || "Not Submitted",
          city: user.city,
          state: user.state,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.kycStatus = (user as any).kycStatus;
        token.city = (user as any).city;
        token.state = (user as any).state;
      }
      if (trigger === "update" && session) {
        if (session.kycStatus) token.kycStatus = session.kycStatus;
        if (session.role) token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).kycStatus = token.kycStatus;
        (session.user as any).city = token.city;
        (session.user as any).state = token.state;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "agroconnect_secret_key_2026",
};

