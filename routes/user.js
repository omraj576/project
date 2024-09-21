const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Passport = require("passport");
const { saveUrl } = require("../middleware.js");
const controllerListing = require("../controller/user.js");

//signup
router.get("/signup",controllerListing.signup);

//signupValidation
router.post("/signup",wrapAsync(controllerListing.signupValidate));

//login
router.get("/login",controllerListing.login);

//loginValidate
router.post("/login",saveUrl,Passport.authenticate('local', { failureRedirect: '/login',failureFlash:true}),controllerListing.loginValidate);

//logout
router.get("/logout",controllerListing.logout);



module.exports = router;