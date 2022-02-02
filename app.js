const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Book = require('./models/book');
// for including partials
const ejsMate = require('ejs-mate');
// for fetching / parsing API JSON response
const axios = require('axios');
//for async errors
const catchAsync = require('./utils/catchAsync');
//for throwing Express Errors into an error template
const ExpressError = require('./utils/ExpressError');
// for Joi validation
const { bookSchema } = require('./schemas.js')

// Connect to DB
mongoose.connect('mongodb://localhost:27017/book-club')
    .then(() => {
        console.log('Connected to DB')
    }).catch(err => {
        console.log('DB CONNECTION ERROR', err)
    });

// Joi Schema Validation middleware function
const validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const app = express();
//For including partials
app.engine('ejs', ejsMate);
//For using ejs templating from the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//For serving static files from public direcctory
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })); //needed to get req.body
app.use(methodOverride('_method'));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/books', catchAsync(async (req, res) => {
    const books = await Book.find();
    res.render('books/index', { books });
}));

app.get('/books/new', catchAsync(async (req, res) => {
    const books = await Book.find();
    res.render('books/new', { books });
}));

app.post('/books', validateBook, catchAsync(async (req, res) => {
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
    res.redirect(`/books/${book._id}`);
}));

app.get('/books/:id', catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id)
    const books = await Book.find();
    res.render('books/show', { book, books });
}));

app.get('/books/:id/edit', catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    const books = await Book.find();
    res.render('books/edit', { book, books });
}));

app.put('/books/:id', validateBook, catchAsync(async (req, res) => {
    await Book.findByIdAndUpdate(req.params.id, req.body);  //the initial project had {...req.body} passed in to updated, don't seem to need.
    res.redirect(`/books/${req.params.id}`);
}));

app.delete('/books/:id', catchAsync(async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books');
}));

// generic 404 error if you try to get req /sjdhskdfh
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// generic catch-all for other errors
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

// Serve App
app.listen(3000, () => {
    console.log('Serving app on localhost:3000');
});