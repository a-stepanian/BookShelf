const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!' 
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) {
                    return helpers.error('string.escapeHTML', {value})
                };
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.bookSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    author: Joi.string().escapeHTML(),
    imageUrlM: Joi.string().escapeHTML(),
    reviews: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required(),
    comments: Joi.string().escapeHTML()
});

module.exports.clubSchema = Joi.object({
    clubName: Joi.string().required().escapeHTML(),
    clubImgUrl: Joi.string().escapeHTML(),
    clubMembers: Joi.array(),
    clubBooks: Joi.array()
});