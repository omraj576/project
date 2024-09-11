const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, IsLoggedIn} = require("../middleware.js")
const ExpressError = require("../utils/ExpressError");
const controllerListing = require("../controller/review.js");


router.post("/",IsLoggedIn,validateReview,wrapAsync(controllerListing.writeReview));

//delete review
router.delete("/:reviewId",IsLoggedIn,wrapAsync(controllerListing.destroyReview));

module.exports = router;