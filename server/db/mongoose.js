let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, (err) => {
    if(err) {
        return console.log('Error opening connection to DB: ', err.message);
    }
    console.log('Connected to DB');
});


module.exports = {
    mongoose
};