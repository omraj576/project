const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { IsLoggedIn, IsOwner,validateListing } = require("../middleware.js");
const controllerListing = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});





//index
router.get("/",wrapAsync(controllerListing.index));


//new route
router.get("/new",IsLoggedIn,controllerListing.renderNewForm);


//show route
router.get("/:id",wrapAsync(controllerListing.showListing));
//create route
router.post("/",IsLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(controllerListing.createListing)
);

//update route
router.get("/:id/edit",IsLoggedIn,wrapAsync(controllerListing.renderEditForm));

router.put("/:id",IsLoggedIn,IsOwner,upload.single('listing[image]'),validateListing,wrapAsync(controllerListing.updateListing));
//delete route
router.delete("/:id",IsLoggedIn,IsOwner,wrapAsync(controllerListing.destroyRoute));

module.exports = router;