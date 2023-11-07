// This utility function help us in adding different products to out product database
const product = require("../models/product");

 module.exports.addProduct = async (req,resp) => {
  try {
    const result = await product.create({
      Name: req.body.name,
      Price: req.body.price,
      Category: req.body.category,
      Image : req.body.image,
      Trending: req.body.trending,
      Attributes: req.body.attributes,
      Reviews: req.body.reviews
      
    });
    resp.status(200).json({message : "Product added successfully",result})
  } catch (error) {
    console.log("Some Error Occured ", error);
    resp.status(404).json({message:"Some Error Occured"})
  }
};

module.exports.get_product_details = async(req,resp) =>{
  try{
  const productId = req.params.productId
  if(!productId)
  return resp.status(200).json({success:0,message:"Please Specify Product Id"})
  const details = await product.findOne({_id : productId})
  if(!details)
  return resp.status(200).json({success:0,message:"No Such Product Exists"})
  return resp.status(200).json({success:1, product: details})
  }catch(err)
  {
    console.log("Some Error Occured",err)
    return resp.status(404).json({success:-1,message : "SERVER ERROR OOCCURED"})
  }
}

module.exports.get_all_product_details = async(req,resp) =>{
  try {
    const products = await product.find();
    resp.status(200).json({products});
  } catch (err) {
    console.error('Error retrieving products:', err);
    resp.status(500).send('Internal Server Error');
  }
}
module.exports.get_category = async(req,res)=>{
   try{
    const category = req.params.category
    if(!category)
    return res.status(404).json({success:0,message: "Specify Category Please"})
    const result = await product.find({Category : category})
    if(!result)
    return res.status(404).json({success:0,message: "No product in this category"})
    return res.status(200).json({success:1,message:"Products under this category fetched successfully",products:result})
   }catch(err){
   console.log("Some error occured",err)
   return res.status(404).json({success:-1, message: "SERVER ERROR OCCURED"})
   }
}
module.exports.get_trending = async(req,res)=>{
  try{
   const result = await product.find({"Trending": true})
   if(!result)
   return res.status(404).json({success:0,message: "No Products Trending right now"})
   return res.status(200).json({success:1,message:"Products under this category fetched successfully",products:result})
  }catch(err){
  console.log("Some error occured",err)
  return res.status(404).json({success:-1, message: "SERVER ERROR OCCURED"})
  }
}