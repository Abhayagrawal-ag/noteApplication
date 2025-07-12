import nodemailer from 'nodemailer'
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "imabhay098@gmail.com",
    pass: "tdem zumf mxzn bkbe",
  },
});
