if(process.env.NODE_ENV !="production") {
    require('dotenv').config();
}


const express = require("express");
const app=express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session")
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter= require ("./routes/user.js")

const { clear } = require("console");
const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to DB");
}).
catch(err =>{
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine(`ejs`,ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const sessionOption =  {
secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
        cookie: {
        expires:Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
}; 
// app.get("/",(req,res)=>{
//     res.send("Hi I am root");
// });


app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error =  req.flash("error");
    res.locals.currUser = req.user;
    
    next();
});

app.get("/demouser",async(req,res)=>{
    let fakeUser = new User({
        email:"student@gmail.com",
        username:"delta-student"
    });

let registeredUser = await User.register(fakeUser,"helloworld");
res.send(registeredUser);
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);

app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});
app.use((err,req, res,next) => {
    let {statusCode=500,message="something went wrong!"} = err;
    res.render("error.ejs",{message});
    // res.status(statusCode).send(message);
});
app.listen(7070,() => {
   console.log("server is listening to port 7070")}
);













// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");
// const session = require("express-session");
// const flash = require("connect-flash");

// // ROUTES
// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");

// // MODELS
// const Review = require("./models/review.js");

// // ✅ CORRECT Mongo URL
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// // DB CONNECTION
// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// // VIEW ENGINE
// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // MIDDLEWARE
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));

// // SESSION
// const sessionOption = {
//   secret: "mysupersecretcode",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//   },
// };

// app.use(session(sessionOption));
// app.use(flash());

// // FLASH MIDDLEWARE
// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   next();
// });

// // ROOT
// app.get("/", (req, res) => {
//   res.send("Server is running 🚀");
// });

// // ROUTES
// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// app.use("/", userRouter);

// // 404 HANDLER
// app.use( (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

// // ERROR HANDLER
// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Something went wrong!" } = err;
//   res.status(statusCode).render("error.ejs", { message });
// });

// // SERVER
// app.listen(7070, () => {
//   console.log("server is listening on port 7070");
// });






































































































































































































// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");
// const session = require("express-session");
// const flash = require("connect-flash");

// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");

// const listings = require("./routes/listing.js");
// const reviews = require("./routes/review.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// // ================= DB =================
// mongoose
//   .connect(MONGO_URL)
//   .then(() => console.log("connected to DB"))
//   .catch((err) => console.log(err));

// // ================= APP CONFIG =================
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.engine("ejs", ejsMate);

// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));

// // ================= SESSION =================
// const sessionOption = {
//   secret: "mysupersecretcode",
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: true,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   },
// };

// app.use(session(sessionOption));
// app.use(flash());

// // ================= PASSPORT =================
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser()); // ✅ FIXED
// passport.deserializeUser(User.deserializeUser()); // ✅ FIXED

// // ================= LOCALS =================
// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   next();
// });

// // ================= ROUTES =================
// app.get("/", (req, res) => {
//   res.send("Hi I am root");
// });

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

// app.use("/listings", listings);
// app.use("/listings/:id/reviews", reviews);

// // ================= ERROR HANDLING =================
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Something went wrong!" } = err;
//   res.status(statusCode).render("error.ejs", { message });
// });

// // ================= SERVER =================
// app.listen(7070, () => {
//   console.log("server is listening on port 7070");
// });
