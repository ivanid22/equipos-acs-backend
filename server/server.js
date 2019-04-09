require('./config/config');
// Deps
const {mongoose} = require('./db/mongoose');
const bcrypt = require('bcryptjs');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

// Models
const {User} = require('./models/User');
const {authenticate} = require('./middleware/auth');

// Routers
var {ubicacionRoutes} = require('./server/ubicacionRoutes');
var {equipoRouter} = require('./server/equipoRouter');
var {usersRouter} = require('./server/usersRouter');
var {movimientoRouter} = require('./server/movimientoRouter');

var app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(ubicacionRoutes);
app.use(equipoRouter);
app.use(usersRouter);
app.use(movimientoRouter);

app.get('/', (req, res) => {
  res.send('success');
});

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
