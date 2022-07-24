//Connecting our Model in 'user.js' file with this main file:
const User = require("../models/user");

//8TH ROUTE - A
module.exports.renderRegister = (req, res) => {
    res.render("users/register")
}
//8TH ROUTE - B
module.exports.register = async (req, res, next) => {
    //doin try/catch even with catchAsync bcuz
    //with  catchAsync incase of an error we r being redirect to another error page ISN'T APPEALING!
    //so we added try/catch: incase of error flash error message will be displayed on the sem page.
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password); // this will hash & mek a salt.
        req.login(registeredUser, err => {// using req.login to actually log the user in after the user registered himself!
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!'); //🌸 called in "index.js" by res.locals.success! Must redirect after it!
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

}
//9TH ROUTE - A
module.exports.renderLogin = (req, res) => {
    res.render("users/login")
}
//9TH ROUTE - B
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds'; // ||means if we go directly to login thenafter that redirct to /campgrounds.
    console.log("return to:", req.session.returnTo) // test
    delete req.session.returnTo; // if page refreshes then has to login again.
    res.redirect(redirectUrl);
}
//10TH ROUTE
module.exports.logout = (req, res) => {
    req.logOut();
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
}