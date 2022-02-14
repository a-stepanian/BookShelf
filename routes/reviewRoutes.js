const express = require('express');
const router = express.Router({ mergeParams: true });  // Need this to pull id from book since won't have that in our routes.
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js')
const reviews = require('../controllers/reviewControllers')


router.route('/')
    .get(catchAsync(reviews.index))
    .post(
        isLoggedIn, 
        validateReview, 
        catchAsync(reviews.new));


router.delete('/:reviewId', 
    isLoggedIn, 
    isReviewAuthor, 
    catchAsync(reviews.delete));

    
module.exports = router;