const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:maptoken});


//index route
module.exports.index=async(req,res)=>{
    const alllisting=await Listing.find({});
    res.render("listings/index.ejs",{alllisting});
}
//new route
module.exports.renderNewform=(req,res)=>{
    res.render("listings/new.ejs");
}
//show route
module.exports.show=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you request for does not exist")
        req.redirect("/listings");
    }
    res.render("listings/Show.ejs",{listing});
}
//post route
module.exports.createlistings=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
       
    let url=req.file.path;
    let filename=req.file.filename;
    const Lists = new Listing(req.body.listing); 
    Lists.owner=req.user._id;
    Lists.image={url,filename};
    Lists.geometry=response.body.features[0].geometry;
    console.log(response.body.features[0].geometry);
    let savedlisting=await Lists.save();
    console.log(savedlisting);
    req.flash("success","New Listing created!")
    res.redirect("/listings");

}
//update route
module.exports.editlisting=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you request for does not exist")
        req.redirect("/listings");
    }

    let originalimageurl=listing.image.url;
    //originalimageurl=originalimageurl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing,originalimageurl});
}
module.exports.updatelisting=async(req,res)=>{
    let {id}=req.params;
    
    let list=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      list.image={url,filename};
      await list.save();
    }
    req.flash("success","Listing Updated");
    res.redirect("/listings");
}
module.exports.deletelisting=async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findByIdAndDelete(id);
    console.log(list);
    req.flash("success","Listing Deleted");
    res.redirect("/listings")
} 