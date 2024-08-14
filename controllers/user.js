const User=require("../models/user.js")
module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs")
}
module.exports.renderlogin=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newuser=new User({username,email})
    const reguser=await User.register(newuser,password);
    console.log(reguser);
    req.login(reguser,(err)=>{
      if(err)return next(err);
      req.flash("success","welcome to wanderlust!");
      res.redirect("/listings");
    })
    
    }catch(err){
      req.flash("error",err.message);
      res.redirect("/signup");
    }
}  
module.exports.login=async(req,res)=>{
    req.flash("welcome to wanderlust!");
    let redirecturl=res.locals.redirectUrl||"/listings";
    res.redirect(redirecturl);
 }
 module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","you are logged out");
      res.redirect("/listings");
    })
  }