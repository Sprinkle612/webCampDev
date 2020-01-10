var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash = require("connect-flash"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    
var url = process.env.databaseURL || "mongodb://localhost:27017/yelp_camp"
mongoose.connect(url, {useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Keep fighting till the end",
    resave: false,
    saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // from passport-mongoose
passport.deserializeUser(User.deserializeUser());

// apply to everywhere
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes); // append all /campgrounds to route.get(..)
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});