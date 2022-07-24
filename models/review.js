//This file is specifically created to store review schema which we'll follow:

//requiring mongoose:
const mongoose = require("mongoose");

//We can also define Schema, convert it into model and then export it by using shortcut method which we followed in this file:
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model("Review", reviewSchema);
