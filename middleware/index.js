// ==========
// MIDDLEWARE
// ==========
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) { // .equal
                    // res.render("./campgrounds/edit", {campground:foundCampground});
                    next();
                } else {
                    req.flash("error", "You don't have permission!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to login to do that!");
        res.redirect("back"); // where user came from
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) { // .equal
                    // res.render("./campgrounds/edit", {campground:foundCampground});
                    next();
                } else {
                    req.flash("error", "You don't have permission!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to login to do that!");
        res.redirect("back"); // where user came from
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
}

module.exports = middlewareObj;