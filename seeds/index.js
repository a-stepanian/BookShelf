const mongoose = require('mongoose');
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
deleteBooks();



const books = [
    'Don Quixote',
    'Robinson Crusoe',
    'Frankenstein',
    'The Count of Monte Cristo',
    'David Copperfield',
    'Huckleberry Finn',
    'The Picture of Dorian Gray',
    'Treasure Island',
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





const makeBook = async (bookTitle) => {
    const response = await axios.get(`http://openlibrary.org/search.json?q=${bookTitle}`);
    let author = 'J R R TOLKIEN';
    let pageCount = 404;
    let firstSentence = [];
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

    if (response.data.docs[0].number_of_pages_median) {
        pageCount = response.data.docs[0].number_of_pages_median;
    } else {
        pageCount = response.data.docs[1].number_of_pages_median;
    }

    if (response.data.docs[0].first_sentence) {
        firstSentence = response.data.docs[0].first_sentence;
    } else {
        firstSentence = [];
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
    const book = new Book({title, author, pageCount, firstSentence, imageUrlM, imageUrlL});
    await book.save();
    let newReview = await new Review({ rating: '5', comments: 'Excellent' });
    book.reviews.push(newReview);
    await newReview.save();
    await book.save();
    newReview = await new Review({ rating: '4', comments: 'Good' });
    book.reviews.push(newReview);
    await newReview.save();
    await book.save();
}

for (let i = 0; i < books.length; i++) {
    makeBook(books[i]);
};
console.log('made books');
