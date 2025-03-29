const express = require('express')
const router = express.Router()    
const { check, validationResult } = require('express-validator');  
const bcrypt = require('bcryptjs')
const User = require("../models/User");  

router.post('/signup',
    [   
        check('name', 'Name must be at least 4 characters').isLength({ min: 4 }),
        check('email', 'Please enter a valid email').isEmail(),
        check('contactNumber', 'Contact number is required').not().isEmpty(),
        check('selectedClass', 'Class is required').not().isEmpty(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array() 
            });
        }

        try {
          
            const { name, email, contactNumber, selectedClass, password } = req.body;

            
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Email is already registered' 
                });
            }

            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

          
            const newUser = await User.create({
                name,
                email,
                contactNumber,
                selectedClass,
                password: hashedPassword,
            });

            res.json({
                success: true,
                user: newUser
            });
        } 
        catch (err) {
            console.error(err.message);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    });

module.exports = router;