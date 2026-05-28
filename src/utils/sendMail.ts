import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

interface IMailOptions {
  email: string;
  subject: string;
  template: string;

  data: {
    name: string;
    activationCode: string;
  };
}

export const sendMail = async (
  option: IMailOptions
) => {


  const templatePath = path.join(
    process.cwd(),
    "src/mails",
    option.template
  );


  const html: string = await ejs.renderFile(
    templatePath,
    option.data
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: option.email,
    subject: option.subject,
    html,
  });
};