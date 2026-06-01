import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/Db.js";
import { config } from "./config/index.js";

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
});

const start = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

start();