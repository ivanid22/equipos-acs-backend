require('./config/config');
// Deps
const {mongoose} = require('./db/mongoose');
const bcrypt = require('bcryptjs');
const express = require('express');
const bodyParser = require('body-parser');

// Models
const {User} = require('./models/User');
const {authenticate} = require('./middleware/auth');

// Routers
var {ubicacionRoutes} = require('./server/ubicacionRoutes');
var {equipoRouter} = require('./server/equipoRoutes');

var app = express();

app.use(bodyParser.json());

app.use(ubicacionRoutes);
app.use(equipoRouter);

app.get('/', (req, res) => {
  res.send('success');
});

app.post('/users', (req, res) => {
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

app.post('/login', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) => {
      if(err) {
        res.status(400).send(err);
      }
      if(user) {
        bcrypt.compare(req.body.password, user.password, (err, success) => {
          if (err) {
            res.status(400).send({
              password: req.password,
              username: user.username
            });
          }
          if (success) {
            user.generateAuthToken().then((token) => {
              res.header('x-auth', token.token).status(200).send(user);
            }).catch(e => res.status(400).send(e.message))
          }
        })
      }
      else {
        res.status(404).send();
      }
  })
})

app.post('/logout', authenticate, (req, res) => {
  var currentToken = req.get('x-auth');
  User.findOne({
    'tokens.token': currentToken
  }, (err, user) => {
     if(err) {
       res.status(404).send();
     }
     if(user) {
       user.removeToken(currentToken);
       user.save().then((arguments) => {
         res.status(200).send(user);
       })
     }
  })
});


app.listen(3000, () => {
  console.log('Listening on port 3000')
  console.log(process.env.JWT_SECRET)
})
