# QuantumCart


Welcome to our Ecommerce Store! This is a live website where customers can browse and purchase products online. Our store offers a wide range of high-quality products, from electronics and fashion to home goods and accessories.

## Table of Contents

1. Introduction

2. Features
3. Technologies Used
4. Getting Started
5. Installation
6. API's
7. PayPal Sanbox credentials
8. Important Links
9. Frontend Demonstration
10. Support

## Introduction

Our Ecommerce Store provides a convenient and secure platform for customers to shop online. With a user-friendly interface and a wide variety of products, we aim to make online shopping a pleasant experience for everyone. The website is live and can be accessed at [QuantumCart](https://quantumcart.onrender.com).

## Features

- User Registration and Authentication: Customers can create accounts and log in securely(JWT Authentication).
- Product Categories: Products are organized into different categories for easy navigation.
- Product Details: Detailed information about each product is available on its page.
- Shopping Cart: Customers can add items to their carts for future purchase.
- Checkout Process: A smooth checkout process for placing orders and making payments.
- Order History: Users can view their past orders and order statuses.
- Secure Payments: We ensure the safety and security of online transactions with paypal sandbox account.
- Responsive Design: The website is optimized for different devices, including mobile phones and tablets.

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Payment Processing: PayPal
- Deployment: Render

## Getting Started

To run the project locally on your machine, follow these instructions.

## Installation

1. Clone this repository to your local machine.

        https://github.com/spycaptain3/QuantumCart.git
2. Install the required dependencies.

       npm install
3. Start the development server.

       npm start

## API's

Base URL: http://shopnet.onrender.com

1. Authorisation API's

       Signup - METHOD/POST  - "Base URL/signup"
       Login  - METHOD/POST  - "Base URL/login"
       Verify - METHOD/GET   - "Base URL/Verify"
       Logout - METHOD/POST  - "BASE URL/logout"
       Validate-METHOD/POST  - "BASE URL/validate"

2. Cart API's

       Add to Cart     - METHOD/POST   - "Base URL/add_to_cart"
       Fetch Cart      - METHOD/GET    - "Base URL/fetch_cart"
       Remove Cart     - METHOD/POST   - "Base URL/remove_from_cart"
       Change Quantity - METHOD/POST  - "BASE URL/change_quantity"

3. Order API's

       Payment Initiate     - METHOD/POST   - "Base URL/payments/initiate"
       Payment Verification - METHOD/POST   - "Base URL/payments/:orderDatabaseId/verify"
       Order detail         - METHOD/POST   - "Base URL/orders/:orderId"
       All orders           - METHOD/POST   - "BASE URL/orders"
       Cancel Order         - METHOD/POST   - "BASE URL/orders/cancel/:orderId"
       Generate Receipt     - METHOD/GET    - "BASE URL/receipt/:id"

4. Product API's

       Add Product          - METHOD/POST   - "Base URL/add_products"
       Product Details      - METHOD/GET    - "Base URL/products/:productId"
       All Product          - METHOD/GET    - "Base URL/products"
       Category Products    - METHOD/GET    - "BASE URL/products/category/:categoryId"
       Trending Products    - METHOD/GET    - "BASE URL/trending_products"

## Paypal Sanbox Credentials

PayPal Email ID:
      
       sb-lzluu26715056@personal.example.com
PayPal Password:
       
       F12pW#;6

## Links

1. Postman Collection

       https://www.postman.com/orbital-module-engineer-55914537/workspace/shopnet/collection/25555336-77f00d14-0629-4e04-bc7d-32618b60aded?action=share&creator=25555336

2.  MongoDB Database

        https://cloud.mongodb.com/v2/64a3fd82e18e3401eebd97a6#/clusters/detail/ShopNet


## Support

If you have any questions or need assistance, please feel free to contact our support team at `shopnetauthorisation@gmail.com`.

Thank you for using our Ecommerce Store! Happy shopping!
