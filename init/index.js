const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

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
    "tokyo": [139.6917, 35.6895],
    "dubai": [55.2708, 25.2048]
};

function getCategory(item) {
    const text = `${item.title} ${item.description} ${item.location}`.toLowerCase();
    if (text.includes("mountain") || text.includes("ski") || text.includes("chalet") || text.includes("alps")) return "Mountains";
    if (text.includes("pool") || text.includes("swim") || text.includes("resort")) return "Amazing Pools";
    if (text.includes("castle") || text.includes("villa") || text.includes("palace") || text.includes("historic")) return "Castles";
    if (text.includes("camp") || text.includes("treehouse") || text.includes("cabin") || text.includes("nature")) return "Camping";
    if (text.includes("farm") || text.includes("barn") || text.includes("countryside")) return "Farms";
    if (text.includes("arctic") || text.includes("snow") || text.includes("ice") || text.includes("glacier")) return "Arctic";
    if (text.includes("boat") || text.includes("yacht") || text.includes("ship")) return "Boats";
    if (text.includes("room") || text.includes("loft") || text.includes("apartment")) return "Rooms";
    if (text.includes("city") || text.includes("new york") || text.includes("paris") || text.includes("tokyo")) return "Iconic Cities";
    return "Trending";
}

const initDB = async () => {
    await main();
    console.log("Connected to DB");

    let user = await User.findOne();
    if (!user) {
        user = await User.create({ email: "host@wanderlust.com", username: "wanderlust_host" });
    }

    await Listing.deleteMany({});

    const formattedData = initData.data.map((obj) => {
        const locKey = (obj.location || "").toLowerCase().trim();
        let coords = [77.2090, 28.6139];
        for (const [k, v] of Object.entries(locationCoords)) {
            if (locKey.includes(k)) {
                coords = v;
                break;
            }
        }

        return {
            ...obj,
            owner: user._id,
            category: obj.category || getCategory(obj),
            geometry: {
                type: "Point",
                coordinates: coords,
            },
        };
    });

    await Listing.insertMany(formattedData);
    console.log("Database initialized with structured listing data!");
    await mongoose.disconnect();
};

if (require.main === module) {
    initDB().catch(console.error);
}

module.exports = initDB;
