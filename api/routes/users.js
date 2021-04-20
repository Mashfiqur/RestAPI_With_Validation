const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {

    User.find({
            email: req.body.email
        }).exec()
        .then(user => {

            if (user.length >= 1) {
                return res.status(409).json({
                    message: "This email has already been exist!",
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Internal Server Error!",
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(() => {
                                return res.status(201).json({
                                    message: "User registration has been completed successfully!",
                                    createdUser: user
                                });
                            })
                            .catch((err) => {
                                return res.status(400).json({
                                    message: "Bad Request!",
                                    error: err
                                });
                            });
                    }

                });
            }
        })
        .catch((err) => {
            return res.status(400).json({
                message: "Bad Request!",
                error: err
            });
        });
});


router.post('/login', (req,res,next) =>{
    User.findOne({
        email: req.body.email
    }).exec()
    .then(user => {

        if (user.length < 1) {
            return res.status(401).json({
                message: "Auth Failed!",
            });
        } 
        bcrypt.compare(req.body.password, user.password, (err, result)=>{
            if(err){
                return res.status(401).json({
                    message: "Auth Failed!",
                });
            }
            if(result){
                const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
                ); // Check https://jwt.io/
                return res.status(200).json({
                    message: "Auth Successful!",
                    token: token
                });
            }

            return res.status(401).json({
                message: "Auth Failed!",
            });
        });
    })
    .catch((err) => {
        res.status(400).json({
            message: "Bad Request!",
            error: err
        });
    });
    
});


module.exports = router;
