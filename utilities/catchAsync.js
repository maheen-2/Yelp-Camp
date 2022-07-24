//CLIENT-SIDE VALIDATION:
//We returns a function that accepts a function & then executes a function that catches any error & passes it to next if any.
//func is what we pass in
//returns a new function that has func executed
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}