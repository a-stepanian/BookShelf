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
const session = require('express-session');
const flash = require('connect-flash');

const app = express();



//----- Connect to Database --------------------------------------------//
mongoose.connect('mongodb://localhost:27017/book-club')
    .then(() => {
        console.log('Connected to DB')
    }).catch(err => {
        console.log('DB CONNECTION ERROR', err)
    });

    
//----- For including partials -----------------------------------------//
app.engine('ejs', ejsMate);


//----- For using ejs templating from the views directory --------------//
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//----- For serving static files from public directory -----------------//
app.use(express.static('public'));
app.set('public', path.join(__dirname, '/public'));


//----- Needed to access request body ----------------------------------//
app.use(express.urlencoded({ extended: true }));


//----- For PUT/DELETE requests ----------------------------------------//
app.use(methodOverride('_method'));


//----- Set up session (for flash/auth----------------------------------//
const sessionConfig = {
    secret: 'thisisahorriblesecretandneedstobebetter!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
};
app.use(session(sessionConfig));


//----- Set up flash ---------------------------------------------------//
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    next();
});


//----- Connect to routes ----------------------------------------------//
app.use('/books', bookRoutes);
app.use('/books/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.render('home');
});

//----- Generic 404 error ----------------------------------------------//
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


//----- Generic catch-all for other errors -----------------------------//
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


//----- Serve App ------------------------------------------------------//
app.listen(3000, () => {
    console.log('Serving app on localhost:3000');
});