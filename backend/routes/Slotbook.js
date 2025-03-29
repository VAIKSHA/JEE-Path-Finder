const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or App Password
  },
});

router.post("/book-slot", async (req, res) => {
  const { name, email, contact, date, hours, timeSlot } = req.body;

  if (!name || !email || !contact || !date || !hours || !timeSlot) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Email to the user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Slot Booking Confirmation",
      text: `Hello ${name},\n\nYour slot has been successfully booked!\n\nDetails:\nDate: ${date}\nTime: ${timeSlot}\nDuration: ${hours} hour(s)\n\nThank you for booking with us!`,
    });

    // Email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Admin email from .env
      subject: "New Slot Booking",
      text: `A new slot has been booked:\n\nName: ${name}\nEmail: ${email}\nContact: ${contact}\nDate: ${date}\nTime: ${timeSlot}\nDuration: ${hours} hour(s)`,
    });

    res.status(200).json({ success: true, message: "Slot booked successfully and email sent!" });
  }
  catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error booking slot" });
  }
});

module.exports = router;
