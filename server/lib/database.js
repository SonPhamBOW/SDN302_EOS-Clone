import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.db.databaseName}`);
  } catch (error) {
    console.log("Error connect with MongoDB" + error);
    console.log("Try connect local database");
    connectLocalDb();
  }
};

const connectLocalDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_LOCAL);
    console.log(`MongoDB connected: ${conn.connection.db.databaseName}`);
  } catch (error) {
    console.log("Error connect with localDB" + error);
    process.exit(1);
  }
};
