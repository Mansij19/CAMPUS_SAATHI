import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`CampusSathi API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start CampusSathi API:", error.message);
    process.exit(1);
  });
