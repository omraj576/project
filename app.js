if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStartegy = require("passport-local");
const User = require("./models/user.js");
const users = require("./routes/user.js");
const Booking = require("./models/booking.js");
const { IsLoggedIn,saveUrl } = require('./middleware.js');






main().then(()=>{
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wonderlust');

};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended :true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// const store = MongoStore.create(
//     {
//         mongoUrl:dbUrl,
//         crypto:{
//             secret:process.env.SECRET,
//         },
//         touchAfter:24*3600,
//     });


const sessionOption ={
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
})







//listing
app.use("/listing",listings);

//review
app.use("/listing/:id/reviews",reviews);

app.use("/",users);


app.post("/listing/:id/booking" ,saveUrl,IsLoggedIn,async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    const newBooking = new Booking(req.body.booking);
    newBooking.bookedBy=req.user;
    newBooking.listingId = listing.id;
    listing.bookings.push(newBooking);
    console.log(newBooking);
    console.log(listing.id);
    let nwbook = await newBooking.save();
    // let redirectUrl=res.locals.redirectUrl || "/listing";
    // res.redirect(redirectUrl);
    res.render("listings/booking.ejs",{nwbook,listing});
});
app.delete("/listing/:id/booking/:bookingId",IsLoggedIn,async(req,res)=>{
    let {id,bookingId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{bookings:bookingId}});
    await Booking.findByIdAndDelete(bookingId);

    res.redirect(`/listing/${id}`);
})

// const alllistingshow = async(req,res)=>{
//     try{
//         var search = '';
//         if(req.query.search){
//             search = req.query.search

//         }
//         const searchListing = await Listing.find({
//             $or:[
//                 {title:{$regex:'.*'+search+'.*',$option:'i'}},
//                 {description:{$regex:'.*'+search+'.*',$option:'i'}},
//                 {price:{$regex:'.*'+search+'.*',$option:'i'}},
//                 {location:{$regex:'.*'+search+'.*',$option:'i'}},
//                 {country:{$regex:'.*'+search+'.*',$option:'i'}}
//             ]
//         })
//     }catch(err){
//         console.log(err.message);
//     }
// }



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let{ statusCode=500, message="something Went Wrong" } = err;
   
    res.status(statusCode).render("error.ejs",{err});
});

app.listen(8080,()=>{
    console.log("listening port 8080");
});
