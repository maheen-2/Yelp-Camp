//This file is specifically created to store mongoose schema which we'll follow:

//requiring mongoose:
const mongoose = require("mongoose");
//requiring review model:
const Review = require('./review')

//We can also define Schema, convert it into model and then export it by using shortcut method which we followed in this file:
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

// Setting options true to include JSON for cluster map popup:
const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    reviews: [
        {
            //Reviews on each campground:
            type: Schema.Types.ObjectId, ref: "Review"
        }
    ]
}, opts); // passing opts to schema

// Adding virtual property of cluster map popup:
campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

//For deleting campgrounds as well as the reviews associated with it:
//post instead of pre to access what we r meant to delete.
campgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})



module.exports = mongoose.model("Campground", campgroundSchema);

