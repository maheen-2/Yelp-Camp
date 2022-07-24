if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//🌸 Requiring & Calling Express (API):
const express = require("express");
const app = express();

//not using helmet & atlas bcuz not deploying
// const helmet = require('helmet');

//Setting up Mongo Atlas:
//const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const dbUrl = 'mongodb://localhost:27017/yelp-camp';

// 🌻 Connecting Mongoose and making sure it's connected by catching error:
const mongoose = require("mongoose");
mongoose.connect(dbUrl)
//mongoose.connect(dbUrl) 👈🏼we're not using it right now but it's here u can use it anytime asa second user
    .then(() => {
        console.log("MONGO CONNECTED SUCCESSFULLY!!");
    })
    .catch(err => {
        console.log("MONGO NOT CONNECTED!!")
    })

// 💮 Connecting EJS files in Views folder (API):
const path = require('path');
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// 🌹 Calling and Requiring EJS-MATE for layout (API):
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// 💐 Calling and Requiring SANITIZE  to sanitize the received data, and remove any offending keys, or replace the characters with a 'safe' one:
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

// 🌺 Connecting our Model in 'user.js' file with this main file:
const User = require("./models/user");

//For 3RD ROUTE - B - FOR POSTING AND REQUESTING BODY:
app.use(express.urlencoded({ extended: true }));

//For 4TH ROUTE - B - REQUIRING AND USING METHOD-OVERRIDE (API):
const methodoverride = require("method-override");
app.use(methodoverride('_method'));

// 🌼 Connecting static files with this main file:
app.use(express.static(path.join(__dirname, 'public')));

// 🥀 Requiring an Async Utility(containing error message) and calling this function in app.all("*",..):
const ExpressError = require("./utilities/ExpressError");

// 🌸 Calling and Requiring Session (API):
const session = require("express-session");

//Requiring connect mongo to store session information:
// const MongoStore = require("connect-mongo")(session); //session must be declared before it.
//Using it above sessionConfig inside store variable 💨

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

// const store = new MongoStore({
//     url: dbUrl,
//     secret,
//     touchAfter: 24 * 60 * 60
// });

// store.on("error", function (e) {
//     console.log("SESSION STORE ERROR", e)
// })

const sessionConfig = {
   //store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

//Calling and Requiring Flash (API):
const flash = require("connect-flash");
app.use(flash());
//To comment out multiple lines:Ctr+K+C
 //app.use(helmet());
//I'm not adding Helmet Package in this project. Maybe in later projects I'll. Who knows!
 
// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net/",
//   ];
//   const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
//     "https://cdn.jsdelivr.net/", // adding this helped my bootstrap to be regegonized
//   ];
//   const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
//   ];
//   const fontSrcUrls = [];
 
// app.use(
//     helmet.contentSecurityPolicy({ 
//         directives: { // The CSP header value is made up of one or more directives (defined below) separated with a semicolon
//             defaultSrc: [], // defines the default policy for fetching resources like JS, Imgs, CSS, Fonts, AJAX requests, Frames, HTML5 Media.
//             connectSrc: ["'self'", ...connectSrcUrls], // If not allowed the browser emulates a 400 HTTP status code.
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls], // Defines valid sources of JS.
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls], // Defines valid sources of stylesheets or CSS.
//             workerSrc: ["'self'", "blob:"], // Restricts the URLs which may be loaded as a Worker, SharedWorker or ServiceWorker.
//             objectSrc: [], // Defines valid sources of plugins, eg <object>, <embed> or <applet>.
//             imgSrc: [ // Defines valid sources of images.
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/dyjumbfnt/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls], // Defines valid sources of font resources.
//         },
//    })
// );

//Requiring & Calling Passport (API):
const passport = require("passport"); //Just passport allows us to plugin multiple strategies for authentication.
const localStrategy = require("passport-local"); //passport-local-mongoose only for our model!

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => { //res.locals is universal:
    console.log(req.session);
    res.locals.currentUser = req.user; //currentUser will be called in "nav-bar.ejs" to mek sure that login, logout, register links are shown on a specific condition.
    res.locals.success = req.flash('success'); //"success" & "error" are the keys!
    res.locals.error = req.flash('error');
    next();
})

//🔥 ORDER DOES MATTER! 🔥
//🔥 Connecting campground routes with this main file: 🔥
const campgroundRoutes = require("./routes/campgrounds")
//specify route used in that file & the above name by which it is stored in this file:
app.use("/campgrounds", campgroundRoutes);

//🔥 Connecting review routes with this main file: 🔥
const reviewRoutes = require("./routes/reviews")
//specify route used in that file & the above name by which it is stored in this file:
app.use("/campgrounds/:id/reviews", reviewRoutes);

//🔥 Connecting users routes with this main file: 🔥
const userRoutes = require("./routes/users")
//specify route used in that file & the above name by which it is stored in this file:
app.use("/", userRoutes);

//ROUTE CHECK - JUST FOR CHECK - CRUD:
app.get("/", (req, res) => {
    res.render("campgrounds/home");
})

//For all requests & paths, error:
//Only run if nothing matches!
app.all("*", (req, res, next) => {
    //Since I'm passing this new error to next, it means its goin to hit error handler 🔻 
    next(new ExpressError("Page not found", 404));
})

//LAST ROUTE: Basic Error Handler:
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no, something went wrong!"
    res.status(statusCode).render("errorTemplate", { err });
})

//Setting up the port:
app.listen(3000, () => {
    console.log("Listening to Port 3000! Welcome!!")
})

