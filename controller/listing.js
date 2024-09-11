const Listing = require("../models/listing.js");


module.exports.index = async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}

module.exports.renderNewForm = (req,res)=>{
    
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
    populate:{path:"author"}},)
    .populate("owner");
    
    if(!listing){
        req.flash("error","Does not exist");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listing");
 }

 module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Does not exist");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs",{listing})
}

module.exports.updateListing = async(req,res)=>{
    
    let {id} = req.params;
    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyRoute = async(req,res)=>{
    let {id} = req.params;
    let deleteitem = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listing");
}