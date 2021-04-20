const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function (req, file, cb){
        cb ( null, Date.now() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', (req,res,next) =>{
    Product.find()
    .select('sku price currency productImage')
    .exec()
    .then((doc)=>{
        const count_products = doc.length;
        if(count_products > 0){
            res.status(200).json({
                message: "Products have been retrieved successfully!",
                count : count_products,
                // Product: doc
                Products: doc.map(singleDoc => {
                return{
                    _id: singleDoc._id,
                    sku: singleDoc.sku,
                    price: singleDoc.price,
                    Image:{
                        type: "GET",
                        url: "http://127.0.0.1:5000/"+singleDoc._id
                    },
                    request:{
                        type: "GET",
                        url: "http://127.0.0.1:5000/products/"+singleDoc.productImage
                    }
                }    
                })
            });
        }
        else{
            res.status(404).json({
                message: "No ENtries Found!",
            });
        }
        
    }).catch((err)=>{
        res.status(500).json({
            message: "Internal Server Error!",
            error : err
        });
    });
});

router.post('/',upload.single('productImage') , (req,res,next) =>{
   
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        sku: req.body.sku,
        price: req.body.price,
        currency: req.body.currency,
        productImage: req.file.path
    });
    product
    .save()
    .then(()=>{
        res.status(201).json({
            message: "Product has been added successfully!",
            createdProduct: product
        });
    })
    .catch((err)=>{
        res.status(400).json({
            message: "Bad Request!",
            error: err
        });
    });
    
});

router.get('/:productId', (req,res,next) =>{
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then((doc)=>{
        if(doc){
            res.status(200).json({
                message: "Product has been retrieved successfully!",
                Product: doc
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

router.patch('/:productId', (req,res,next) =>{
    const id = req.params.productId;

    // res.json(req.body);
    Product.findOneAndUpdate({_id:id},req.body,{upsert: true})
    .exec()
    .then((doc)=>{
        res.status(200).json({
            message: "Product has been updated successfully!",
            Product: doc
        });
    })
    .catch((err)=>{
        res.status(500).json({
            message: "Internal Server Error!",
            error : err
        });
    });
    
});

router.delete('/:productId', (req,res,next) =>{
    const id = req.params.productId;
    Product.remove({_id:id})
    .exec()
    .then((doc)=>{
        if(doc){
            res.status(200).json({
                message: "Product has been removed successfully!",
                request:{
                    type: "POST",
                    url: "/products",
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