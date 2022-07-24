//We'll run this file on its own seperately from node anytime we want to see our databases.
//(i-e. run whenever we make changes to our model or to our data).


//Connecting Mongoose and making sure it's connected by catching error:
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp-camp")
    .then(() => {
        console.log("DATABASE CONNECTED SUCCESSFULLY!!");
    })
    .catch(err => {
        console.log("DATABASE NOT CONNECTED!!")
    })

//Requiring 'cities' file bcuz we gonna use that in this file:
const cities = require("./cities");

//Connecting our Model in 'campground.js' file with this main file:
const Campground = require("../models/campground");

//Connecting our Model in 'seedHelpers.js' file with this main file:
//Doin it in destructive way:
const { places, descriptors } = require("./seedHelpers");

//To run this code, 1st: On BASH, type 'node seeds/index.js '--> 'DATABASE CONNECTED SUCCESFULLY' POPS UP.
//2nd, On MONGO, type 'use yelp-camp' then 'db.campgrounds.find()' --> UPTO 50 CAMPGROUND'S LOCATIONS POP UP.


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;


        //I can't understand why we made sample a function & use it this way 😥 PLZ Explain Me Some Day:
        const sample = array => array[Math.floor(Math.random() * array.length)];
        //HardCoding all the keys defined in the Schema:
        const camp = new Campground({
            //Author of Schema defined (my ID):
            author: "62ce70364f84b436ee21ff2a", //copy 1 of the userID of the registered user.
            //Location of Schema defined:
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            //Title of Schema defined:
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, aliquam. Repudiandae natus est cupiditate obcaecati maiores libero eius non, minima rerum vel incidunt aperiam expedita facere veritatis quasi sit architecto! Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, aliquam. Repudiandae natus est cupiditate obcaecati maiores libero eius non, minima rerum vel incidunt aperiam expedita facere veritatis quasi sit architecto!',
            price,
            geometry: {
                type: "Point",
                coordinates: [ // longitude first, latitude second
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dyjumbfnt/image/upload/v1658121789/YelpCamp/opcdypeyx6et64m0c8qs.jpg',
                    filename: 'YelpCamp/opcdypeyx6et64m0c8qs'
                },
                {
                    url: 'https://res.cloudinary.com/dyjumbfnt/image/upload/v1658121791/YelpCamp/ggqcuqfjp2xzslt5gxjc.jpg',
                    filename: 'YelpCamp/ggqcuqfjp2xzslt5gxjc'
                },
                {
                    url: 'https://res.cloudinary.com/dyjumbfnt/image/upload/v1658121793/YelpCamp/zry18dbkgc8ahhnviaez.jpg',
                    filename: 'YelpCamp/zry18dbkgc8ahhnviaez'
                }
            ]
        })
        await camp.save();
    }
}

//Open database connection by:
seedDB();

//To close our database connection:
//seedDB().then(() => {
  //  mongoose.connection.close();
