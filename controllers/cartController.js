const Cart = require("../models/cart");
const Product = require('../models/product')

module.exports.addtocart = async (req, res) => {
  try {
    // Fetching user details after it being passed through the middlare 
    const userId = req.user._id
    console.log(userId)
    const itemsArray = req.body.items
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ userId, items: {} });
    }
  
    // Update the cart items
    let { items} = cart;
    for (const item of itemsArray) {
      const { productId, quantity } = item;
     
      const product = await Product.findOne({_id:productId})
  
      cart.total += quantity * product.Price
      if (items.hasOwnProperty(productId)) {
        items[productId] += quantity;
      } else {
        items[productId] = quantity;
      }
    }
    
   cart.markModified('items');
    await cart.save();
    return res.status(200).json({message:"Items Added Successfully",cart : cart})
    
  } catch (err) {
    console.log("Error Occured ", err);
    res.status(404).json({ message: "Server Error Occured" });
  }
};

module.exports.fetchcart = async (req, res) => {
  try {
    // Tracking id of the user whose cart has to be fetched
    const userId = req.user._id;
    // Finding the cart associated with the user
    const result = await Cart.findOne({ userId });
    if (!result) {
      // If there is no cart associated with account
      return res
        .status(200)
        .json({ success:0,message: "This user has no items in his cart", TotalPrice: 0 });
    } else {
      // If cart is associated,return it
      return res
        .status(200)
        .json({
          success:1,
          message: "Cart Items Fetched successfully",
          cart:result
        });
    }
  } catch (err) {
    // In case an error occurs
    console.log(err)
    return res.status(400).json({success:-1, message: "Server Error Occured" });
  }
};

module.exports.removeFromCart = async (req,res) => {
  try{
    const user_cart = await Cart.findOne({userId : req.user._id})
    if(!user_cart)
    res.status(404).json({message: "No cart is associated with this user"})
    const productId = req.body.productId
    const product = await Product.findOne({_id: productId})
    user_cart.total -= user_cart.items[productId] *product.Price 
    delete user_cart.items[productId]
    user_cart.markModified('items');
    await user_cart.save()
    return res.status(200).json({message: "Product Removed Successfully" , UpdatedCart: user_cart.items, TotalPrice: user_cart.total})
  }catch(error)
  {
    console.log("Error: ",error)
    res.status(404).json({message: "SERVER ERROR OCCURED"})
  }
}

module.exports.changeQuantity = async(req,res) => {
  try {
    const userId = req.user._id
    const productId = req.body.productId
    const new_quantity = req.body.quantity
    if(!userId)
    return res.status(404).json({message : "Please Specify User",success:0})
    const cart=await Cart.findOne({userId : userId})
    if(new_quantity < 0 )
    return res.status(404).json({message: "Quantity Can't be negative",success:0})
    if(!cart.items.hasOwnProperty(productId))
      return res.status(404).json({message: "This item do not exist in the cart",success:0})
    else
    {
      const product = await Product.findOne({_id: productId})
      cart.total -= product.Price*cart.items[productId]
      cart.items[productId] = new_quantity
      cart.total += product.Price*new_quantity
      cart.markModified('items');
      await cart.save()
      return res.status(200).json({message : "Cart Successfully Updated" ,success:1, TotalPrice : cart.total})
    }
      
  } catch (error) {
    console.log("Some Error Occured ",error)
    return res.status(404).json({message:"SERVER ERROR OCCURED" , success:-1})
  }
}