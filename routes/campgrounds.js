var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middelware = require("../middleware");  // auto require index.js even without index.js

router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log("Error");
        } else {
            res.render("./campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});


// make new campgrounds
router.post("/", middelware.isLoggedIn, function(req, res){
    // get data form and add to array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {name:name, image:image, price:price, description:description, author:author};
    
    Campground.create(newCamp, function(err, campground){
        if (err) {
            console.log("Error!");
            res.redirect("/campgrounds");
        } else {
            console.log("Newly Saved!");
        }
    })
    // campgrounds.push(newCamp);
    res.redirect("/campgrounds");
    // redirect
});

router.get("/new", middelware.isLoggedIn, function(req, res){
    res.render("./campgrounds/new");
})

router.get("/:id", function(req, res){
    // res.send("A new show page");
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){ // comments
        if(err){
            console.log("Error!");
        } else {
            res.render("./campgrounds/show", {campground: foundCampground})
        }
    });
});

// =============
// AUTHORIZATION
// =============

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middelware.checkOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("./campgrounds/edit", {campground:foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE

router.put("/:id", function(req, res){
    // find and update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE

router.delete("/:id", middelware.checkOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;