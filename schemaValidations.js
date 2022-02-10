const Joi = require('joi');

module.exports.bookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string(),
    imageUrlM: Joi.string(),
    imageUrlL: Joi.string(),
    reviews: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required(),
    comments: Joi.string()
});

module.exports.clubSchema = Joi.object({
    clubName: Joi.string().required(),
    clubImgUrl: Joi.string(),
    clubMembers: Joi.array(),
    clubBooks: Joi.array()
});