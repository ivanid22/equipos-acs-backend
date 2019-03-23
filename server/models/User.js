const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        minlength: 1,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.methods.removeToken = function(token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }
    })
}

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var authToken = {
        access: 'auth',
        token: jwt.sign(user._id.toHexString(), process.env.JWT_SECRET)
    };
    user.tokens.push(authToken);
    user.save();
    return Promise.resolve(authToken);
}

//calculate password hash before saving
UserSchema.pre('save', function(next) {
    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) {
                    return(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});



const User = mongoose.model('User', UserSchema);

module.exports = {
    User
}