const express = require("express");
const router = express.Router();
//Requiring passport for hashing & mekin salt:
const passport = require('passport');
//Connecting our Model in 'user.js' file with this main file:
const User = require("../models/user");
const users = require("../controllers/users");
//Requiring an Async Utility and calling this function in almost every route where we think error is imminent:
const catchAsync = require("../utilities/catchAsync");

router.route("/register")
    //8th ROUTE - A - CREATE A NEW USER (making a form):
    .get(users.renderRegister)
    //8th ROUTE - B - POSTING NEW USER IN THE USERS LIST (form logic):
    .post(catchAsync(users.register));

router.route("/login")
    //9th ROUTE - A - LOGIN A USER (making a form):
    .get(users.renderLogin)
    //9th ROUTE - B - (form logic):
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

//10th ROUTE - LOGGING OUT:
router.get("/logout", users.logout);

module.exports = router;
