const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                res.redirect('back');
            } else if (comment.author.id.equals(req.user._id)) {
                next();
            }
        });
    } else {
        res.redirect('back');
    }
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                res.redirect('back');
            } else if (campground.author.id.equals(req.user._id)) {
                next();
            }
        });
    } else {
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = middlewareObj;
