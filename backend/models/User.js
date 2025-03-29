const mongoose = require("mongoose");

const { Schema } = mongoose;

// defining Schema
const UserSchema = new Schema({
    name: {
        type: String,       
        required: true, 
        trim: true          
    },
    email: {
        type: String,       
        required: true,     
        unique: true,       
        trim: true          
    },
    contactNumber: {
        type: String,       
        required: true,     
        trim: true          
    },
    selectedClass: {
        type: String,       
        required: true,     
        trim: true          
    },
    password: {
        type: String,       
        required: true,     
        trim: true,         
        minlength: 6        
    },
    date: {
        type: Date,         
        default: Date.now   
    }
});

module.exports = mongoose.model('user', UserSchema);