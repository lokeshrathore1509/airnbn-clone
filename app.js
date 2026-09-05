if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

mongoose.set('strictQuery', true);

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log("Connected to MongoDB Database");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

// View Engine Setup
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session Configuration
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "wanderlustsupersecretkey987",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Authentication Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & Current User Locals Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Root Route: Redirects directly to listings
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Informational Pages
app.get("/privacy", (req, res) => {
    res.render("pages/privacy.ejs");
});

app.get("/terms", (req, res) => {
    res.render("pages/terms.ejs");
});

// Demo User route for testing
app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "student@wanderlust.com",
        username: "wanderlust-demo",
    });
    try {
        let registeredUser = await User.register(fakeUser, "demo1234");
        res.send(registeredUser);
    } catch (e) {
        res.send(e.message);
    }
});

// Application Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 Route Handler
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Global Error Handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

const port = process.env.PORT || 7070;
app.listen(port, () => {
    console.log(`Server is running smoothly on port ${port} 🚀`);
});

module.exports = app;
