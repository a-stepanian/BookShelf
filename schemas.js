const Joi = require('joi');

module.exports.bookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string(),
    format: Joi.string().required(),
    pageCount: Joi.number(),
    firstSentence: Joi.array(),
    dateFinished: Joi.date(),
    imageUrlM: Joi.string(),
    imageUrlL: Joi.string()
}).required();

module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required(),
    comments: Joi.string()
}).required();