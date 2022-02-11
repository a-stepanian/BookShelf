const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Club = require('../models/clubModel')
const { isLoggedIn, isAuthor, validateClub } = require('../middleware.js')


// Club Index
router.get('/', async (req, res) => {
    const clubs = await Club.find().populate('clubBooks');
    res.render('clubs/index', { clubs });
});

// Club New
router.get('/new', isLoggedIn, (req, res) => {
    res.render('clubs/new');
});

// Club New POST
router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    const { clubName } = req.body;
    const author = req.user._id;
    const clubImgUrl = '';
    const clubMembers = [];
    const clubBooks = [];
    const club = await new Club({ clubName, clubMembers, clubBooks, author, clubImgUrl });
    await club.save();
    res.redirect('/clubs');
}));

// Club Show
router.get('/:id', catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id).populate('author').populate('clubBooks').populate('clubMembers');
    res.render('clubs/show', { club });
}));

// Club Edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id);
    res.render('clubs/edit', { club });
}));

// Club Edit Join as a member
router.put('/:id/join', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const club = await Club.findById(id); 
    club.clubMembers.push(user);
    club.save();
    res.redirect(`/clubs/${id}`);
}));

// Club Edit PUT
router.put('/:id', isLoggedIn, isAuthor, validateClub, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Club.findByIdAndUpdate(id, req.body);
    res.redirect(`/clubs/${req.params.id}`);
}));

// Club DELETE
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    await Club.findByIdAndDelete(req.params.id);
    res.redirect('/clubs')
}));

module.exports = router;