const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDb = require('./seed');

const app = express();
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');

seedDb();

// Passport Config
app.use(require('express-session')({
    secret: 'You Can see G0d when I take my mask off',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Routes

app.get('/', (req, res) => {
    res.render('landing');
});

// Index -> Show all Campgrounds
app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds });
        }
    });
});

// Create -> add new campground to db
app.post('/campgrounds', (req, res) => {
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
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// Show -> Shows more info about one campground
app.get('/campgrounds/:id', (req, res) => {
    // res.send('This will be the show page');
    Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', { campground });
        }
    });
});

// ------------------
// Comments
// ------------------

// New comment
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground });
        }
    });
});

// Create comment
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    // lookup campground
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (commentCreateErr, comment) => {
                if (commentCreateErr) {
                    console.log(commentCreateErr);
                } else {
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect(`/campgrounds/${foundCampground._id}`);
                }
            });
        }
    });
});

// ------------------
// Auth Routes
// ------------------

// show register form
app.get('/register', (req, res) => {
    res.render('register');
});

// handle sign up logic
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
    res.render('login');
});

// login logic
app.post('/login', passport.authenticate(
    'local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
    },
));

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});


app.listen(3000, 'localhost', () => {
    console.log('YelpSrv has startet');
});
