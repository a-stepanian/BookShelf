const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    author: String,
    format: String,
    pageCount: Number,
    firstSentence: Array,
    dateFinished: Date,
    imageUrlM: String,
    imageUrlL: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

BookSchema.post('findOneAndDelete',async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

BookSchema.methods.reviewAverage = function() {
    return this.reviews.map(a => a.rating).reduce((a,b) => a + b, 0) / this.reviews.length
}

module.exports = mongoose.model('Book', BookSchema);