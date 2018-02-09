var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name: 'Grubhof', image: 'https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?w=1260&h=750&dpr=2&auto=compress&cs=tinysrgb'},
    {name: 'Wilder Kaiser', image: 'https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb'},
    {name: 'Camping Arlberg', image: 'https://images.pexels.com/photos/6714/light-forest-trees-morning.jpg?h=350&dpr=2&auto=compress&cs=tinysrgb'}
];

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    campgrounds.push({name: name, image: image});

    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.listen(3000, "localhost", _ => {
    console.log("YelpSrv has startet");
});