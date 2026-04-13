
const mongoose=require('mongoose');//import mongoose for database connection

const authorSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:3
    },
    lastName:{
        type:String,
        required:true,
        minlength:3
    },
    age:{
        type:Number,
        required:true,
        min:0
    }

});//define author schema

const Author=mongoose.model('Author',authorSchema);//create author model

module.exports=Author;//export author model