require('./config/config');
const {mongoose} = require('./db/mongoose');
const express = require('express');
const {Equipo} = require('./models/Equipo');
const {Ubicacion} = require('./models/Ubicacion')
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.send('success');
});

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
