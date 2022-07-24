const express = require("express");
const router = express.Router({ mergeParams: true });
//we must set merge params in this file to true to hev access to campground id (not the case for campground routes) 👲🏼ANNOYING👲🏼
//Connecting our Model in 'campground.js' file with this main file:
const Campground = require("../models/campground");
//Connecting our Model in 'review.js' file with this main file:
const Review = require("../models/review");
//Connecting our Controller in 'reviews.js' file with this main file:
const reviews = require("../controllers/reviews");
//Requiring an Async Utility and calling this function in almost every route where we think error is imminent:
const catchAsync = require("../utilities/catchAsync");
//Requiring authentication function (You must be loggedin/ author,valid to get access to a specific route):
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


//👳🏼‍♀️ For the route path we changed "/campgrounds/:id/reviews" to "/", as in "index.js", I specified in app.use("/campgrounds/:id/reviews") ◀ path

//6TH ROUTE - LINKING REVIEW MODEL WITH CAMPGROUND MODEL (accessing reviews thru campground):
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

//7TH ROUTE - DELETING A REVIEW FROM A CAMPGROUND:
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));
//now even if we delete a campground without (post), no reviews will be accessible or shown to the user on the web page but in our mongo we'll still hev them.
//goin to do it with Mongoose middlleware (Pre & post)
//for that move to /models/campground <-- middleware added 🐽

module.exports = router;