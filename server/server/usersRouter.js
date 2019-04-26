const express = require('express');
const {authenticate} = require('../middleware/auth');
const {User} = require('../models/User');
const bcrypt = require('bcryptjs');

var usersRouter = express.Router();

usersRouter.post('/user', (req, res) => {
    var newUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    newUser.save().then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token.token).status(200).send(user);
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err.message);
    })
});

usersRouter.post('/login', (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            res.status(400).send(err);
        }
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, success) => {
                if (err) {
                    res.status(400).send({
                        password: req.password,
                        username: user.username
                    });
                }
                if (success) {
                    user.generateAuthToken().then((token) => {
                        res.header('x-auth', token.token).status(200).send(token);
                    }).catch(e => res.status(400).send(e.message))
                }
            })
        }
        else {
            res.status(404).send();
        }
    })
})

usersRouter.post('/logout', authenticate, (req, res) => {
    var currentToken = req.get('x-auth');
    User.findOne({
        'tokens.token': currentToken
    }, (err, user) => {
        if (err) {
            res.status(404).send();
        }
        if (user) {
            user.removeToken(currentToken);
            user.save().then(() => {
                res.status(200).send();
            })
        }
    })
});

usersRouter.get('/loggedIn', authenticate, (req, res) => {
    res.status(200).send(true);
})

module.exports = {
    usersRouter
}