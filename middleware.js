const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.IsLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.session.methodUrl=req.method;
        req.session.idUrl=req.params.id;
        req.flash("error","You must be logged in to create new Listing");
        return res.redirect("/login");
    }
    next()
};


module.exports.saveUrl=(req,res,next)=>{
    console.log(req.session.methodUrl,req.session.idUrl);
    if(req.session.redirectUrl && req.methodUrl==="GET"){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    if(req.session.methodUrl==="POST" && req.session.redirectUrl===`/listing/${req.session.idUrl}/booking`){
            // Extract the id from the match
            res.locals.redirectUrl = `/listing/${req.session.idUrl}`;
    }
    next();
    
};



module.exports.IsOwner=async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner");
        return res.redirect(`/listing/${id}`);
    }next();
};
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
};
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
};