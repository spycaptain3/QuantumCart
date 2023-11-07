const express = require('express');
const router = express.Router();
const middleware = require('../utilities/middleware');
const cartController = require('../controllers/cartController')

router.post('/add_to_cart', middleware, cartController.addtocart);

router.get('/fetch_cart',middleware,cartController.fetchcart)

router.post('/remove_from_cart',middleware,cartController.removeFromCart)

router.post('/change_quantity',middleware , cartController.changeQuantity )

module.exports = router;