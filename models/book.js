const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    }, 
      author:{
        type:String,
        required:true,
        minlength:3
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;