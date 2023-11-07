// Endpoint Related to Create Product in product database

const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

router.post('/add_product',productController.addProduct)
router.get('/products/:productId',productController.get_product_details)
router.get('/products',productController.get_all_product_details)
router.get('/products/category/:category',productController.get_category)
router.get('/trending_products',productController.get_trending)
module.exports = router