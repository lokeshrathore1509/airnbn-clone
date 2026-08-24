const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing =require("../models/listing.js");
const {isLoggedIn,isOwner} = require("../middleware.js");


const listingController = require("../controllers/listings.js");
const multer =require('multer');
const {storage} = require("../cloudConfig.js");

const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))


.post(isLoggedIn, upload.single("listing[image]"),
    wrapAsync(listingController.createListing ));
























 //   new route
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.route("/:id")
.get( wrapAsync (listingController.showListings)
)
// .put(isLoggedIn,isOwner, wrapAsync(listingController.updateListing))

.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
)








.delete( isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



//edit route 

router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm)
);





// // NEW route sabse upar
// router.get("/new", isLoggedIn, listingController.renderNewForm);

// // ID routes uske baad
// router.route("/:id")
//   .get(wrapAsync(listingController.showListings))
//   .put(isLoggedIn, isOwner, wrapAsync(listingController.updateListing))
//   .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// // Edit route
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));




























module.exports = router;