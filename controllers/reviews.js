//Connecting our Model in 'campground.js' file with this main file:
const Campground = require("../models/campground");
//Connecting our Model in 'review.js' file with this main file:
const Review = require("../models/review");

//6TH ROUTE
module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    //remember here we r also writing (req.body".review") as in "show.ejs",we gave input ▶ a name in which we stored review[].
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created a new Review!"); //🌸 called in "index.js" by res.locals.success! Must redirect after it!
    res.redirect(`/campgrounds/${campground._id}`);
}
//7TH ROUTE
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    //The pull operator removes from an existing array all instances of a value or values that match a specified condition.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a review!"); //🌸 called in "index.js" by res.locals.success! Must redirect after it!
    res.redirect(`/campgrounds/${id}`);
}