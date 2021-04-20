const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const OrderController =  require('../controllers/orders');

const Order = require('../models/order');

router.get('/', checkAuth, OrderController.get_all_orders);

router.post('/', (req,res,next) =>{
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    });
    order
    .save()
    .then(()=>{
        res.status(201).json({
            message: "Order has been added successfully!",
            createdProduct: order
        });
    })
    .catch((err)=>{
        res.status(400).json({
            message: "Bad Request!",
            error: err
        });
    });
});

router.get('/:orderId', (req,res,next) =>{
    const id = req.params.orderId;
    Order.findById(id)
    // .select('_id product quantity')
    .exec()
    .then((doc)=>{
        if(doc){
            res.status(200).json({
                message: "Order has been retrieved successfully!",
                Order: doc
            });
        }
        else{
            res.status(400).json({
                message: "No valid result for this particular object ID!",
            });
        }
        
    }).catch((err)=>{
        res.status(500).json({
            message: "Internal Server Error!",
            error : err
        });
    });
});

router.patch('/:orderId', (req,res,next) =>{
    const id = req.params.orderId;
    // res.json(req.body);
    Order.findOneAndUpdate({_id:id},req.body,{upsert: true})
    .exec()
    .then((doc)=>{
        res.status(200).json({
            message: "Order has been updated successfully!",
            Order: doc
        });
    })
    .catch((err)=>{
        res.status(500).json({
            message: "Internal Server Error!",
            error : err
        });
    });
});

router.delete('/:orderId', (req,res,next) =>{
    const id = req.params.orderId;
    Order.remove({_id:id})
    .exec()
    .then((doc)=>{
        if(doc){
            res.status(200).json({
                message: "Order has been removed successfully!",
                request:{
                    type: "POST",
                    url: "/orders",
                    body:'{"name":String, "sku": String,"price":Number,"currency":String}'
                }
            });
        }
        else{
            res.status(400).json({
                message: "No valid result for this particular object ID!"
            });
        }
        
    }).catch((err)=>{
        res.status(500).json({
            message: "Internal Server Error!",
            error : err
        });
    });
});

module.exports = router;