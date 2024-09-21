const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");
const Booking = require("./booking.js");
const { string } = require("joi");

const listingSchema = new schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
    },
    image:{
        url: String,
        filename: String,
    },
    price:{
        type: Number,
    },
    location:{
        type: String,
    },
    country: {
        type: String,
    },
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    bookings:[{
        type:schema.Types.ObjectId,
        ref:"Booking",
    },
    ],
        
    owner:{
        type:schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
    
})

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;