import mongoose from "mongoose";
import "dotenv/config";
export const databaseConnect = async () => {
  try {
    await mongoose.connect(String(process.env.DATABASE_URL));
    console.log("Database is connected");
  } catch (error) {
    console.log(error);
    console.log("Database is not connected");
  }
}