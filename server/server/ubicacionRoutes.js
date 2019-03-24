const express = require('express');
const {authenticate} = require('../middleware/auth');
const {Ubicacion} = require('../models/Ubicacion');

var ubicacionRoutes = express.Router();

ubicacionRoutes.post('/ubicacion', authenticate, (req, res) => {
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
 
 ubicacionRoutes.get('/ubicacion', authenticate, (req, res) => {
   Ubicacion.find({}, (err, ubicaciones) => {
      if(err) {
        res.status(400).send(err)
      }
      else {
        res.status(200).send(ubicaciones);
      }
   })
 })
 
 ubicacionRoutes.get('/ubicacion/:id', authenticate, (req, res) => {
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
 
 ubicacionRoutes.patch('/ubicacion/:id', authenticate, (req, res) => {
   if(req.params.id && req.body.changes) {
     Ubicacion.findOne({_id: req.params.id}, (err, ubicacion) => {
       if(err) {
         res.status(404).send(err)
       }
       else {
         ubicacion.tipo = req.body.changes.tipo || ubicacion.tipo
         ubicacion.nombre = req.body.changes.nombre || ubicacion.nombre
         ubicacion.save().then((ubicacion) => {
           res.status(200).send(ubicacion); 
         }).catch((err) => {
           res.status(400).send(err.message);
         })
       }
     })
   }
   else {
     res.status(400).send('Bad request')
   }
 })
 
 ubicacionRoutes.delete('/ubicacion/:id', authenticate, (req, res) => {
   if(req.params.id) {
     Ubicacion.findOne({_id: req.params.id}, (err, ubicacion) => {
       if(err) {
         res.status(404).send(err.message)
       }
       else {
         ubicacion.remove().then(() => {
           res.status(200).send();
         }).catch((err) => {
           res.status(400).send(err.message);
         })
       }
     })
   }
   else {
     res.status(400).send('Bad request')
   }
 })

 module.exports = {
     ubicacionRoutes
 };