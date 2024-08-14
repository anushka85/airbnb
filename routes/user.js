const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const wrapAsync=require("../utils/wrapAsync");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");
router.get("/signup",userController.signup)
router.post("/signup",wrapAsync(userController.signup))
router.get("/login",userController.renderlogin)
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login)
router.get("/logout",userController.logout)
module.exports=router;