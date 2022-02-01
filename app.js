const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Book = require('./models/book');
const ejsMate = require('ejs-mate');

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
    console.log(books)
    res.render('books/index', { books });
});
app.get('/books/new', (req, res) => {
    res.render('books/new');
});
app.post('/books', async (req, res) => {
    const book = new Book(req.body);
    await book.save();
    res.redirect('/books');
});
app.get('/books/:id', async (req, res) => {
    const book = await Book.findById(req.params.id)
    console.log(book)
    console.log(book.dateStarted)
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