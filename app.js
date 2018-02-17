var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: 'Wilder Kaiser', 
//     image: 'https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb', 
//     description: "Es ist kein Lager, sondern ein Wanderhotel. Es gibt eine Euro-Camp Wilder Kaiser in Kössen!"
// }, (err, campground) => {
//     if(err) {
//         console.log(err);
//     }else {
//         console.log("new created campground: ");
//         console.log(campground);
//     }
// });

app.get("/", (req, res) => {
    res.render("landing");
});

// Index -> Show all Campgrounds
app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allcampgrounds) => {
        if (err) {
            console.log(err);
        }else {
            res.render("index", {campgrounds: allcampgrounds})
        }
    });
});

// Create -> add new campground to db
app.post("/campgrounds", (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;

    //Save new Campground to db
    Campground.create({name: name, image: image, description: desc}, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        }else {
            res.redirect("/campgrounds");
        }
    });
    Campground.remove()

});

// NEW -> Display the form for a new campground
app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

// Show -> Shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
    // res.send("This will be the show page");
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err){
            console.log(err)
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
    
});

app.listen(3000, "localhost", _ => {
    console.log("YelpSrv has startet");
});