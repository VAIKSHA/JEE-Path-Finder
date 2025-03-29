const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const mongoDB = require("./db");
const Slot = require("./models/Slot");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = 4000;

// Connect to MongoDB
mongoDB();

// CORS Configuration (Allow frontend at `http://localhost:3000`)
const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Import user-related routes
app.use('/api', require("./routes/CreateUser"));
app.use('/api', require("./routes/LoginUser"));
app.use('/api', require("./routes/Slotbook"));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or App Password
    },
});

// ✅ Slot Booking Route
app.post('/api/book-slot', async (req, res) => {
    try {
        const { name, email, contact, date, hours, timeSlot } = req.body;

        if (!name || !email || !contact || !date || !hours || !timeSlot) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Save slot to MongoDB
        const newSlot = new Slot({ name, email, contact, date, hours, timeSlot });
        await newSlot.save();

        // Send confirmation email to user
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Slot Booking Confirmation',
            text: `Hello ${name},\n\nYour slot has been booked successfully!\n\nDate: ${date}\nTime: ${timeSlot}\nDuration: ${hours} hour(s)\n\nThank you!`,
        });

        // Send notification to admin
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Slot Booking',
            text: `New slot booked:\n\nName: ${name}\nEmail: ${email}\nContact: ${contact}\nDate: ${date}\nTime: ${timeSlot}\nDuration: ${hours} hour(s)`,
        });

        res.status(200).json({ message: 'Slot booked successfully and email sent!' });
    } catch (error) {
        console.error("Error booking slot:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        error: "Internal server error!",
    });
});

// Start Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
