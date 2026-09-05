const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

let geocodingClient = null;
if (mapToken) {
    try {
        geocodingClient = mbxGeocoding({ accessToken: mapToken });
    } catch (err) {
        console.error("Mapbox init warning:", err.message);
    }
}

// Approximate coordinates helper for common cities / fallback
function getApproxCoordinates(location = "") {
    const loc = location.toLowerCase().trim();
    if (loc.includes("goa")) return [73.8278, 15.2993];
    if (loc.includes("mumbai") || loc.includes("bombay")) return [72.8777, 19.0760];
    if (loc.includes("delhi") || loc.includes("new delhi")) return [77.2090, 28.6139];
    if (loc.includes("jaipur") || loc.includes("rajasthan")) return [75.7873, 26.9124];
    if (loc.includes("bangalore") || loc.includes("bengaluru")) return [77.5946, 12.9716];
    if (loc.includes("manali") || loc.includes("himachal")) return [77.1892, 32.2432];
    if (loc.includes("malibu")) return [-118.7798, 34.0259];
    if (loc.includes("new york") || loc.includes("nyc")) return [-74.0060, 40.7128];
    if (loc.includes("paris")) return [2.3522, 48.8566];
    if (loc.includes("london")) return [-0.1278, 51.5074];
    if (loc.includes("rome") || loc.includes("florence") || loc.includes("tuscany")) return [11.2558, 43.7696];
    if (loc.includes("bali")) return [115.1889, -8.4095];
    if (loc.includes("dubai")) return [55.2708, 25.2048];
    if (loc.includes("tokyo")) return [139.6917, 35.6895];
    if (loc.includes("aspen")) return [-106.8370, 39.1911];
    return [77.2090, 28.6139]; // Default coordinates
}

module.exports.index = async (req, res) => {
    let { search, category } = req.query;
    let query = {};

    if (category && category !== "All") {
        query.category = category;
    }

    if (search && search.trim() !== "") {
        const regex = { $regex: search.trim(), $options: 'i' };
        query.$or = [
            { title: regex },
            { location: regex },
            { country: regex },
            { category: regex }
        ];
    }

    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { 
        allListings, 
        activeCategory: category || "All",
        searchQuery: search || "" 
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    // Calculate average rating
    let avgRating = 0;
    if (listing.reviews && listing.reviews.length > 0) {
        const total = listing.reviews.reduce((acc, curr) => acc + (curr.ratings || 0), 0);
        avgRating = (total / listing.reviews.length).toFixed(1);
    }

    // Ensure valid coordinates exist
    if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length < 2) {
        listing.geometry = {
            type: "Point",
            coordinates: getApproxCoordinates(listing.location || listing.country)
        };
    }

    res.render("listings/show.ejs", { 
        listing, 
        avgRating,
        mapToken: process.env.MAP_TOKEN || ""
    });
};

module.exports.createListing = async (req, res) => {
    if (!req.body.listing) {
        req.flash("error", "Please send valid listing data!");
        return res.redirect("/listings/new");
    }

    let coordinates = getApproxCoordinates(req.body.listing.location);

    if (geocodingClient && req.body.listing.location) {
        try {
            let geoResponse = await geocodingClient
                .forwardGeocode({
                    query: `${req.body.listing.location}, ${req.body.listing.country || ""}`,
                    limit: 1,
                })
                .send();

            if (geoResponse.body.features && geoResponse.body.features.length > 0) {
                coordinates = geoResponse.body.features[0].geometry.coordinates;
            }
        } catch (err) {
            console.error("Geocoding failed, using approximate coordinates:", err.message);
        }
    }

    let url = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=60";
    let filename = "default_listing";

    if (req.file) {
        url = req.file.path;
        filename = req.file.filename;
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = {
        type: "Point",
        coordinates: coordinates,
    };

    if (!newListing.category) {
        newListing.category = "Trending";
    }

    let savedListing = await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect(`/listings/${savedListing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image ? listing.image.url : "";
    if (originalImageUrl && originalImageUrl.includes("/upload")) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    }

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        req.flash("error", "Please provide valid data!");
        return res.redirect("/listings");
    }

    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Update fields
    Object.assign(listing, req.body.listing);

    // Update location coordinates if location changed
    if (req.body.listing.location) {
        let coordinates = getApproxCoordinates(req.body.listing.location);
        if (geocodingClient) {
            try {
                let geoResponse = await geocodingClient
                    .forwardGeocode({
                        query: `${req.body.listing.location}, ${req.body.listing.country || ""}`,
                        limit: 1,
                    })
                    .send();

                if (geoResponse.body.features && geoResponse.body.features.length > 0) {
                    coordinates = geoResponse.body.features[0].geometry.coordinates;
                }
            } catch (err) {
                console.error("Geocoding failed on update:", err.message);
            }
        }
        listing.geometry = {
            type: "Point",
            coordinates: coordinates,
        };
    }

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await listing.save();
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
};
