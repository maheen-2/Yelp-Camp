//Connecting our Model in 'campground.js' file with this main file:
const Campground = require("../models/campground");
//Requiring Cloudinary object so that imgs r also deleted from Cloudinary as we delete them from campground:
const { cloudinary } = require("../cloudinary");
//Requiring paricular service u want from geocoding mapbox:
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = "pk.eyJ1IjoibWFoZWVuMSIsImEiOiJjbDVzZXd3emowbXVuM2luMHZ1Z25kejAyIn0.MaYfek24p5b83ib1JMvPFA"     //process.env.MAPBOX_TOKEN; // passing in the token we saved in .env file
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); // using it to create new tokens

//1ST ROUTE
module.exports.index = async (req, res) => {
    //Find all products:
    const campgrounds = await Campground.find({});
    //Passing second argument {products} so that our EJS File has access to it:
    res.render("campgrounds/index", { campgrounds });
}
//3RD ROUTE - A
module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new")
}
//3RD ROUTE - B
module.exports.createCampground = async (req, res, next) => {
    //We can catch errors by 2 ways:
    //1️⃣ try/catch to catch any error (e.g. if the user types a string in the price field & hit submit ➡ error pops)
    //Must pass next(e) for async (no catchAsync):
    //2️⃣ using catchAsync function which we exported from utilities (Shorter & convenient):
    //try{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename })); //if I upload to file, array is madethat contains its URL & filename.
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash("success", "Successfully created a new campground!"); //🌸 called in "index.js" by res.locals.success! Must redirect after it!
    res.redirect(`/campgrounds/${campground._id}`);
    //} catch(e){next(e)}
}
//2ND ROUTE
module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews', //populating(displaying) reviews of each campground & inside each review populating(displaying) its author.
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');//🌸 called in "index.js" by res.locals.success! Must redirect after it!
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
}
//4TH ROUTE - A
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');//🌸 called in "index.js" by res.locals.success! Must redirect after it!
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", { campground });
}
//4TH ROUTE - B
module.exports.updateCampground = async (req, res) => {
    //going to install "npm i method-override" as put method doesn't work with forms.
    //require it and use it in index.js.
    //also include it with our form in edit.ejs.
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) { //for deleting imgs from backend
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); // img also deleted from cloudinary
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash("success", "Successfully updated campground!"); //🌸 called in "index.js" by res.locals.success! Must redirect after it!
    res.redirect(`/campgrounds/${campground._id}`);
}
//5TH ROUTE
module.exports.deleteForm = async (req, res) => {
    //created a delete form using methodoverride in show.ejs.
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a campground!"); //🌸 called in "index.js" by res.locals.success! Must redirect after it!
    res.redirect("/campgrounds");
}