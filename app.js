const express = require('express');                     // Express is the framework of this application
const mongoose = require('mongoose');                   // Mongoose is for interfacing with mongodb via express / javascript
const path = require('path');                           // for setting up directory default paths
const methodOverride = require('method-override');      // for making PUT/DELETE requests via POST request
const ejsMate = require('ejs-mate');                    // for including partials
const ExpressError = require('./utils/ExpressError');   // for throwing Express Errors into an error template

const userRoutes = require('./routes/userRoutes')
const bookRoutes = require('./routes/bookRoutes');      
const reviewRoutes = require('./routes/reviewRoutes')

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/userModel');
const Club = require('./models/clubModel');
const axios = require('axios');
const Book = require('./models/bookModel');

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


//----- Set up ejs templating from the views directory -----------------//
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//----- For serving static files from public directory -----------------//
app.use(express.static('public'));
app.set('public', path.join(__dirname, '/public'));


//----- Needed to access request body ----------------------------------//
app.use(express.urlencoded({ extended: true }));


//----- For PUT/DELETE requests ----------------------------------------//
app.use(methodOverride('_method'));


//----- Set up session (for flash/auth) --------------------------------//
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


//----- Set up passport ------------------------------------------------//
app.use(passport.initialize());     //from passport docs
app.use(passport.session());        //from passport docs
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//----- Session middleware (for flash and auth) ------------------------//
app.use((req, res, next) => {
    if (!['/login', '/register', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


//----- Routes --------------------------------------------------------//
app.use('/', userRoutes);
app.use('/books', bookRoutes);
app.use('/books/:id/reviews', reviewRoutes);

app.get('/clubs', async (req, res) => {
    const clubs = await Club.find().populate('clubBooks');
    res.render('clubs/index', { clubs });
});

app.get('/clubs/new', (req, res) => {
    res.render('clubs/new');
});

app.post('/clubs', async (req, res) => {
    const { clubName } = req.body;
    const clubMembers = [];
    const clubBooks = [];
    const club = await new Club({ clubName, clubMembers, clubBooks });
    await club.save();
    res.redirect('/clubs');
});

app.get('/clubs/:id', async (req, res) => {
    const club = await Club.findById(req.params.id).populate('clubBooks');
    res.render('clubs/show', { club });
});

app.get('/clubs/:id/books/new', async (req, res) => {
    const club = await Club.findById(req.params.id);
    res.render('books/newClubBook', { club });
});

app.post('/clubs/:id/books', async (req, res) => {
    const foundClub = await Club.findById(req.params.id);
    let { title, format, dateFinished } = req.body;
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
    const book = new Book({title, author, format, dateFinished, imageUrlM, imageUrlL, club});
    foundClub.clubBooks.push(book);
    await book.save();
    await foundClub.save();
    req.flash('success', `Added ${book.title} to ${foundClub.clubName}`);
    res.redirect(`/clubs/${club._id}`);
});


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