const mongoose = require("mongoose");
require("dotenv").config();
// Connecting to Database
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Products Database connected");
  })
  .catch((e) => {
    console.log(e);
    console.log("Products Database Falied");
  });
//Creating a new schema
const productschema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Category : {
    type : String,
    required :true
  },
  Image : [{
    type: String,
    required : true
  }],
  Trending:{
    type: Boolean,
    default: false
  },
  Attributes:{
    type: Map,
    of: String
  },
  Rating:{
    type:Number,
    default:1
  },
  Reviews:[
    {
      user: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        required: true,
      },
    }
  ]
});
const collection = new mongoose.model("Products", productschema);
module.exports = collection;
