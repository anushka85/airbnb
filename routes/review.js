const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Reviews=require("../models/review.js");
const Listing=require("../models/listing.js");
const reviewController=require("../controllers/review.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createreview));
router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewController.deletereview))
module.exports=router;