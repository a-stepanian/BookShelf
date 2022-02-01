const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Book = require('./models/book');
const ejsMate = require('ejs-mate');
const axios = require('axios');

// Connect to DB
mongoose.connect('mongodb://localhost:27017/book-club')
    .then(() => {
        console.log('Connected to DB')
    }).catch(err => {
        console.log('DB CONNECTION ERROR', err)
    });
//

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })); //needed to get req.body
app.use(methodOverride('_method'));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/books', async (req, res) => {
    const books = await Book.find();
    res.render('books/index', { books });
});
app.get('/books/new', async (req, res) => {
    const books = await Book.find();
    res.render('books/new', { books });
});
app.post('/books', async (req, res) => {
    const { bookTitle, dateStarted, dateFinished } = req.body;
    const response = await axios.get(`http://openlibrary.org/search.json?q=${bookTitle}`);
    let author = "404";
    let title = "404";
    let pageCount = 404;
    let firstSentence = [];
    let coverImageCode = 8406786;

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
    const imageUrlM = `https://covers.openlibrary.org/b/id/${coverImageCode}-M.jpg`;
    const imageUrlL = `https://covers.openlibrary.org/b/id/${coverImageCode}-L.jpg`;
    const book = new Book({title, author, pageCount, dateStarted, dateFinished, firstSentence, imageUrlM, imageUrlL});
    await book.save();
    res.redirect('/books');
});
app.get('/books/:id', async (req, res) => {
    const book = await Book.findById(req.params.id)
    res.render('books/show', { book });
});
app.get('/books/:id/edit', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render('books/edit', { book });
});
app.put('/books/:id', async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body);  //the initial project had {...req.body} passed in to updated, don't seem to need.
    res.redirect(`/books/${req.params.id}`);
});
app.delete('/books/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books');
});


// Serve App
app.listen(3000, () => {
    console.log('Serving app on localhost:3000');
});