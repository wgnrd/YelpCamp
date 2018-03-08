const express = require('express');
const Campground = require('../models/campground');
const middleware = require('../middleware');

const router = express.Router();


// ------------------
// Routes
// ------------------


// Index -> Show all Campgrounds
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds });
        }
    });
});

// Create -> add new campground to db
router.post('/', middleware.isLoggedIn, (req, res) => {
    const { name } = req.body;
    const { image } = req.body;
    const { description } = req.body;
    const { price } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username,
    };

    // Save new Campground to db
    Campground.create({
        name, image, description, author, price,
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
    Campground.remove();
});

// NEW -> Display the form for a new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// Show -> Shows more info about one campground
router.get('/:id', (req, res) => {
    // res.send('This will be the show page');
    Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', { campground });
        }
    });
});

// Edit Campground Route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render('../views/campgrounds/edit', { campground });
    });
});

// Update Campground Route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// Destroy Campgrounds
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/campgrounds');
    });
});


module.exports = router;
