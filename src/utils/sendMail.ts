import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "../config/index.js";

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendMail = async (option: {
  email: string;
  subject: string;
  template: string;
  data: {
    name: string;
    activationCode?: string;
    resetLink?: string;
  };
}) => {

  const templatePath = path.join(
    __dirname,
    "../mails",
    option.template
  );


  const html = await ejs.renderFile(templatePath, option.data);

  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: config.smtp_port,
    secure: false,
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });

  await transporter.sendMail({
    from: `"WatchTV Support" <${config.smtp_user}>`,
    to: option.email,
    subject: option.subject,
    html,
  });
};