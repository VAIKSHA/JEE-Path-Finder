const express = require("express");
const app = express()    
const port = 4000
const mongoDB = require("./db")
const cors = require("cors");   

mongoDB();

app.get('/', (req, res) => {
    res.send('Server is running!');
});

// cors a specific origin at --> localhost:3000 with all methods
const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
}

// middleware with options --> GET, POST, PUT, DELETE, PATCH, HEAD
app.use(cors(corsOptions));

// middleware for coming json data in req body
app.use(express.json())

app.use('/api', require("./routes/CreateUser"))  // request to api performed by CreateUser
app.use('/api', require("./routes/LoginUser"))   // request to api performed by LoginUser 

// middleware to handle errors
app.use((err, req, res, next)=>{
    console.error(err);
    res.status(500).json({
        success: false, 
        error: "Internal server error!" 
    });
    
    next();
})

// Express server starting & listen on PORT = 4000
app.listen(port, ()=>{
    console.log(`App listening on port ${port}`)
})
