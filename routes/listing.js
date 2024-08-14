const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
const multer=require('multer');
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})
//index route
router.get("/",wrapAsync(listingController.index));
//new route
router.get("/new",isLoggedIn,listingController.renderNewform);
//show route
router.get("/:id",wrapAsync(listingController.show));
//ost route
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createlistings));

//edit route
router.get("/:id/edit",listingController.editlisting)
router.put("/:id",isLoggedIn,upload.single("listing[image]"),isOwner,validateListing,wrapAsync(listingController.updatelisting));
router.delete("/:id",isLoggedIn,isOwner,listingController.deletelisting);

//delete review route


module.exports=router;