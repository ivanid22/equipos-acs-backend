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
                        res.status(401).send();
                    }

                    if(user._id.toHexString() === decoded._id) {
                        next();
                    }
                })
            }
        })
    }
    else {
        res.status(401).send();
    }
}

module.exports = {
    authenticate
};