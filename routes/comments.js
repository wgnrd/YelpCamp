const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');


const router = express.Router({ mergeParams: true });


// ------------------
// Routes
// ------------------

// New comment
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash('error', err.message);
            console.log(err);
        } else {
            res.render('comments/new', { campground });
        }
    });
});

// Create comment
router.post('/', middleware.isLoggedIn, (req, res) => {
    // lookup campground
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (commentCreateErr, comment) => {
                if (commentCreateErr) {
                    console.log(commentCreateErr);
                    req.flash('error', commentCreateErr.message);
                } else {
                    // comment.author.id = req.user._id;
                    // comment.author.username = req.user.username;
                    const newComment = comment;
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect(`/campgrounds/${foundCampground._id}`);
                }
            });
        }
    });
});

// Edit Comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
        }
    });
});

// Update Comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// Destroy Comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

module.exports = router;
