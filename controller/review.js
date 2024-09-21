const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.writeReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author=req.user;
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listing/${listing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
}