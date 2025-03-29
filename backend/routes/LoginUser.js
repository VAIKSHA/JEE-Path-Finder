const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();      
const jwt = require("jsonwebtoken")
const jwtSecret = "MyNameIsVishalKumarSharmaIamAYoutuber"
const User = require('../models/User');

// POST route for user login
router.post('/loginuser', async (req, res) => {
    const { emailOrContact, password } = req.body;

    try {
        
        if (!emailOrContact || !password) {
            return res.status(400).json({ success: false, error: "Email or contact number and password are required!" });
        }

        // if user exists
        const userData = await User.findOne({ 
            $or: [{ email: emailOrContact }, { contactNumber: emailOrContact }] 
        });
        if (!userData) {
            return res.status(400).json({
                success: false,
                error: "Email or contact number not registered!"
            });
        }


        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                error: "Incorrect Password!"
            });
        }

        // data for jwt payload
        const data = {
            user: {
                id: userData.id
            }
        }

        // generating jwt
        const authToken = jwt.sign(data, jwtSecret)

        return res.json({
            success: true,
            message: "Login successfully!",
            authToken: authToken
        })
    }

    catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            error: "Internal server error!"
        })
    }
});

module.exports = router;