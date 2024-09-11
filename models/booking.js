const { date, number } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;


const bookingSchema = new schema({
    checkIn:{
        type:Date
    },
    checkOut:{
        type:Date
    },
    guest:{
        type:Number
    },
    bookedBy:{
        type:schema.Types.ObjectId,
        ref:"User"
    },
    listingId:{
        type:schema.Types.ObjectId,
        ref:"listing"
    }
})

module.exports = mongoose.model("Booking",bookingSchema);