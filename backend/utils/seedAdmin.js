import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  const name = process.env.ADMIN_NAME || "CampusSathi Admin";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed an admin.");
  }

  await connectDB();

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  await User.create({
    name,
    email,
    password,
    role: "admin",
    preferredLanguage: "English"
  });

  console.log(`Admin created: ${email}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
