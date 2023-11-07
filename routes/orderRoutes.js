const express = require('express')
const router = express.Router()
const middleware = require('../utilities/middleware')
const orderController = require('../controllers/orderController')

router.post('/payments/initiate', middleware , orderController.order_place)
router.post('/payments/:orderDatabaseId/verify', middleware , orderController.payment_verify)
router.post('/orders/:orderId',middleware,orderController.get_single_order_details)
router.post('/orders/cancel/:orderId',middleware , orderController.cancel_order)
router.post('/orders',middleware , orderController.get_all_order_details)
router.get('/receipt/:id',middleware,orderController.get_receipt)
// I will make a new middleware for the people with admin perms so that it can be only changed when the orders get shiiped or delieverd etc but as of now I am creating a route with the user middleware
router.post('/orders/changeStatus/:orderId',middleware,orderController.change_status)
module.exports = router