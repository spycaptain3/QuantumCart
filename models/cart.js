const mongoose = require("mongoose");
require("dotenv").config();
// Connecting to database
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Cart Database connected");
  })
  .catch((e) => {
    console.log(e);
    console.log("Cart Database Falied");
  });
//Creating a new schema
const cartchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: {
    type: Object,
    required : true,
    default : {}
  },
  total:{
    type:Number,
    default:0
  }
});
const collection = new mongoose.model("Carts", cartchema);
module.exports = collection;
