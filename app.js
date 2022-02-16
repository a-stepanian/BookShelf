if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');                     // Express is the framework of this application
const mongoose = require('mongoose');                   // Mongoose is for interfacing with mongodb via express / javascript
const path = require('path');                           // for setting up directory default paths
const methodOverride = require('method-override');      // for making PUT/DELETE requests via POST request
const ejsMate = require('ejs-mate');                    // for including partials
const ExpressError = require('./utils/ExpressError');   // for throwing Express Errors into an error template
const clubRoutes = require('./routes/clubRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');      
const reviewRoutes = require('./routes/reviewRoutes');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/userModel');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');




const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/book-club';



//----- Connect to Database -------------------------------------------//
mongoose.connect(dbUrl)
    .then(() => {
        console.log('Connected to DB')
    }).catch(err => {
        console.log('DB CONNECTION ERROR', err)
    });


const app = express();

    
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


//----- Prepare for production -----------------------------------------//
app.use(mongoSanitize({
    replaceWith: '_'
}))


const secret = process.env.SECRET || 'thisisahorriblesecretandneedstobebetter!'


//----- Set up mongo store for production ------------------------------//
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on('error', function(e){
    console.log('SESSION STORE ERROR', e)
})

//----- Set up session (for flash/auth) --------------------------------//
const sessionConfig = {
    store,
    name: 'thisIsSessionName',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,       // USE FOR PRODUCTION, COMMENT OUT FOR DEVELOPMENT
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
};
app.use(session(sessionConfig));


//----- Set up flash ---------------------------------------------------//
app.use(flash());


//----- Prepare for production 2 ---------------------------------------//
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'"],
            scriptSrc: ["'unsafe-inline'", "'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com/"],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://covers.openlibrary.org/b/id/",
                "https://images.unsplash.com/"
            ],
            fontSrc: ["'self'", "https://fonts.gstatic.com/" ]
        }
    })
);



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
app.use('/clubs', clubRoutes);
app.use('/clubs/:id/books', bookRoutes);
app.use('/clubs/:id/books/:bookId/reviews', reviewRoutes);


// Homepage
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