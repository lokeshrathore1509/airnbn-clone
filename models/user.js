const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema ({
    email: {
        type:String,
        required:true,
        unique:true
},
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // 👇 IMPORTANT FIX
// const passportLocalMongoose =
//   require("passport-local-mongoose").default ||
//   require("passport-local-mongoose");

// const userSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
// });

// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", userSchema);







// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
// });

// // ❗ plugin MUST be function
// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", userSchema);



// const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true
//   }
// });

// // ✅ plugin hamesha schema ke baad
// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", userSchema);



// const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true
//   }
// });

// // ✅ YAHI LINE SABSE IMPORTANT HAI
// userSchema.plugin(passportLocalMongoose); // ❌ () MAT lagana

// module.exports = mongoose.model("User", userSchema);




// const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
// });

// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", userSchema);


// const mongoose = require("mongoose");
// const passportLocalMongoose =
//   require("passport-local-mongoose").default ||
//   require("passport-local-mongoose");

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
// });

// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", userSchema);















// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");

// console.log("PLM type:", typeof passportLocalMongoose);

// const userSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
// });

// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", userSchema);
