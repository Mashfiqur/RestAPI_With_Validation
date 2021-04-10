const express = require('express');
const router = express.Router();

router.get('/', (req,res,next) =>{
    res.status(200).json({
        message: "Welcome to the Orders get API!"
    });
});

router.post('/', (req,res,next) =>{
    res.status(200).json({
        message: "Welcome to the Orders post API!"
    });
});

router.get('/:orderId', (req,res,next) =>{
    const id = req.params.orderId;
    res.status(200).json({
        message: id
    });
});

router.patch('/:orderId', (req,res,next) =>{
    const id = req.params.orderId;
    res.status(200).json({
        message: "updated order"
    });
});

router.delete('/:orderId', (req,res,next) =>{
    const id = req.params.orderId;
    res.status(200).json({
        message: "deleted order"
    });
});

module.exports = router;