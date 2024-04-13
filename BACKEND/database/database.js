import mongoose from "mongoose";

export const dbConnection = async () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "MediPulse",
    })
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("Database connection error", err);
    });
};
