const express = require("express");
const router = express.Router();
//Connecting our Controller in 'campgrounds.js' file with this main file:
const campgrounds = require("../controllers/campgrounds");
//Requiring an Async Utility and calling this function in almost every route where we think error is imminent:
const catchAsync = require("../utilities/catchAsync");
//Requiring authentication function (You must be loggedin/ author,valid to get access to a specific route):
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


//👳🏼‍♀️ For the route path we changed "/campgrounds" to "/", as in "index.js", I specified in app.use("/campgrounds") ◀ path

//We typed 3RD ROUTE BEFORE 2ND ROUTE :- ORDER DOES MATTER OTHERWISE router.get will read new as an ID.

router.route("/")
    //1ST ROUTE - CAMPGROUND INDEX
    .get(catchAsync(campgrounds.index))
    //3RD ROUTE - B - POSTING NEW CAMPGROUND IN THE CAMPGROUNDS LIST (form logic):
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));



//3RD ROUTE - A - CREATE A NEW CAMPGROUND (making a form):
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    //2ND ROUTE - EACH CAMPGROUND DETAILS:
    .get(catchAsync(campgrounds.showCampground))
    //4TH ROUTE - B - UPDATING AND POSTING EDITED CAMPGROUND:
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    //5TH ROUTE - DELETING A CAMPGROUND:
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteForm));

//4TH ROUTE - A - EDIT EACH INDIVIDUAL CAMPGROUND:
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;