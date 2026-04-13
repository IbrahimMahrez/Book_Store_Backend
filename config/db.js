 const mongoose=require('mongoose');//import mongoose for database connection
 const dotenv=require('dotenv');//import dotenv for environment variable management
 dotenv.config();//load environment variables from .env file


 async function  connectDB(){

 try {
   await  mongoose.connect( process.env.MONGO_URI ) // connect to MongoDB database named bookstore promise-based connection
 console.log('Connected to MongoDB...')
 } catch (err) {
    console.error('could not connect to mongo db ',err)
 }



}


module.exports=connectDB;//export connectDB function to be used in server.js for database connection