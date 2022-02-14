const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateClub } = require('../middleware.js')
const clubs = require('../controllers/clubControllers');


router.route('/')
    .get(catchAsync(clubs.index))
    .post(
        isLoggedIn, 
        catchAsync(clubs.new));


router.get('/new', 
    isLoggedIn, 
    clubs.renderNewForm);


router.route('/:id')
    .get(catchAsync(clubs.show))
    .put(
        isLoggedIn, 
        isAuthor, 
        validateClub, 
        catchAsync(clubs.edit))
    .delete(
        isLoggedIn, 
        isAuthor, 
        catchAsync(clubs.delete));


router.get('/:id/edit', 
    isLoggedIn, 
    isAuthor, 
    catchAsync(clubs.renderEditForm));


router.put('/:id/join', 
    isLoggedIn, 
    catchAsync(clubs.joinClub));

    
module.exports = router;