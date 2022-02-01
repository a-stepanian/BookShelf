const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    author: String,
    format: String,
    pageCount: Number,
    firstSentence: Array,
    dateStarted: Date,
    dateFinished: Date,
    imageUrlM: String,
    imageUrlL: String
});

module.exports = mongoose.model('Book', BookSchema);