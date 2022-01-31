const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    author: String,
    dateStarted: Date,
    dateFinished: Date
});

module.exports = mongoose.model('Book', BookSchema);