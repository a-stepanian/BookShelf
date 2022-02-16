const Club = require('./models/clubModel');
const { clubSchema, bookSchema, reviewSchema } = require('./schemaValidations');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/reviewModel');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first.');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const club = await Club.findById(id);
    if (!club.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that");
        return res.redirect(`/clubs/${id}}`);
    }
    next();
}

module.exports.validateUrl = (req, res, next) => {
    const { clubImgUrl } = req.body;
    if (clubImgUrl.includes('https://images.unsplash.com/')) {
        next();
    } else {
        throw new ExpressError('Not a valid image, go to unsplash.com to choose an image', 403)
    }
}
module.exports.validateClub = (req, res, next) => {
    const { error } = clubSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }  
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, bookId, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that");
        return res.redirect(`/clubs/${id}}/books/${bookId}/reviews`);
    }
    next();
}