const express = require('express');
const router = express.Router();

router.get('/', (req,res,next) =>{
    res.status(200).json({
        message: "Welcome to the Products get API!"
    });
});

router.post('/', (req,res,next) =>{
    res.status(200).json({
        message: "Welcome to the Products post API!"
    });
});

router.get('/:productId', (req,res,next) =>{
    const id = req.params.productId;
    res.status(200).json({
        message: id
    });
});

router.patch('/:productId', (req,res,next) =>{
    const id = req.params.productId;
    res.status(200).json({
        message: "updated product"
    });
});

router.delete('/:productId', (req,res,next) =>{
    const id = req.params.productId;
    res.status(200).json({
        message: "deleted product"
    });
});

module.exports = router;