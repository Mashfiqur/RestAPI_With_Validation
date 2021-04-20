const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        type: String,
        required: true,
        trim: true
    },
    sku:{
        type: String,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true,
    },
    currency:{
        type: String,
        required: true,
        trim: true
    },
    productImage:{
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);