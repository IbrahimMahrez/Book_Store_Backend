const express = require('express');
const router = express.Router();
const asyncWrapper = require('../middlewares/asyncwrapper');
const Author = require('../models/authors');
const { validateAuthor, validateupdateAuthor } = require('../utils/validation');
const { verifyTokenAndAdmin } = require('../middlewares/verifytoken'); // import middleware to verify JWT token for admin access


// GET all authors
router.get(
  '/',
  asyncWrapper(async (req, res) => {
    const authors = await Author.find();
    res.status(200).json(authors);
  })
);


// GET author by ID
router.get(
  '/:id',
  asyncWrapper(async (req, res) => {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(author);
  })
);


// POST create new author
router.post(
  '/',
  verifyTokenAndAdmin,
  asyncWrapper(async (req, res) => {
    const { error } = validateAuthor(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const author = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age
    });

    const result = await author.save();
    res.status(201).json(result);
  })
);


// PUT update author
router.put(
  '/:id',
  verifyTokenAndAdmin,
  asyncWrapper(async (req, res) => {
    const { error } = validateupdateAuthor(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const author = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // الأفضل true عشان يرجع بعد التحديث
    );

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(author);
  })
);


// DELETE author
router.delete(
  '/:id',
  asyncWrapper(async (req, res) => {
    const author = await Author.findByIdAndDelete(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json({
      message: 'Author deleted successfully',
      author
    });
  })
);

module.exports = router;