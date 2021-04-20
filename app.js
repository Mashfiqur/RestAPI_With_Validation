const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//Database Connection
mongoose.connect('mongodb://localhost:27017/TutorialAPI',{useNewUrlParser:true, useUnifiedTopology:true});

// Routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); // Not extended the urlencoded value
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin,X-Requested-With, Content-Type,Accept,Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, PATCH, POST, GET,DELETE');
        return res.status(200).send({});
    }
    next();
})

//Base Route
app.get('/', (req,res,next) =>{
    res.status(200).json({
        message: "Welcome to the Restful API!"
    });
});

//Products Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);


// Handling errors

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