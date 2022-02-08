const express= require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Book = require('../models/bookModel');
const { bookSchema } = require('../schemaValidations');
const axios = require('axios');
const { isLoggedIn } = require('../middleware.js')


const validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const books = await Book.find();
    res.render('books/index', { books, message: req.flash('success') });
}));

router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    const books = await Book.find();
    res.render('books/new', { books });
}));

router.post('/', isLoggedIn, validateBook, catchAsync(async (req, res) => {
    let { title, dateStarted, dateFinished } = req.body;
    const response = await axios.get(`http://openlibrary.org/search.json?q=${title}`);
    //initialize variables with default values;
    let author = "404";
    let pageCount = 404;
    let firstSentence = [];
    let coverImageCode = 8406786;
    //try to find data in the JSON response, look at first two books in the response and then resort to the default.
    if (response.data.docs[0].author_name) {
        author = response.data.docs[0].author_name[0]
    } else {
        author = response.data.docs[1].author_name[0]
    }

    if (response.data.docs[0].title) {
        title = response.data.docs[0].title
    } else {
        title = response.data.docs[1].title
    }

    if (response.data.docs[0].number_of_pages_median) {
        pageCount = response.data.docs[0].number_of_pages_median;
    } else {
        pageCount = response.data.docs[1].number_of_pages_median;
    }

    if (response.data.docs[0].first_sentence) {
        firstSentence = response.data.docs[0].first_sentence;
    } else {
        firstSentence = [];
    }

    if (response.data.docs[0].cover_i) {
        coverImageCode = response.data.docs[0].cover_i
    } else {
        coverImageCode = response.data.docs[1].cover_i;
    }
    //utilize the cover_i code to create image urls
    const imageUrlM = `https://covers.openlibrary.org/b/id/${coverImageCode}-M.jpg`;
    const imageUrlL = `https://covers.openlibrary.org/b/id/${coverImageCode}-L.jpg`;
    const book = new Book({title, author, pageCount, dateStarted, dateFinished, firstSentence, imageUrlM, imageUrlL});
    await book.save();
    req.flash('success', `Added ${book.title}`);
    res.redirect(`/books/${book._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id).populate('reviews');
    const books = await Book.find();
    res.render('books/show', { book, books, message: req.flash('success') });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    const books = await Book.find();
    res.render('books/edit', { book, books });
}));

router.put('/:id', isLoggedIn, validateBook, catchAsync(async (req, res) => {
    await Book.findByIdAndUpdate(req.params.id, req.body, { new: true } )  //the initial project had {...req.body} passed in to updated, don't seem to need.
        .then(book => req.flash('success', `Updated ${book.title}`))
    res.redirect(`/books/${req.params.id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    await Book.findByIdAndDelete(req.params.id)
        .then(deleted => req.flash('success', `Deleted ${deleted.title}`));
    res.redirect('/books');
}));

module.exports = router;
