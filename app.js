const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const ApiError = require("./app/api-error");
const productsRouter= require("./app/routes/product.route");
const usersRouter= require("./app/routes/user.route");
const ordersRouter= require("./app/routes/order.route");
const app = express();
require('dotenv').config()
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/api/products',productsRouter);
app.use('/api/users',usersRouter);
app.use('/api/orders',ordersRouter);


app.use((req,res,next)=>{
    return next(new ApiError(404, "Resource Not Found"));
})

app.use((err,req,res,next)=>{
    return res.status(err.statusCode||500).json({message: err.message||"Internal Server Error"})
})

module.exports = app;