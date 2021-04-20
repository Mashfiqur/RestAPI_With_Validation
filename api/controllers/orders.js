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