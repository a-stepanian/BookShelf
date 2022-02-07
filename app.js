const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
// for including partials
const ejsMate = require('ejs-mate');
//for throwing Express Errors into an error template
const ExpressError = require('./utils/ExpressError');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes')
const app = express();

// Connect to DB
mongoose.connect('mongodb://localhost:27017/book-club')
    .then(() => {
        console.log('Connected to DB')
    }).catch(err => {
        console.log('DB CONNECTION ERROR', err)
    });

//For including partials
app.engine('ejs', ejsMate);
//For using ejs templating from the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//For serving static files from public direcctory
app.use(express.static('public'));
app.set('public', path.join(__dirname, '/public'));
app.use(express.urlencoded({ extended: true })); //needed to get req.body
app.use(methodOverride('_method'));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.use('/books', bookRoutes);          //added in to connect to routes

app.use('/books/:id/reviews', reviewRoutes);          //added in to connect to routes


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