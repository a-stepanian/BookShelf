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
const seedAuthor = '6205a9c5f33d237129fa70ce'; //club author
const reviewAuthors = [
    '6205a9c5f33d237129fa70ce',
    '62046c0f7e2098a3586f88c0',
    '6206b993020d1243ee78dd7e',
    '6206b9a8020d1243ee78dd87',
    '62043528dc4268fdecd75438',
    '6206ba69020d1243ee78dd90'
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

// mystery books
const mysteryBooks = [
    'gone girl',
    'the secret of chimneys',
    'the maltese falcon',
    'the mysterious affair at styles',
    'the hound of the baskervilles',
    'the murder at the vicarage',
    'a study in scarlet',
    'the moonstone',
    'the murder of roger ackroyd',
    'the adventures of sherlock holmes',
    'the murder on the links',
    'and then there were none',
    'the mystery of the blue train',
    'the a.b.c. murders',
    'peril at end house',
    'lord edgware dies',
    'a murder is announced',
    'murder on the orient express',
    'the deep blue good-by',
    'endless night',
    'the secret adversary',
    'poirot investigates',
    'the seven dials mystery'
]

// chicago books
const chicagoBooks = [
    'Devil in the White City',
    'The Fifth Floor',
    '47th Street Black',
    'Water for Elephants',
    'Anxious People',
    'Divine Days',
    'The Curious Incident Of The Dog In The Night-Time',
    'The Midnight Library',
    'The Untethered Soul',
    'Animal Farm',
    'Ready Player One',
    'The Godfather'
]

// modern books
const bookWormBooks = [
    'World War Z',
    'The Book Thief'
]




//----- clear all clubs/books/reviews -----------------------------------//
const deleteAllExceptUsers = async () => {
    await Club.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});
}

//----- Create mystery club seeded with books with reviews --------------//
const seedMysteryClub = async () => {
    //create reviews
    for (let i = 0; i < Math.floor(reviewArray.length / mysteryBooks.length) * mysteryBooks.length ; i++) {
        const review = new Review({
            rating: reviewArray[i].rating,
            comments: reviewArray[i].comments,
            author: reviewArray[i].author,
            seedTag: 'mystery'
        })
        await review.save();
    }

    //create books
    for (let i = 0; i < mysteryBooks.length; i++) {
        const bookTitle = mysteryBooks[i];
        const response = await axios.get(`http://openlibrary.org/search.json?q=${bookTitle}`);
        let author = '';
        let title = '';
        let coverImageCode = 8406786;
        let reviews = [];
        let seedTag = 'mystery'
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
    const books = await Book.find({seedTag: 'mystery'});
    const reviews = await Review.find({seedTag: 'mystery'});
    let counter = 0
    for (let i = 0; i < mysteryBooks.length; i++) {
        for (let j = 0; j < (reviews.length / mysteryBooks.length); j++) {
            books[i].reviews.push(reviews[counter]);
            counter++;
        }
        await books[i].save();
    }

    //create 1 club
    const club = new Club({
        clubName: 'Mystery Machine',
        clubImgUrl: 'https://images.unsplash.com/photo-1608311430809-596bee7b41fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80',
        author: seedAuthor,
        clubMembers: [],
        clubBooks: []
    });
    await club.save();

    //push 8 books into club books array
    for (let i = 0; i < mysteryBooks.length; i++) {
        club.clubBooks.push(books[i]);
    }
    await club.save();
}

//----- Create chicago club seeded with books with reviews --------------//
const seedChicagoClub = async () => {
    //create reviews
    for (let i = 0; i < Math.floor(reviewArray.length / chicagoBooks.length) * chicagoBooks.length ; i++) {
        const review = new Review({
            rating: reviewArray[i].rating,
            comments: reviewArray[i].comments,
            author: reviewArray[i].author,
            seedTag: 'chicago'
        })
        await review.save();
    }

    //create books
    for (let i = 0; i < chicagoBooks.length; i++) {
        const bookTitle = chicagoBooks[i];
        const response = await axios.get(`http://openlibrary.org/search.json?q=${bookTitle}`);
        let author = '';
        let title = '';
        let coverImageCode = 8406786;
        let reviews = [];
        let seedTag = 'chicago'
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
    const books = await Book.find({seedTag: 'chicago'});
    const reviews = await Review.find({seedTag: 'chicago'});
    let counter = 0
    for (let i = 0; i < chicagoBooks.length; i++) {
        for (let j = 0; j < (reviews.length / chicagoBooks.length); j++) {
            books[i].reviews.push(reviews[counter]);
            counter++;
        }
        await books[i].save();
    }

    //create club
    const club = new Club({
        clubName: 'Windy City Readers',
        clubImgUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1888&q=80',
        author: seedAuthor,
        clubMembers: [],
        clubBooks: []
    });
    await club.save();

    //add books to club
    for (let i = 0; i < chicagoBooks.length; i++) {
        club.clubBooks.push(books[i]);
    }
    await club.save();
}

//----- Create bookworm club seeded with books with reviews -------------//
const seedBookWormClub = async () => {
    //create reviews
    for (let i = 0; i < Math.floor(reviewArray.length / bookWormBooks.length) * bookWormBooks.length ; i++) {
        const review = new Review({
            rating: reviewArray[i].rating,
            comments: reviewArray[i].comments,
            author: reviewArray[i].author,
            seedTag: 'bookworm'
        })
        await review.save()
    }

    //create books
    for (let i = 0; i < bookWormBooks.length; i++) {
        const bookTitle = bookWormBooks[i];
        const response = await axios.get(`http://openlibrary.org/search.json?q=${bookTitle}`);
        let author = '';
        let title = '';
        let coverImageCode = 8406786;
        let reviews = [];
        seedTag = 'bookworm'
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

     //push reviews into each of the books' reviews arrays
     const books = await Book.find({seedTag: 'bookworm'});
     const reviews = await Review.find({seedTag: 'bookworm'});
     let counter = 0
     for (let i = 0; i < bookWormBooks.length; i++) {
         for (let j = 0; j < (reviews.length / bookWormBooks.length); j++) {
             books[i].reviews.push(reviews[counter]);
             counter++;
         }
         await books[i].save();
     }
 
     //create 1 club
     const club = new Club({
         clubName: 'BookWorms',
         clubImgUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
         author: seedAuthor,
         clubMembers: [],
         clubBooks: []
     });
     await club.save();
 
     //push books into club's books array  
     for (let i = 0; i < bookWormBooks.length; i++) {
         club.clubBooks.push(books[i]);
     }
     await club.save();
 }



const seedDB = async () => {
    console.log('1) DELETING ALL CLUBS/BOOKS/REVIEWS...')
    await deleteAllExceptUsers();
    console.log('COMPLETE')
    console.log('2) SEEDING MYSTERY CLUB...')
    await seedMysteryClub();
    console.log('COMPLETE')
    console.log('3) SEEDING CHICAGO CLUB...')
    await seedChicagoClub();
    console.log('COMPLETE')
    console.log('4) SEEDING BOOKWORM CLUB...')
    await seedBookWormClub();
    console.log('*************************************')
    console.log('*                                   *')
    console.log('*     DATABASE SEEDING COMPLETE     *')
    console.log('*                                   *')
    console.log('*************************************')
}

seedDB();