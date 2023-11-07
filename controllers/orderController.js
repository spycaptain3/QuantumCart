const orders = require("../models/orders");
const product = require("../models/product")
const users = require("../models/user")
const cart= require("../models/cart");
const axios = require("axios");
require("dotenv").config();

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_SECRET;

module.exports.order_place = async (req, res) => {
  try {
    // Initialising an order item with default payment status as unverified
    if(req.body.items==null || req.body.address==null)
    return res.status(404).json({success:0,message:"Provide All information correctly"})
    const order_sum = await computeTotal(req.body.items)
    console.log(req.body.items,order_sum)
    if(order_sum==-1)
     return res.status(404).json({success:0, message: "An invalid product is sent, so order can't be placed"})
     if(order_sum==0)
     return res.status(404).json({success:0, message: "Please add something to purchase"})
    const order = await orders.create({
      user: req.user._id,
      products: req.body.items,
      totalAmount: order_sum,
      shippingAddress: req.body.address,
      captureId: ""
    });
    // Generate an access token for merchant or buisness id
    const accessToken = await generateAccessToken();
    // Set up the API request body
    const requestBody = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: `${order_sum}` // Replace with the actual order total
          },
        },
      ],
    };

    // Make the API request to create the payment by hitting the order api of paypal
    const response = await axios.post(
      "https://api.sandbox.paypal.com/v2/checkout/orders",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // Extract the PayPal Order ID from the response
    const paypalOrderId = response.data.id;
    // Return the PayPal Order ID to the frontend
    return res.status(200).json({ success: 1,orderId: paypalOrderId, orderDatabaseId: order._id });
  } catch (error) {
    console.error("Error initiating payment:", error);
    // Handle any errors during the payment initiation process
    return res.status(500).json({ success: -1,error: "Payment initiation error" });
  }
};
module.exports.payment_verify = async (req, res) => {
  // Fetch the order id whose payment has to be verified
  const paypalOrderId = req.body.orderId
  const cart_payment = req.body.cartPayment
  const orderDatabaseId = req.params.orderDatabaseId
  try {
    // Generate access token
    const accessToken = await generateAccessToken();

  
      // Hit capture api to verify the payment
      const response = await axios.post(
        `https://api.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}/capture`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      // Check the payment status from the response
      const status = response.data.status;
      if (status === "COMPLETED") {
        // Update the order status in database to verified
        const result = await orders.findOne({ _id: orderDatabaseId })
        result.paymentVerified = true
        result.status = "Inventory"
        if(cart_payment)
        {
          const cart_data = await cart.findOne({userId:req.user._id})
          cart_data.items = {}
          cart_data.total =0
          cart_data.markModified('items');
          await cart_data.save()
        }
        result.captureId = response.data.purchase_units[0].payments.captures[0].id
        await result.save()
        // Payment captured successfully
        console.log("True")
        return res.status(200).json({ success: true });
      } else {
        // Payment capture failed
        return res.status(500).json({ success: false });
      } 
  } catch (error) {
    console.error("Error verifying payment:", error);
    // Handle any errors during the payment verification process
    return res
      .status(500)
      .json({ success: false, error: "Payment verification error" });
  }
};
module.exports.get_single_order_details = async (req, res) => {
  try {
    const orderId = req.params.orderId
    const userId = req.user._id

    if(!orderId)
    return res.status(404).json({message : "Please specify the order Id"})

    const result = await orders.findOne({ _id: orderId, user: userId })
    if (!result)
      return res.status(400).json({ message:"No Order with the given id is asociated with this user"})
    else {
      return res.status(200).json({order :result })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Server Error" })
  }
}
module.exports.cancel_order = async(req,res) => {
  try {
    const orderId = req.params.orderId
    const userId = req.user._id

    if(!orderId)
    return res.status(404).json({message : "Please specify the order Id to be canceled"})

    const result = await orders.findOne({ _id: orderId, user: userId })
    if (!result)
      return res.status(400).json({ message:"No Order with the given id is asociated with this user"})
    else {
      result.status = "Cancel"
      result.paymentVerified=false
      const captureId = result.captureId
      const accessToken = await generateAccessToken(); 
      const response = await axios.post(
        `https://api.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, 
          },
        }
      ); 
      console.log("payment refunded",response.data)
      // console.log(response.data)
      await result.save()
      return res.status(200).json({orderId : result._id , message : "Your order has been successfully Canceled" })
    }
  } catch (err) {
    console.log(err.data)
    res.status(400).json({ message: "Server Error" })
  }
}
module.exports.get_all_order_details = async (req,res) =>{
  try{
    const userId = req.user._id
    const result = await orders.find({"user" : userId})
    res.status(200).json({message : "Details Fetched Successfully", orders : result})

  }catch(err)
  {
    console.log(err)
    res.status(404).json({message : "Server Error Occured"})
  }
}

module.exports.change_status = async(req,res) =>{
  try {
    const orderId = req.params.orderId
    const userId = req.user._id
    const status = req.body.status
    if(!orderId)
    return res.status(404).json({message : "Please specify the order Id to be canceled"})

    const result = await orders.findOne({ _id: orderId, user: userId })
    if (!result)
      return res.status(400).json({ message:"No Order with the given id is asociated with this user"})
    else {
      result.status = status
      await result.save()
      return res.status(200).json({orderId : result._id , message : `Your Order Status Has Changed to ${status}` })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Server Error" })
  }
}
module.exports.get_receipt = async(req,res)=>{
  const orderId = req.params.id
  const order = await orders.findOne({_id:orderId})
  let products=[]
  for(let i=0;i<order.products.length;i++)
    products.push(await product.findOne({_id: order.products[i].product}))
  const user = await users.findOne({_id:order.user})
  return res.render("receipt",{order,products,user})
}
// Function to generate access token for our merchant id
async function generateAccessToken() {
  // Hitting the paypal api to generate access token
  const response = await axios.post(
    "https://api.sandbox.paypal.com/v1/oauth2/token",
    `grant_type=client_credentials`,
    {
      auth: {
        username: clientId,
        password: clientSecret,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  // Return the access token returned by the api
  return response.data.access_token;
}

async function computeTotal(items){
  let sum=0
  for(let i=0;i<items.length;i++)
  { 
    const result = await product.findOne({_id : items[i].product})
    if(!result)
    return -1;
    else
    sum += (result.Price * items[i].quantity)
  }
  return sum
}
