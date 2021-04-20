const Order = require('../models/order');


exports.get_all_orders =  (req,res,next) =>{
    Order.find()
    .populate('product','name') // just retreive name only from product
    .exec()
    .then((doc)=>{
        const count_orders = doc.length;
        if(count_orders > 0){
            res.status(200).json({
                message: "Orders have been retrieved successfully!",
                count : count_orders,
                Orders: doc
                
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
};

exports.create_order = (req,res,next) =>{
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
};


exports.get_order = (req,res,next) =>{
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
};


exports.update_order = (req,res,next) =>{
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
};

exports.remove_order = (req,res,next) =>{
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
};