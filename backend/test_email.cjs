const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log("Config:", process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `MarkatVerse <${process.env.SMTP_USER}>`,
      to: 'manishtarjan2@gmail.com', // Replace with the email address you want to test
      subject: 'Test Email from MarkatVerse',
      text: 'This is a test email to verify SMTP settings. Your OTP is: 123456',
    });
    console.log('Email sent successfully!', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

testEmail();
