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

//Seed Authors
const seedAuthor = '620d742fab180b5b2a2e2d58'; //club author
const reviewAuthors = [
    '620d7408ab180b5b2a2e2d4a',
    '620d7423ab180b5b2a2e2d51',
    '620d743bab180b5b2a2e2d5f',
    '620d744bab180b5b2a2e2d66',
    '620d747aab180b5b2a2e2d6d',
    '620d749aab180b5b2a2e2d74'
];

//100 reviews
const reviewArray = [
    {
        'rating' : 4,
        'comments' : 'Really enjoyed the book.  I will definitely read more from this author.',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 5,
        'comments' : 'Amazing!!!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 4,
        'comments' : 'it was pretty good',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 3,
        'comments' : "While I can see why many people like this book, it just wasn't for me.  Might give it another chance in the future.",
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 5,
        'comments' : 'This just might be the single best book I have ever read.',
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 5,
        'comments' : "Excellent plot, dynamic characters, engaging read... what's not to love!?",
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 4,
        'comments' : 'Really enjoyed the book.  I will definitely read more from this author.',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 5,
        'comments' : 'Amazing!!!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 4,
        'comments' : 'it was pretty good',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 3,
        'comments' : "While I can see why many people like this book, it just wasn't for me.  Might give it another chance in the future.",
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 5,
        'comments' : 'This just might be the single best book I have ever read.',
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 5,
        'comments' : "Excellent plot, dynamic characters, engaging read... what's not to love!?",
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 5,
        'comments' : "Stop reading this comment and read this book!",
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 5,
        'comments' : 'Flawless book.  Will be buying copies for all of my friends and family members.',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 4,
        'comments' : 'I really liked this book.',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 3,
        'comments' : 'not my cup of tea',
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 2,
        'comments' : "After trying to get into this series for years, I just can't seem to get through this book.  Too slow!",
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 4,
        'comments' : 'I liked this book.',
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 5,
        'comments' : 'Amazing!!!',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 4,
        'comments' : 'Solid read.  I highly recommend it!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 4,
        'comments' : 'Really enjoyed the book.  I will definitely read more from this author.',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 4,
        'comments' : 'WOW!  Where do I begin!?  It was a fantastic read, the only thing keeping it from being a 5 star novel was that it was too short!!!',
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 3,
        'comments' : 'I just thought it was average.',
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 3,
        'comments' : 'not my cup of tea',
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 4,
        'comments' : 'I liked this book.',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 4,
        'comments' : 'Got this book as a gift.  Excellent read, will check out more from this author!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 3,
        'comments' : 'it was pretty good',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 5,
        'comments' : "Stop reading this comment and read this book!",
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 5,
        'comments' : 'Flawless book.  Will be buying copies for all of my friends and family members.',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 4,
        'comments' : 'I really liked this book.',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 3,
        'comments' : 'not my cup of tea',
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 2,
        'comments' : "After trying to get into this series for years, I just can't seem to get through this book.  Too slow!",
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 4,
        'comments' : 'I liked this book.',
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 5,
        'comments' : 'Amazing!!!',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 4,
        'comments' : 'Solid read.  I highly recommend it!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 3,
        'comments' : 'not my cup of tea',
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 4,
        'comments' : 'I liked this book.',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 4,
        'comments' : 'Got this book as a gift.  Excellent read, will check out more from this author!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 3,
        'comments' : 'it was pretty good',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 3,
        'comments' : "While I can see why many people like this book, it just wasn't for me.  Might give it another chance in the future.",
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 4,
        'comments' : 'Really enjoyed the book.  I will definitely read more from this author.',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 4,
        'comments' : 'WOW!  Where do I begin!?  It was a fantastic read, the only thing keeping it from being a 5 star novel was that it was too short!!!',
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 3,
        'comments' : 'I just thought it was average.',
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 3,
        'comments' : 'not my cup of tea',
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 4,
        'comments' : 'I liked this book.',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 4,
        'comments' : 'Got this book as a gift.  Excellent read, will check out more from this author!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 3,
        'comments' : 'it was pretty good',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 3,
        'comments' : "While I can see why many people like this book, it just wasn't for me.  Might give it another chance in the future.",
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 3,
        'comments' : 'meh',
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 3,
        'comments' : 'just...ok',
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 4,
        'comments' : 'Really enjoyed the book.  I will definitely read more from this author.',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 5,
        'comments' : 'Amazing!!!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 4,
        'comments' : 'it was pretty good',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 3,
        'comments' : "While I can see why many people like this book, it just wasn't for me.  Might give it another chance in the future.",
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 5,
        'comments' : 'This just might be the single best book I have ever read.',
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 5,
        'comments' : "Excellent plot, dynamic characters, engaging read... what's not to love!?",
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 4,
        'comments' : 'Really enjoyed the book.  I will definitely read more from this author.',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 5,
        'comments' : 'Amazing!!!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 4,
        'comments' : 'it was pretty good',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 3,
        'comments' : "While I can see why many people like this book, it just wasn't for me.  Might give it another chance in the future.",
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 5,
        'comments' : 'This just might be the single best book I have ever read.',
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 5,
        'comments' : "Excellent plot, dynamic characters, engaging read... what's not to love!?",
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 5,
        'comments' : "Stop reading this comment and read this book!",
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 5,
        'comments' : 'Flawless book.  Will be buying copies for all of my friends and family members.',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 4,
        'comments' : 'I really liked this book.',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 3,
        'comments' : 'not my cup of tea',
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 2,
        'comments' : "After trying to get into this series for years, I just can't seem to get through this book.  Too slow!",
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 4,
        'comments' : 'I liked this book.',
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 5,
        'comments' : 'Amazing!!!',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 4,
        'comments' : 'Solid read.  I highly recommend it!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 4,
        'comments' : 'Really enjoyed the book.  I will definitely read more from this author.',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 4,
        'comments' : 'WOW!  Where do I begin!?  It was a fantastic read, the only thing keeping it from being a 5 star novel was that it was too short!!!',
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 3,
        'comments' : 'I just thought it was average.',
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 3,
        'comments' : 'not my cup of tea',
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 4,
        'comments' : 'I liked this book.',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 4,
        'comments' : 'Got this book as a gift.  Excellent read, will check out more from this author!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 3,
        'comments' : 'it was pretty good',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 5,
        'comments' : "Stop reading this comment and read this book!",
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 5,
        'comments' : 'Flawless book.  Will be buying copies for all of my friends and family members.',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 4,
        'comments' : 'I really liked this book.',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 3,
        'comments' : 'not my cup of tea',
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 2,
        'comments' : "After trying to get into this series for years, I just can't seem to get through this book.  Too slow!",
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 4,
        'comments' : 'I liked this book.',
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 5,
        'comments' : 'Amazing!!!',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 4,
        'comments' : 'Solid read.  I highly recommend it!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 3,
        'comments' : 'not my cup of tea',
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 4,
        'comments' : 'I liked this book.',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 4,
        'comments' : 'Got this book as a gift.  Excellent read, will check out more from this author!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 3,
        'comments' : 'it was pretty good',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 3,
        'comments' : "While I can see why many people like this book, it just wasn't for me.  Might give it another chance in the future.",
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 4,
        'comments' : 'Really enjoyed the book.  I will definitely read more from this author.',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 4,
        'comments' : 'WOW!  Where do I begin!?  It was a fantastic read, the only thing keeping it from being a 5 star novel was that it was too short!!!',
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 3,
        'comments' : 'I just thought it was average.',
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 3,
        'comments' : 'not my cup of tea',
        'author' : reviewAuthors[5]
    },
    {
        'rating' : 4,
        'comments' : 'I liked this book.',
        'author' : reviewAuthors[0]
    },
    {
        'rating' : 4,
        'comments' : 'Got this book as a gift.  Excellent read, will check out more from this author!',
        'author' : reviewAuthors[1]
    },
    {
        'rating' : 3,
        'comments' : 'it was pretty good',
        'author' : reviewAuthors[2]
    },
    {
        'rating' : 3,
        'comments' : "While I can see why many people like this book, it just wasn't for me.  Might give it another chance in the future.",
        'author' : reviewAuthors[3]
    },
    {
        'rating' : 3,
        'comments' : 'meh',
        'author' : reviewAuthors[4]
    },
    {
        'rating' : 3,
        'comments' : 'just...ok',
        'author' : reviewAuthors[5]
    }
]

