import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("<") || uri.includes(">")) {
    process.env.USE_DEV_STORE = "true";
    console.warn("MongoDB URI is not configured. Running with local development data store.");
    return;
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    process.env.USE_DEV_STORE = "false";
    console.log("MongoDB connected");
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      process.env.USE_DEV_STORE = "true";
      console.warn(`MongoDB unavailable at ${uri}. Running with local development data store.`);
      console.warn(`MongoDB error: ${error.message}`);
      return;
    }

    throw error;
  }
};

export default connectDB;
