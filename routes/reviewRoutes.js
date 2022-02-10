const express = require('express');
const router = express.Router({ mergeParams: true });  // Need this to pull id from book since won't have that in our routes.
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Book = require('../models/bookModel');
const Club = require('../models/clubModel');
const Review = require('../models/reviewModel');
const { reviewSchema } = require('../schemaValidations');
const { isLoggedIn } = require('../middleware.js')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }  
}

router.get('/', catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id)
    const book = await Book.findById(req.params.bookId).populate('reviews');
    let sum = 0;
    for (let i = 0; i < book.reviews.length; i++) {
        sum += book.reviews[i].rating;
    }
    let average = (sum / book.reviews.length).toFixed(1);
    res.render('books/reviews', { club, book, average });
}));

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id, bookId } = req.params;
    const book = await Book.findById(bookId);
    const newReview = await new Review(req.body);
    book.reviews.push(newReview);
    await newReview.save();
    await book.save();
    res.redirect(`/clubs/${id}/books/${bookId}/reviews`);
}));

router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, bookId, reviewId } = req.params;
    await Book.findByIdAndUpdate(bookId, {$pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/clubs/${id}/books/${bookId}/reviews`);
}));

module.exports = router;