// fantasy books
const theShireBooks = [
    'The Hobbit',
    'Lord of the Rings',
    'The Two Towers',
    'Return of the King',
    'A Game of Thrones',
    'A Clash of Kings',
    'A Storm of Swords',
    'A Feast for Crows',
    'A Dance With Dragons',
    'The Dragon Reborn',
    'The Shadow Rising',
    'Lord of Chaos',
    'A Crown of Swords',
    'The Path of Daggers',
    'Crossroads of Twilight',
    'The Well of Ascension',
    'The Hero of Ages',
    'Words of Radiance',
    'Oathbringer',
    'Rhythm of War'
]

// classic books
const classicBooks = [
    'The Great Gatsby',
    'Slaughterhouse-Five',
    'Catcher In The Rye',
    'The Man In The Iron Mask',
    'War and Peace'
]


//----- Create shire club seeded with books with reviews ----------------//
const seedShireClub = async () => {
    //create fantasy reviews
    for (let i = 0; i < Math.floor(reviewArray.length / theShireBooks.length) * theShireBooks.length ; i++) {
        const review = new Review({
            rating: reviewArray[i].rating,
            comments: reviewArray[i].comments,
            author: reviewArray[i].author,
            seedTag: 'theShire'
        })
        await review.save()
    }

    //create fantasy books

    for (let i = 0; i < theShireBooks.length; i++) {
        const bookTitle = theShireBooks[i];
        const response = await axios.get(`http://openlibrary.org/search.json?q=${bookTitle}`);
        let author = '';
        let title = '';
        let coverImageCode = 8406786;
        let reviews = [];
        let seedTag = 'theShire'
        if (response.data.docs[0].author_name) { author = response.data.docs[0].author_name[0] }
        if (response.data.docs[0].title) { title = response.data.docs[0].title }
        if (response.data.docs[0].cover_i) { coverImageCode = response.data.docs[0].cover_i }        
        let imageUrlM = `https://covers.openlibrary.org/b/id/${coverImageCode}-M.jpg`;

        const book = new Book({
            title,
            seedTag,
            author,
            imageUrlM,
            reviews
        });
        await book.save()
    }

    //push reviews into books' reviews arrays
    const books = await Book.find({seedTag: 'theShire'});
    const reviews = await Review.find({seedTag: 'theShire'});
    let counter = 0
    for (let i = 0; i < theShireBooks.length; i++) {
        for (let j = 0; j < (reviews.length / theShireBooks.length); j++) {
            books[i].reviews.push(reviews[counter]);
            counter++;
        }
        await books[i].save();
    }

    //create 1 club
    const club = new Club({
        clubName: 'The Shire',
        clubImgUrl: 'https://images.unsplash.com/photo-1462759353907-b2ea5ebd72e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80',
        author: seedAuthor,
        clubMembers: [],
        clubBooks: []
    });
    await club.save();

    //push books into club books array  
    for (let i = 0; i < theShireBooks.length; i++) {
        club.clubBooks.push(books[i]);
    }
    await club.save();
}


