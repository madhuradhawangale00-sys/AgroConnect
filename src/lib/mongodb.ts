import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;

  const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://Kapil:Nirvana1640@cluster0.sqxm0.mongodb.net/agroconnect?retryWrites=true&w=majority";

  try {
    const opts = {
      bufferCommands: false,
    };

    const db = await mongoose.connect(MONGODB_URI, opts);
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to MongoDB successfully");
  } catch (error: any) {
    console.error("MongoDB Connection Failed:", error.message || error);
    throw new Error(`Failed to connect to the database: ${error.message || "Connection refused"}`);
  }
}
