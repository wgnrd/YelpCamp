const express = require('express');
const Campground = require('../models/campground');

const router = express.Router();


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
router.post('/', (req, res) => {
    const { name } = req.body;
    const { image } = req.body;
    const { description } = req.body;

    // Save new Campground to db
    Campground.create({ name, image, description }, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
    Campground.remove();
});

// NEW -> Display the form for a new campground
router.get('/new', (req, res) => {
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

module.exports = router;
