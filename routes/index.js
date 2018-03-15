const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const middleware = require('../middleware');

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

router.get('/pwchange', (req, res) => {
    res.render('pwchange');
});

router.put('/pwchange/:id', middleware.isLoggedIn, (req, res) => {
    if (req.body.password !== req.body.confirmpassword) {
        req.flash('error', 'Password and confirm password must match');
        res.redirect('/pwchange');
    }

    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            req.flash('error', err);
            res.redirect('/pwchange');
        }
        foundUser.setPassword(req.body.password, (reseterr) => {
            if (reseterr) {
                req.flash('error', reseterr);
            } else {
                foundUser.save();
                req.flash('success', 'Password changed');
                res.redirect('/campgrounds');
            }
        });
    });
});

module.exports = router;
