const express = require('express');
const app = express();
const morgan = require('morgan');

// Routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

//Base Route
app.get('/', (req,res,next) =>{
    res.status(200).json({
        message: "Welcome to the Restful API!"
    });
});

//Products Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// If no routes are matched
app.use((req, res, next)=>{
    const error = new Error("Oops! Endpoint doesn't found.");
    error.status = 404;
    next(error);
});

//If any error occured in the app
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});


module.exports = app;