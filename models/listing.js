const mongoose =require("mongoose");
const Schema = mongoose.Schema;
//Create listingSchema tittle,desciption,image,price,location,country,color these are present in listeningSchema



const listingSchema = new Schema({
title: {
        type:String,
        required:true,
},
    description:String,
 image: {
  //   type: String,
  //   default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
  //   set: v => (v === "" ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60" : v)

       url:String,
       filename:String,
   },




// const listingSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   description: String,
//   image: String,
//   price: Number,
//   location: String,
//   country: String
// });


// image: {
    //     type:String,
    //     // default:
    //     //     "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fhotel&psig=AOvVaw1P0LgVLLSH9pWIken1uskG&ust=1764446587393000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKiF6fTRlZEDFQAAAAAdAAAAABAL",
    //     set:(v) =>
    //         v === "" 
    //     ? "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fhotel&psig=AOvVaw1P0LgVLLSH9pWIken1uskG&ust=1764446587393000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKiF6fTRlZEDFQAAAAAdAAAAABAL"
    //      : v,
    // },
    price:Number,
    location:String,
    country:String,
    color:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",

      },
    ],
    owner: {
             
      type:Schema.Types.ObjectId,
      ref:"User",
    },

   geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true,
    },
    coordinates: {
      type:[Number],
      required:true,

      },
   },
});




//create model by using listingSchema
const Listing = mongoose.model("Listing", listingSchema);

/*module.exports = Listing; ka matlab hota hai:
 Ye file jis variable ko bahar bhejna chahti hai, wo Listing hai.
Short me:
👉 Is file ke bahar Listing ko use kar sakte ho.
👉 Dusri file me require() karke Listing ko import kar loge. */
module.exports = Listing;

