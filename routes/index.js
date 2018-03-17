const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const middleware = require('../middleware');
const nodemailer = require('nodemailer');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('landing');
});


function sendUserMail(email, token) {
    console.log(process.env.PW);
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jyumbadl5luteue5@ethereal.email',
            pass: process.env.PW,
        },
    });
    const mailOptions = {
        to: email,
        from: 'passwordreset@demo.com',
        subject: 'Yempli Password Reset',
        text: `${'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:5000/reset/'}${token}\n\n` +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    };
    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.log(err);
        }
    });
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
    const newUser = new User({ username: req.body.username, email: req.body.email });
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
        req.flash('error', 'password and confirm password must match');
        res.redirect('/pwchange');
    } else {
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
                    req.flash('success', 'password changed');
                    res.redirect('/campgrounds');
                }
            });
        });
    }
});

router.get('/forgot', (req, res) => {
    res.render('forgot');
});

router.put('/forgot', (req, res) => {
    const { email } = req.body;
    User.findOne({ email }, (err, foundUser) => {
        if (err) {
            req.flash('error', err);
        } else {
            foundUser.resetToken = foundUser._id;
            User.update(foundUser);
            sendUserMail(email, foundUser.resetToken);
            req.flash('success', `Mail is sent to ${email}`);
        }
        res.redirect('/forgot');
    });
});

router.get('/reset/:resettoken', (req, res) => {
    res.render('reset', { token: req.params.resettoken });
});

router.put('/reset/:resettoken', (req, res) => {
    User.findById(req.params.resettoken, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            foundUser.setPassword(req.body.password, (reseterr) => {
                if (reseterr) {
                    req.flash('error', reseterr);
                } else {
                    foundUser.save();
                    req.flash('success', 'Password changed');
                    req.login(foundUser, (err) => {
                        res.redirect('/campgrounds');
                    });
                }
            });
        }
    });
});


module.exports = router;
