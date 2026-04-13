
//const bookRoutes=require('../routes/book');//import book routes
//const authorRoutes=require('../routes/autor');//import author routes
//const authRoutes=require('../routes/auth');//import auth routes
//const userRoutes=require('../routes/users');//import user routes
const express=require('express');//import express for server setup
const mongoose=require('mongoose');//import mongoose for database connection
const connectDB=require('../config/db');//import database connection function

// Load environment variables from .env file
require('dotenv').config();//import dotenv for environment variable management
//load environment variables from .env file

// Connect to MongoDB database
    connectDB();



const app=express();//initialize express application


app.use(express.json());//use middleware to parse JSON bodies

// Use routes
app.use('/books',require('../routes/book'));//import book routes;//use book routes with prefix /api
app.use('/authors',require('../routes/autor'));//import author routes;//use author routes with prefix /api
app.use('/auth', require('../routes/auth')); // use auth routes with prefix /api/auth
app.use('/users', require('../routes/users')); // use user routes with prefix /api/users






// Global error handling middleware

app.use((error, req, res, next) => {
    console.log("Global Error Handler:", error);

    res.status(500).json({
        message: error.message || "Internal Server Error"
    });
});

// Start the server
app.listen(process.env.PORT || 3000,()=>{
    console.log('Server is running on port ' + (process.env.PORT || 3000) + ' http://localhost:' + (process.env.NODE_ENV || 'development') + (process.env.PORT || 3000));
});
