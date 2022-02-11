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

//reviews
const reviewArray = [
    {
        'rating' : 5,
        'comments' : 'Amazing!!!' 
    },
    {
        'rating' : 5,
        'comments' : 'Perfect!!!' 
    },
    {
        'rating' : 5,
        'comments' : 'Flawless!!!' 
    },
    {
        'rating' : 4,
        'comments' : 'I really liked this book.' 
    },
    {
        'rating' : 4,
        'comments' : 'I really liked this book, too.' 
    },
    {
        'rating' : 4,
        'comments' : 'I, too, really liked this book.'
    },
    {
        'rating' : 3,
        'comments' : 'avg' 
    },
    {
        'rating' : 3,
        'comments' : 'meh' 
    },
    {
        'rating' : 3,
        'comments' : 'ok' 
    }
]

//books
const classicBooks = [
    'The Hobbit',
    'The Great Gatsby',
    'Catcher In the Rye'
]
const otherBooks = [
    'Gone Girl',
    'The Curious Incident Of The Dog In The Night-Time',
    'Life of Pi',
    'The Book Thief',
    'Ready Player One',
    'Anxious People',
    'World War Z',
    'Devil in the White City'
]
const fantasyBooks = [
    'A Game of Thrones',
    'A Clash of Kings',
    'A Storm of Swords',
    'A Feast for Crows',
    'A Dance With Dragons',
    'The Hobbit',
    'Lord of the Rings',
    'The Two Towers',
    'Return of the King'
]
const mysteryBooks = [
    'and then there were none',
    'the hound of the baskervilles',
    'murder on the orient express',
    'death on the nile'
]

//Seed Author
const seedAuthor = '6205a9c5f33d237129fa70ce';

const seedDB = async () => {
    //clear clubs/books/reviews
    await Club.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});
    console.log('deleted all the stuff')

    //create 9 reviews
    for (let i = 0; i < 9; i++) {
        const review = new Review(reviewArray[i])
        await review.save()
    }
    console.log('created 9 reviews')

    //create 3 books
    for (let i = 0; i < 3; i++) {
        const bookTitle = classicBooks[i];
        const response = await axios.get(`http://openlibrary.org/search.json?q=${bookTitle}`);
        let author = '';
        let title = '';
        let coverImageCode = 8406786;
        let reviews = [];
        if (response.data.docs[0].author_name) { author = response.data.docs[0].author_name[0] }
        if (response.data.docs[0].title) { title = response.data.docs[0].title }
        if (response.data.docs[0].cover_i) { coverImageCode = response.data.docs[0].cover_i }        
        let imageUrlM = `https://covers.openlibrary.org/b/id/${coverImageCode}-M.jpg`;
        let imageUrlL = `https://covers.openlibrary.org/b/id/${coverImageCode}-L.jpg`;

        const book = new Book({
            title,
            author,
            imageUrlM,
            imageUrlL,
            reviews
        });
        await book.save()
    }
    console.log('created 3 books')

    //push 3 reviews into each of the 3 book reviews arrays
    const books = await Book.find({});
    const reviews = await Review.find({});
    let counter = 0
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            books[i].reviews.push(reviews[counter]);
            counter++;
        }
        await books[i].save();
    }
    console.log('pushed 3 unique reviews into each book reviews array')

    //create 1 club
    for (let i = 0; i < 1; i++) {
        const club = new Club({
            clubName: 'The Shire',
            clubImgUrl: 'https://images.unsplash.com/photo-1462759353907-b2ea5ebd72e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80',
            author: seedAuthor,
            clubMembers: [],
            clubBooks: []
        });
        await club.save();
    }
    console.log('made one club')


    //push books into club books array
    const club = await Club.find({});    
    for (let i = 0; i < 3; i++) {
        club[0].clubBooks.push(books[i]);
    }
    await club[0].save();
    console.log('pushed 3 books into the club books array')
    console.log('************************************')
    console.log('**********SEEDING COMPLETE**********')
    console.log('************************************')
}



seedDB();