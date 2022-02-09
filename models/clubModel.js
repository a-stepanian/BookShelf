const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');
const Book = require('./bookModel');
const Review = require('./reviewModel');

const clubSchema = new Schema ({
    clubName: String,
    clubMembers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    clubBooks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Book'
        }
    ]
});

clubSchema.post('findOneAndDelete', async function (doc) {
    const booksInThisClub = await Book.find({ _id: { $in: doc.clubBooks } });
    if (booksInThisClub) {
        for (let book of booksInThisClub) {
            await Review.deleteMany({ _id: { $in: book.reviews } });
        }
    }
    if (doc) {
        await Book.deleteMany({ _id: { $in: doc.clubBooks } });
    }
});

module.exports = mongoose.model('Club', clubSchema);