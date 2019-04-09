const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        minlength: 1,
        trim: true,
        unique: true,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: false
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

UserSchema.methods.removeToken = function(userToken) {
    var user = this;
    var tokens = user.tokens;
    var filteredTokens = tokens.filter((token) => {
        return (token.token !== userToken)
    });
    user.tokens = filteredTokens;
}

UserSchema.methods.generateAuthToken = function() {
    var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access: access}, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => {
        return token
    })
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