import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./modules/users/user.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend running..." });
});

export default app;