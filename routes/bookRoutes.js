//Must user mergParams with express router to pull in the club id!!!!

const express= require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Book = require('../models/bookModel');
const Club = require('../models/clubModel');
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

// No books index page anymore

// router.get('/', catchAsync(async (req, res) => {
//     const books = await Book.find();
//     res.render('books/index', { books, message: req.flash('success') });
// }));

// Club Book New
router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const club = await Club.findById(id);
    res.render('books/new', { club });
}));

// router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
//     const books = await Book.find();
//     res.render('books/new', { books });
// }));

// Club Book New POST
router.post('/', isLoggedIn, validateBook, catchAsync(async (req, res) => {
    const foundClub = await Club.findById(req.params.id);
    let { title } = req.body;
    const response = await axios.get(`http://openlibrary.org/search.json?q=${title}`);
    //initialize variables with default values;
    let author = "404";
    let club = foundClub._id;
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
    if (response.data.docs[0].cover_i) {
        coverImageCode = response.data.docs[0].cover_i
    } else {
        coverImageCode = response.data.docs[1].cover_i;
    }
    //utilize the cover_i code to create image urls
    const imageUrlM = `https://covers.openlibrary.org/b/id/${coverImageCode}-M.jpg`;
    const imageUrlL = `https://covers.openlibrary.org/b/id/${coverImageCode}-L.jpg`;
    const book = new Book({title, author, imageUrlM, imageUrlL});
    foundClub.clubBooks.push(book);
    await book.save();
    await foundClub.save();
    res.redirect(`/clubs/${club._id}/books/${book._id}`);
}));

// router.post('/', isLoggedIn, validateBook, catchAsync(async (req, res) => {
//     let { title, format } = req.body;
//     const response = await axios.get(`http://openlibrary.org/search.json?q=${title}`);
//     //initialize variables with default values;
//     let author = "404";
//     let pageCount = 404;
//     let firstSentence = [];
//     let coverImageCode = 8406786;
//     //try to find data in the JSON response, look at first two books in the response and then resort to the default.
//     if (response.data.docs[0].author_name) {
//         author = response.data.docs[0].author_name[0]
//     } else {
//         author = response.data.docs[1].author_name[0]
//     }

//     if (response.data.docs[0].title) {
//         title = response.data.docs[0].title
//     } else {
//         title = response.data.docs[1].title
//     }

//     if (response.data.docs[0].number_of_pages_median) {
//         pageCount = response.data.docs[0].number_of_pages_median;
//     } else {
//         pageCount = response.data.docs[1].number_of_pages_median;
//     }

//     if (response.data.docs[0].first_sentence) {
//         firstSentence = response.data.docs[0].first_sentence;
//     } else {
//         firstSentence = [];
//     }

//     if (response.data.docs[0].cover_i) {
//         coverImageCode = response.data.docs[0].cover_i
//     } else {
//         coverImageCode = response.data.docs[1].cover_i;
//     }
//     //utilize the cover_i code to create image urls
//     const imageUrlM = `https://covers.openlibrary.org/b/id/${coverImageCode}-M.jpg`;
//     const imageUrlL = `https://covers.openlibrary.org/b/id/${coverImageCode}-L.jpg`;
//     const book = new Book({title, author, imageUrlM, imageUrlL});
//     await book.save();
//     req.flash('success', `Added ${book.title}`);
//     res.redirect(`/books/${book._id}`);
// }));

// Club Book Show
router.get('/:bookId', catchAsync(async (req, res) => {
    const { id, bookId } = req.params;
    const club = await Club.findById(id).populate('clubBooks');
    const book = await Book.findById(bookId).populate('reviews');
    let sum = 0;
    for (let i = 0; i < book.reviews.length; i++) {
        sum += book.reviews[i].rating;
    }
    let average = (sum / book.reviews.length).toFixed(1);
    console.log(average)
    res.render('books/show', { club, book, average });
}));

// router.get('/:id', catchAsync(async (req, res) => {
//     const book = await Book.findById(req.params.id).populate('reviews');
//     const books = await Book.find();
//     res.render('books/show', { book, books, message: req.flash('success') });
// }));

// Club Book Edit
router.get('/:bookId/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id, bookId } = req.params;
    const club = await Club.findById(id).populate('clubBooks');
    const book = await Book.findById(bookId);
    res.render('books/edit', { club, book });
}));

// router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
//     const book = await Book.findById(req.params.id);
//     const books = await Book.find();
//     res.render('books/edit', { book, books });
// }));

// Club Book Edit PUT
router.put('/:bookId', isLoggedIn, validateBook, catchAsync(async (req, res) => {
    const { id, bookId } = req.params;
    await Book.findByIdAndUpdate(bookId, req.body);
    res.redirect(`/clubs/${id}/books/${bookId}`);
}));

// router.put('/:id', isLoggedIn, validateBook, catchAsync(async (req, res) => {
//     await Book.findByIdAndUpdate(req.params.id, req.body, { new: true } )  //the initial project had {...req.body} passed in to updated, don't seem to need.
//         .then(book => req.flash('success', `Updated ${book.title}`))
//     res.redirect(`/books/${req.params.id}`);
// }));

// Club Book DELETE
router.delete('/:bookId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, bookId } = req.params
    await Book.findByIdAndDelete(bookId);
    res.redirect(`/clubs/${id}`);
}));

// router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
//     await Book.findByIdAndDelete(req.params.id)
//         .then(deleted => req.flash('success', `Deleted ${deleted.title}`));
//     res.redirect('/books');
// }));


module.exports = router;
