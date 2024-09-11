const User = require("../models/user.js");

module.exports.signup = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signupValidate = async(req,res)=>{
    try{
        let {username,password,email} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success","Welcome to wonderlust");
    res.redirect("/listing");
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }

    
}

module.exports.login = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginValidate = async(req,res)=>{
    req.flash("success","welcome to wonderlust you logged in");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);

}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","logout");
        res.redirect("/listing");
    });
}