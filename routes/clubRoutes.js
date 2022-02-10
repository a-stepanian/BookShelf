const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Club = require('../models/clubModel')
const User = require('../models/userModel')
const { clubSchema } = require('../schemaValidations');
const { isLoggedIn } = require('../middleware.js')

const validateClub = (req, res, next) => {
    const { error } = clubSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


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
    const clubMembers = [];
    const clubBooks = [];
    const club = await new Club({ clubName, clubMembers, clubBooks });
    await club.save();
    res.redirect('/clubs');
}));

// Club Show
router.get('/:id', catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id).populate('clubBooks').populate('clubMembers');
    res.render('clubs/show', { club });
}));

// Club Edit
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id);
    res.render('clubs/edit', { club });
}));

// Club Edit Join as a member
router.put('/:id/join', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ username: req.session.passport.user});
    const club = await Club.findById(id); 
    club.clubMembers.push(user);
    club.save();
    res.redirect(`/clubs/${id}`);
})

// Club Edit PUT
router.put('/:id', isLoggedIn, validateClub, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Club.findByIdAndUpdate(id, req.body);
    res.redirect(`/clubs/${req.params.id}`);
}));

// Club DELETE
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    await Club.findByIdAndDelete(req.params.id);
    res.redirect('/clubs')
}));

module.exports = router;