//requiring mongoose:
const mongoose = require("mongoose");

//requiring passport-local-mongoose:
const passportLocalMongoose = require("passport-local-mongoose");

//to simplify:
const Schema = mongoose.Schema;

const userSchema = new Schema({
    //In thois schema,we technically need username, email and a password but inside the schema we'll only specify the email! WHYYY??😲
    email: {
        type: String,
        required: true,
        unique: true //not a validation, JUST A REMINDER
    }
})
//BCUZ instead we'll pass password local mongoose inside userSchema.plugin 
//You're free to define your User how you like.
// But Passport-Local-Mongoose will add a username, password field to store the username, the hashed password and the salt value.
//it'll mek sure the username is unique & also add other methods to our Schema that we can use!
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);