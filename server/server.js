require('./config/config');
const {mongoose} = require('./db/mongoose');
const express = require('express');
const {Equipo} = require('./models/Equipo');
const {Ubicacion} = require('./models/Ubicacion');
const {User} = require('./models/User');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

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
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