//----- Create classic club seeded with books with reviews --------------//
const seedClassicClub = async () => {
    //create reviews
    for (let i = 0; i < Math.floor(reviewArray.length / classicBooks.length) * classicBooks.length ; i++) {
        const review = new Review({
            rating: reviewArray[i].rating,
            comments: reviewArray[i].comments,
            author: reviewArray[i].author,
            seedTag: 'classic'
        })
        await review.save();
    }

    //create books
    for (let i = 0; i < classicBooks.length; i++) {
        const bookTitle = classicBooks[i];
        const response = await axios.get(`http://openlibrary.org/search.json?q=${bookTitle}`);
        let author = '';
        let title = '';
        let coverImageCode = 8406786;
        let reviews = [];
        let seedTag = 'classic'
        if (response.data.docs[0].author_name) { author = response.data.docs[0].author_name[0] }
        if (response.data.docs[0].title) { title = response.data.docs[0].title }
        if (response.data.docs[0].cover_i) { coverImageCode = response.data.docs[0].cover_i }        
        let imageUrlM = `https://covers.openlibrary.org/b/id/${coverImageCode}-M.jpg`;

        const book = new Book({
            title,
            seedTag,
            author,
            imageUrlM,
            reviews
        });
        await book.save()
    }

    //push 3 reviews into each of the 8 book reviews arrays
    const books = await Book.find({seedTag: 'classic'});
    const reviews = await Review.find({seedTag: 'classic'});
    let counter = 0
    for (let i = 0; i < classicBooks.length; i++) {
        for (let j = 0; j < (reviews.length / classicBooks.length); j++) {
            books[i].reviews.push(reviews[counter]);
            counter++;
        }
        await books[i].save();
    }

    //create club
    const club = new Club({
        clubName: 'Ohio Illiterates',
        clubImgUrl: 'https://images.unsplash.com/photo-1465929639680-64ee080eb3ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
        author: seedAuthor,
        clubMembers: [],
        clubBooks: []
    });
    await club.save();

    //add books to club
    for (let i = 0; i < classicBooks.length; i++) {
        club.clubBooks.push(books[i]);
    }
    await club.save();
}


const seedDB = async () => {
    console.log('=> SEEDING Shire CLUB...')
    await seedShireClub();
    console.log('COMPLETE')

    console.log('=> SEEDING Classic CLUB...')
    await seedClassicClub();
    console.log('COMPLETE')

    console.log('*************************************')
    console.log('*                                   *')
    console.log('*     DATABASE SEEDING COMPLETE     *')
    console.log('*                                   *')
    console.log('*************************************')
}

seedDB();