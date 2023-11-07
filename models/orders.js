const mongoose = require("mongoose");
require("dotenv").config();
// Connecting to database
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Orders Database connected");
  })
  .catch((e) => {
    console.log(e);
    console.log("Orders Database Falied");
  });
//Creating a new schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  status : {
   type: String,
   required : true,
   enum : ["Unverified" ,"Inventory" , "Shipped" ,"OutForDelievery" , "Delierverd", "Cancel"],
   default : "Unverified",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentVerified: {
    type: Boolean,
    required: true,
    default : false
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  captureId : {
    type: String,
    default : ""
  }
});
const collection = new mongoose.model("Orders", orderSchema);
module.exports = collection;
