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

const deleteBooks = async () => {
    await Book.deleteMany({});
    console.log('all books deleted')
}
// UNCOMMENT TO DELETE BOOKS
deleteBooks();

const randomBooks = [
    'Don Quixote',
    'Robinson Crusoe',
    'Frankenstein',
    'The Count of Monte Cristo',
    'World War Z',
    'Devil in the White City',
    'The Picture of Dorian Gray',
    'Anxious People',
    'The Hobbit',
    'Ready Player One',
    'The Great Gatsby',
    'Nineteen Eighty-Four',
    'The Outsiders',
    'The Lord Of The Rings',
    'To Kill A Mockingbird',
    'Gone Girl',
    'The Curious Incident Of The Dog In The Night-Time',
    'Life of Pi',
    'The Book Thief',
    'Catcher In the Rye'
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


// CHANGE THIS ID FOR THE CLUB YOU WANT TO SEED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const clubId = '62034b567d9cfdb7adf75f05';

const makeBook = async (bookTitle) => {
    const foundClub = await Club.findById(clubId);
    const response = await axios.get(`http://openlibrary.org/search.json?q=${bookTitle}`);
    let author = 'J R R TOLKIEN';
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

    let imageUrlM = 'https://covers.openlibrary.org/b/id/10872750-M.jpg';
    let imageUrlL = 'https://covers.openlibrary.org/b/id/10872750-L.jpg';

    imageUrlM = `https://covers.openlibrary.org/b/id/${coverImageCode}-M.jpg`;
    imageUrlL = `https://covers.openlibrary.org/b/id/${coverImageCode}-L.jpg`;
    const book = new Book({title, author, imageUrlM, imageUrlL});
    foundClub.clubBooks.push(book);
    await book.save();
    await foundClub.save();
    // let newReview = await new Review({ rating: '5', comments: 'Excellent book, I will definitely read it again.' });
    // book.reviews.push(newReview);
    // await newReview.save();
    // await book.save();
    // newReview = await new Review({ rating: '4', comments: 'Solid plot, fun read.  I recommend it!' });
    // book.reviews.push(newReview);
    // await newReview.save();
    // await book.save();
    // newReview = await new Review({ rating: '3', comments: 'While it was a good book overall, the pace was a bit slow for me.  Could have been half the length.' });
    // book.reviews.push(newReview);
    // await newReview.save();
    // await book.save();
}

// CHANGE THE ARRAY NAME TO THE ARRAY OF BOOKS YOU WANT TO SEED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
for (let i = 0; i < fantasyBooks.length; i++) {
    makeBook(fantasyBooks[i]);
};
console.log('made books');
