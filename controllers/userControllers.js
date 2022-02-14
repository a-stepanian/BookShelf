const User = require('../models/userModel');



module.exports.renderRegisterForm = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/clubs');
    }
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', `Welcome to BookShelf, ${username}`);
        res.redirect('/clubs');
    })
}

module.exports.renderLoginForm = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/clubs');
    }
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', `Welcome back, ${req.body.username}!`);
    const redirectUrl = req.session.returnTo || '/clubs';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/clubs');
}