import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  db: process.env.DATABASE_URL!,
  smtp_host: process.env.SMTP_HOST!,
  smtp_port: Number(process.env.SMTP_PORT) || 587,
  smtp_user: process.env.SMTP_USER!,
  smtp_pass: process.env.SMTP_PASS!,
  smtp_from: process.env.SMTP_FROM!,
  jwt_secret: process.env.JWT_SECRET!,
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
};