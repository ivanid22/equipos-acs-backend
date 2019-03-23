require('./config/config');
const {mongoose} = require('./db/mongoose');
const bcrypt = require('bcryptjs');
const express = require('express');
const {Equipo} = require('./models/Equipo');
const {Ubicacion} = require('./models/Ubicacion');
const {User} = require('./models/User');
const bodyParser = require('body-parser');
const {authenticate} = require('./middleware/auth');

var app = express();

app.use(bodyParser.json());
// app.use(authenticate);

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

app.post('/ubicacion', authenticate, (req, res) => {
   if(req.body.tipo && req.body.nombre) {
     const ubi = new Ubicacion({
       tipo: req.body.tipo,
       nombre: req.body.nombre
     });
     ubi.save().then((ubicacion) => {
       res.status(200).send(ubicacion)
     }).catch((err) => {
       res.status(400).send(err);
     })
   } 
})

app.get('/ubicacion', authenticate, (req, res) => {
  Ubicacion.find({}, (err, ubicaciones) => {
     if(err) {
       res.status(400).send(err)
     }
     else {
       res.status(200).send(ubicaciones);
     }
  })
})

app.get('/ubicacion/:id', authenticate, (req, res) => {
  Ubicacion.findOne({_id: req.params.id}, (err, ubicacion) => {
    if(err) {
      res.status(400).send(err)
    }
    else {
      if(ubicacion) {
        res.status(200).send(ubicacion)
      }
      else {
        res.status(404).send('no match')
      }
    }
  })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
  console.log(process.env.JWT_SECRET)
})
