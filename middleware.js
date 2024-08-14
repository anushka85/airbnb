const Listing=require("./models/listing.js");
const Review=require("./models/review.js")
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
       return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
   if(req.session.redirectUrl){
    // we are doing this because after saving or log in passport by default reset the session]
    res.locals.redirectUrl=req.session.redirectUrl;
   }
   next();
}
module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("error","you dont have permission ");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.curruser._id)){
        req.flash("error","you dont have permission ");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}