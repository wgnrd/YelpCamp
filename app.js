const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const seedDb = require('./seed');

const app = express();
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

seedDb();

app.get('/', (req, res) => {
    res.render('landing');
});

// Index -> Show all Campgrounds
app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, allcampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', { campgrounds: allcampgrounds });
        }
    });
});

// Create -> add new campground to db
app.post('/campgrounds', (req, res) => {
    const { name } = req.body.name;
    const { image } = req.body.image;
    const { desc } = req.body.description;

    // Save new Campground to db
    Campground.create({ name, image, description: desc }, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
    Campground.remove();
});

// NEW -> Display the form for a new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

// Show -> Shows more info about one campground
app.get('/campgrounds/:id', (req, res) => {
    // res.send('This will be the show page');
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render('show', { campground: foundCampground });
        }
    });
});

app.listen(3000, 'localhost', () => {
    console.log('YelpSrv has startet');
});
