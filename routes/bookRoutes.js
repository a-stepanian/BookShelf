const express= require('express');
const router = express.Router({ mergeParams: true });   //Must user mergParams with express router to pull in the club id!!!!
const catchAsync = require('../utils/catchAsync');
const { validateBook, isLoggedIn } = require('../middleware.js')
const books = require('../controllers/bookControllers')


router.get('/new', 
    isLoggedIn, 
    catchAsync(books.renderNewForm));


router.post('/', 
    isLoggedIn, 
    validateBook, 
    catchAsync(books.new));


router.route('/:bookId')
    .get(catchAsync(books.show))
    .put(
        isLoggedIn, 
        validateBook, 
        catchAsync(books.edit))
    .delete(
        isLoggedIn, 
        catchAsync(books.delete));


router.get('/:bookId/edit', 
    isLoggedIn, 
    catchAsync(books.renderEditForm));


module.exports = router;