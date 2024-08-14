require('dotenv').config();
console.log(process.env.SECRET)
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejs=require("ejs");
const ExpressError=require("./utils/ExpressError.js");
const listings=require("./routes/listing.js")
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js")
const user=require("./routes/user.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
const reviews=require("./routes/review.js")
app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsMate);
const flash=require("connect-flash")
var session=require("express-session")
const dbUrl=process.env.ATLASDB_url;
async function main(){
await mongoose.connect("mongodb://127.0.0.1:27017/wander")
}
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
//same session me login rhe uske liye
passport.serializeUser(User.serializeUser());
//session htne k baad logout hone k liye
passport.deserializeUser(User.deserializeUser());
main().then(()=>{
    console.log("connect");
}).catch((err)=>{
    console.log(err);
})

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
})

app.use("/listings",listings);
//reviews post route

app.use("/listings/:id/reviews",reviews)
app.use("/",user);

// app.get("/",(req,res)=>{
//     res.send("hii");
// })
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
})
app.listen(8000,(req,res)=>{
    console.log("hii i am listening");
})