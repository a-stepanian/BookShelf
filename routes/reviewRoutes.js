const express = require('express');
const router = express.Router({ mergeParams: true });  // Need this to pull id from book since won't have that in our routes.
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Book = require('../models/bookModel');
const Review = require('../models/reviewModel');
const { reviewSchema } = require('../schemaValidations');


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
    const book = await Book.findById(req.params.id).populate('reviews');
    res.render('books/reviews', { book });
}));

router.post('/', validateReview, catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    const newReview = await new Review(req.body);
    book.reviews.push(newReview);
    await newReview.save();
    await book.save();
    res.redirect(`/books/${req.params.id}/reviews`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Book.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/books/${id}/reviews`);
}));

module.exports = router;