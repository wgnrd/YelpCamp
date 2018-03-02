const express = require('express');
const User = require('../models/user');
const passport = require('passport');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('landing');
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

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
            res.render('register');
        } else {
            passport.authenticate('local')(req, res, () => {
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
    },
));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});

module.exports = router;
