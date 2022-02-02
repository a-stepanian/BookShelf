const Joi = require('joi');

module.exports.bookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string(),
    format: Joi.string().required(),
    pageCount: Joi.number(),
    firstSentence: Joi.array(),
    dateStarted: Joi.date(),
    dateFinished: Joi.date(),
    imageUrlM: Joi.string(),
    imageUrlL: Joi.string()
});