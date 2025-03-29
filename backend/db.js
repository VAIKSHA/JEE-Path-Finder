const mongoose = require("mongoose");
const mongoURI = 'mongodb://localhost:27017/jpf';  
// MongoDB connection URI & 27017 is default port number for MongoDB

const mongoDB = async () => {
    try {
        // connect to MongoDB with URI
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected Successfully!");  
    }
    catch (err) {
        console.error(`Unable to connect to the server: ${err.message}`)
    }
}

module.exports = mongoDB;