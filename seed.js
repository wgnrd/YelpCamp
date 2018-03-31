const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
  {
    name: 'Kirchkreis',
    image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
    description:
      'Forage church-key portland, humblebrag truffaut quinoa raclette irony cornhole taiyaki godard austin. Gentrify kinfolk helvetica kombucha selfies typewriter man braid iPhone. Tumblr prism lo-fi, shaman photo booth yr put a bird on it vaporware asymmetrical selvage raw denim. Bespoke af gochujang everyday carry. Biodiesel sartorial vape venmo cliche snackwave heirloom meditation cornhole gentrify gochujang slow-carb quinoa. Taiyaki banjo poutine art party retro lomo ennui waistcoat. IPhone gochujang jean shorts wolf, tilde craft beer subway tile dreamcatcher health goth XOXO vice YOLO.',
  },
  {
    name: 'Elmbach',
    image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
    description:
      'Art party irony wolf, direct trade try-hard adaptogen church-key occupy drinking vinegar blue bottle. Hot chicken retro coloring book readymade raw denim. Lumbersexual bicycle rights narwhal disrupt health goth lo-fi fam cliche sriracha keffiyeh ugh snackwave godard humblebrag. Tousled shabby chic la croix 90 kogi locavore VHS four dollar toast synth brooklyn before they sold out. Banjo activated charcoal taxidermy roof party semiotics dreamcatcher pop-up. Enamel pin lumbersexual succulents bicycle rights kombucha aesthetic etsy snackwave heirloom church-key portland. Squid trust fund put a bird on it gentrify.',
  },
  {
    name: 'Wittenmölsen',
    image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
    description:
      'Bespoke affogato actually, swag yuccie viral pok pok artisan. Master cleanse taiyaki humblebrag kombucha selvage scenester post-ironic tilde PBR&B ennui semiotics bushwick. Tousled chicharrones put a bird on it pug typewriter ramps edison bulb ugh keytar mixtape health goth helvetica air plant 3 wolf moon meditation. 3 wolf moon adaptogen pour-over mumblecore franzen bitters gastropub messenger bag banjo migas.',
  },
];

function seedDB() {
  // Remove all campgrounds
  Campground.remove({}, (removeCampErr) => {
    if (removeCampErr) {
      console.log(removeCampErr);
    }
    console.log('removed campgrounds!');
    // Remove all comments
    Comment.remove({}, (removeCommentErr) => {
      if (removeCommentErr) {
        console.log(removeCommentErr);
      }
      console.log('removed comments!');
      // add a few campgrounds
      data.forEach((seed) => {
        Campground.create(seed, (createCampErr, campground) => {
          if (createCampErr) {
            console.log(createCampErr);
          } else {
            console.log('added a campground');
            // create a comment
            Comment.create(
              {
                text: 'This place is great, but I wish there was internet',
                author: 'Homer',
              },
              (createCommentErr, comment) => {
                if (createCommentErr) {
                  console.log(createCommentErr);
                } else {
                  campground.comments.push(comment._id);
                  campground.save();
                  console.log('Created new comment');
                }
              },
            );
          }
        });
      });
    });
  });
  // add a few comments
}
module.exports = seedDB;
