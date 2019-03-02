const mongo = require('mongodb');
const express = require('express');

var app = express();

app.get('/', (req, res) => {
   res.send('success');
});

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
