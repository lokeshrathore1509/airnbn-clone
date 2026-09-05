const mongoose = require("mongoose");
const Listing = require("../models/listing");
const User = require("../models/user");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

const locationCoords = {
    "malibu": [-118.7798, 34.0259],
    "new york city": [-74.0060, 40.7128],
    "aspen": [-106.8370, 39.1911],
    "florence": [11.2558, 43.7696],
    "portland": [-122.6784, 45.5152],
    "cancun": [-86.8515, 21.1619],
    "lake tahoe": [-120.0324, 39.0968],
    "los angeles": [-118.2437, 34.0522],
    "verbier": [7.2286, 46.0968],
    "serengeti": [34.8333, -2.3333],
    "amsterdam": [4.9041, 52.3676],
    "fiji": [178.0650, -17.7134],
    "cotswolds": [-1.8839, 51.8330],
    "scotland": [-4.2026, 56.4907],
    "maui": [-156.3319, 20.7984],
    "goa": [73.8278, 15.2993],
    "mumbai": [72.8777, 19.0760],
    "delhi": [77.2090, 28.6139],
    "jaipur": [75.7873, 26.9124],
    "bali": [115.1889, -8.4095],
    "paris": [2.3522, 48.8566],
    "london": [-0.1278, 51.5074],
    "tokyo": [139.6917, 35.6895],
    "dubai": [55.2708, 25.2048],
    "santorini": [25.4615, 36.3932],
    "phuket": [98.3923, 7.8804],
    "reykjavik": [-21.9426, 64.1466],
    "zermatt": [7.7491, 45.9765],
    "banff": [-115.5708, 51.1784]
};

function determineCategory(listing) {
    const text = `${listing.title} ${listing.description} ${listing.location}`.toLowerCase();
    if (text.includes("mountain") || text.includes("ski") || text.includes("chalet") || text.includes("alps")) return "Mountains";
    if (text.includes("pool") || text.includes("swim") || text.includes("resort")) return "Amazing Pools";
    if (text.includes("castle") || text.includes("villa") || text.includes("palace") || text.includes("historic")) return "Castles";
    if (text.includes("camp") || text.includes("treehouse") || text.includes("cabin") || text.includes("nature")) return "Camping";
    if (text.includes("farm") || text.includes("barn") || text.includes("countryside") || text.includes("ranch")) return "Farms";
    if (text.includes("arctic") || text.includes("snow") || text.includes("ice") || text.includes("glacier") || text.includes("igloo")) return "Arctic";
    if (text.includes("boat") || text.includes("yacht") || text.includes("ship") || text.includes("harbor") || text.includes("lake")) return "Boats";
    if (text.includes("room") || text.includes("loft") || text.includes("apartment") || text.includes("studio")) return "Rooms";
    if (text.includes("city") || text.includes("new york") || text.includes("paris") || text.includes("tokyo") || text.includes("london") || text.includes("dubai")) return "Iconic Cities";
    return "Trending";
}

async function updateExistingData() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB for migration...");

    // Find or create default user for listings without owner
    let user = await User.findOne();
    if (!user) {
        user = await User.create({ email: "admin@wanderlust.com", username: "wanderlust_admin" });
    }

    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings to verify/update.`);

    let updatedCount = 0;
    for (const listing of listings) {
        let changed = false;

        // Ensure owner
        if (!listing.owner) {
            listing.owner = user._id;
            changed = true;
        }

        // Ensure category
        if (!listing.category || listing.category === "Trending") {
            const detected = determineCategory(listing);
            listing.category = detected;
            changed = true;
        }

        // Ensure valid coordinates
        if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length < 2) {
            const locKey = (listing.location || "").toLowerCase().trim();
            let coords = [77.2090, 28.6139]; // Default Delhi

            for (const [key, val] of Object.entries(locationCoords)) {
                if (locKey.includes(key)) {
                    coords = val;
                    break;
                }
            }

            listing.geometry = {
                type: "Point",
                coordinates: coords,
            };
            changed = true;
        }

        if (changed) {
            await listing.save();
            updatedCount++;
        }
    }

    console.log(`Successfully updated ${updatedCount} listings with categories and valid map coordinates!`);
    await mongoose.disconnect();
}

updateExistingData()
    .then(() => console.log("Migration complete!"))
    .catch((err) => console.error("Migration error:", err));
