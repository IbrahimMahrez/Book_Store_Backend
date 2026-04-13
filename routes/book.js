const express = require('express');

const router = express.Router();
const joi = require('joi'); // import joi for validation
const validator = require('validator'); // import validator for additional validation

const Book = require('../models/book'); // import book data
const { validateBook } = require('../utils/validation'); // import validation function
const { validateupdatebook } = require('../utils/validation'); // import validation function for update

const asyncWrapper = require('../middlewares/asyncwrapper');


router.get('/', asyncWrapper(async (req, res) => {
    const books = await Book.find();
    res.status(200).json(books);
}));

router.get('/:id', asyncWrapper(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
}));

router.post('/', asyncWrapper(async (req, res) => {
    const { error } = validateBook(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const book = new Book({
        title: req.body.title,
        author: req.body.author
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);
}));

router.put('/:id', asyncWrapper(async (req, res) => {
    const { error } = validateupdatebook(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
}));

router.delete('/:id', asyncWrapper(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message: 'Book deleted successfully',
        book: book
    });
}));

module.exports = router;