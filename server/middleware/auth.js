const express = require('express');
const jwt = require('jsonwebtoken');
const {User} = require('./../models/User');

const authenticate = (req, res, next) => {
    var reqToken = req.get('x-auth');
    if(reqToken) {
        User.findOne({
            'tokens.token': reqToken
        }, (err, user) => {
            if(err) {
                res.status(400).send(err.message);
            }
            if(user) {
                jwt.verify(reqToken, process.env.JWT_SECRET, (err, decoded) => {
                    if(err) {
                        res.status(404).send(user);
                    }
                    console.log(user)
                    if(user._id.toHexString() === decoded) {
                        next();
                    }
                })
            }
        })
    }
    else {
        res.status(403).send('Not authorized');
    }
}

module.exports = {
    authenticate
};