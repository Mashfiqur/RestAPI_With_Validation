const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:{
        type: String,
        required: true,
        unique: true,
        match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);