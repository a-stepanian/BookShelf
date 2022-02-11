const mongoose = require('mongoose');
const Club = require('../models/clubModel');
const Book = require('../models/bookModel');
const Review = require('../models/reviewModel');
const axios = require('axios');

mongoose.connect('mongodb://localhost:27017/book-club')
.then(() => {
    console.log('Connected to DB')
}).catch(err => {
    console.log('DB CONNECTION ERROR', err)
});

//club names
const clubNames = [
    'The Shire',
    'Mystery Machine',
    'Old School'
]

//20 reviews
const reviewArray = [
    {
        'rating' : 5,
        'comments' : 'Amazing!!!' 
    },
    {
        'rating' : 4,
        'comments' : 'Really enjoyed the book.  I will definitely read more from this author.'
    },
    {
        'rating' : 4,
        'comments' : 'WOW!  Where do I begin!?  It was a fantastic read, the only thing keeping it from being a 5 star novel was that it was too short!!!' 
    },
    {
        'rating' : 5,
        'comments' : 'This just might be the single best book I have ever read.' 
    },
    {
        'rating' : 5,
        'comments' : "Excellent plot, dynamic characters, engaging read... what's not to love!?" 
    },
    {
        'rating' : 3,
        'comments' : 'not my cup of tea' 
    },
    {
        'rating' : 5,
        'comments' : "Stop reading this comment and read this book!" 
    },
    {
        'rating' : 5,
        'comments' : 'Flawless book.  Will be buying copies for all of my friends and family members.' 
    },
    {
        'rating' : 4,
        'comments' : 'I really liked this book.' 
    },
    {
        'rating' : 4,
        'comments' : 'Solid read.  I highly recommend it!' 
    },
    {
        'rating' : 4,
        'comments' : 'Really enjoyed the book.  I will definitely read more from this author.'
    },
    {
        'rating' : 4,
        'comments' : 'WOW!  Where do I begin!?  It was a fantastic read, the only thing keeping it from being a 5 star novel was that it was too short!!!' 
    },
    {
        'rating' : 3,
        'comments' : 'I just thought it was average.' 
    },
    {
        'rating' : 2,
        'comments' : 'not my cup of tea' 
    },
    {
        'rating' : 5,
        'comments' : 'This just might be the single best book I have ever read.' 
    },
    {
        'rating' : 5,
        'comments' : "Excellent plot, dynamic characters, engaging read... what's not to love!?" 
    },
    {
        'rating' : 3,
        'comments' : 'it was pretty good' 
    },
    {
        'rating' : 2,
        'comments' : "While I can see why many people like this book, it just wasn't for me.  Might give it another chance in the future."
    },
    {
        'rating' : 3,
        'comments' : 'meh' 
    },
    {
        'rating' : 3,
        'comments' : 'just...ok' 
    }
]

const modernBooks = [
    'The Curious Incident Of The Dog In The Night-Time',
    'Ready Player One',
    'Anxious People',
    'World War Z',
    'Devil in the White City'
]

//Seed Author
const seedAuthor = '6205a9c5f33d237129fa70ce';

const seedDB = async () => {
    // //clear clubs/books/reviews
    // await Club.deleteMany({});
    // await Book.deleteMany({});
    // await Review.deleteMany({});
    // console.log('deleted all the stuff')

    //create 20 reviews
    for (let i = 0; i < 20; i++) {
        const review = new Review({
            rating: reviewArray[i].rating,
            comments: reviewArray[i].comments,
            seedTag: 'modern'
        })
        await review.save()
    }
    console.log('created 20 reviews')

    //create 5 books
    for (let i = 0; i < 5; i++) {
        const bookTitle = modernBooks[i];
        const response = await axios.get(`http://openlibrary.org/search.json?q=${bookTitle}`);
        let author = '';
        let title = '';
        let coverImageCode = 8406786;
        let reviews = [];
        seedTag = 'modern'
        if (response.data.docs[0].author_name) { author = response.data.docs[0].author_name[0] }
        if (response.data.docs[0].title) { title = response.data.docs[0].title }
        if (response.data.docs[0].cover_i) { coverImageCode = response.data.docs[0].cover_i }        
        let imageUrlM = `https://covers.openlibrary.org/b/id/${coverImageCode}-M.jpg`;
        let imageUrlL = `https://covers.openlibrary.org/b/id/${coverImageCode}-L.jpg`;

        const book = new Book({
            title,
            seedTag,
            author,
            imageUrlM,
            imageUrlL,
            reviews
        });
        await book.save()
    }
    console.log('created 5 books')

     //push 4 reviews into each of the 5 book reviews arrays
     const books = await Book.find({seedTag: 'modern'});
     const reviews = await Review.find({seedTag: 'modern'});
     let counter = 0
     for (let i = 0; i < 5; i++) {
         for (let j = 0; j < 4; j++) {
             books[i].reviews.push(reviews[counter]);
             counter++;
         }
         await books[i].save();
     }
     console.log("pushed 4 unique reviews into each of the 5 books' reviews arrays")
 
     //create 1 club
     const club = new Club({
         clubName: 'BookWorms',
         clubImgUrl: 'https://images.unsplash.com/photo-1544716278-e513176f20b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
         author: seedAuthor,
         clubMembers: [],
         clubBooks: []
     });
     await club.save();
     console.log('made 1 club')
 
 
     //push 9 books into club books array  
     for (let i = 0; i < 9; i++) {
         club.clubBooks.push(books[i]);
     }
     await club.save();
     console.log('pushed 9 books into the club books array')
 
 
     console.log('************************************')
     console.log('***BOOKWORM CLUB SEEDING COMPLETE***')
     console.log('************************************')
 }
 
 seedDB();