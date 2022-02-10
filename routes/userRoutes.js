const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/clubs');
    }
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', `Welcome to BookShelf, ${username}`);
        res.redirect('/clubs');
    })
}));

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/clubs');
    }
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', `Welcome back, ${req.body.username}!`);
    const redirectUrl = req.session.returnTo || '/clubs';
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/clubs');
});

module.exports = router;