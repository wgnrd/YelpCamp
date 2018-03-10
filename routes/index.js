const express = require('express');
const User = require('../models/user');
const passport = require('passport');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('landing');
});

// ------------------
// Auth Routes
// ------------------

// show register form
router.get('/register', (req, res) => {
    res.render('register');
});

// handle sign up logic
router.post('/register', (req, res) => {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err) => {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            res.redirect('/register');
        } else {
            passport.authenticate('local')(req, res, () => {
                req.flash('success', `Nice to meet you ${newUser.username}`);
                res.redirect('/campgrounds');
            });
        }
    });
});

// show login form
router.get('/login', (req, res) => {
    res.render('login');
});

// login logic
router.post('/login', passport.authenticate(
    'local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
        failureFlash: 'The email or password is incorrect',
    },
));

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You logged out');
    res.redirect('/campgrounds');
});

module.exports = router;
