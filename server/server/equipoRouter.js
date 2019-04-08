const express = require('express');
const {Equipo} = require('../models/Equipo');
const {Ubicacion} = require('../models/Ubicacion');
const {authenticate} = require('../middleware/auth');

var equipoRouter = express.Router();

equipoRouter.get('/equipo', authenticate, (req, res) => {
    Equipo.find({}, (err, equipos) => {
        if(err) {
            res.status(400).send('Bad request')
        }
        else {
            res.status(200).send(equipos)
        }
    })
})

equipoRouter.get('/equipo/:id', authenticate, (req, res) => {
    if(req.params.id) {
        Equipo.findOne({_id: req.params.id}, (err, equipo) => {
            if(err) {
                res.status(404).send(err.message)
            }
            else if(equipo) {
                res.status(200).send(equipo)
            }
            else {
                res.status(404).send();
            }
        })
    }
    else {
        res.status(400).send('Bad request');
    }
})

equipoRouter.post('/equipo', authenticate, (req, res) => {
    if(req.body.ubicacionId) {
        Ubicacion.findOne({_id: req.body.ubicacionId}, (err, ubicacion) => {
            if(err) {
                res.status(400).send('Ubicacion id invalid or not found')
            } else {
                if(ubicacion) {
                    var equipo = new Equipo({
                        ubicacionId: req.body.ubicacionId,
                        identificacion: req.body.identificacion,
                        tipo: req.body.tipo,
                        estado: req.body.estado
                    })
                    equipo.save().then((equipo) => {
                        res.status(200).send(equipo);
                    }).catch((err) => {
                        res.status(400).send(err)
                    })
                }
                else {
                    res.status(400).send('Ubicacion id invalid or not found')
                }
            }
        })
    } else {
        res.status(400).send('Bad request')
    }
})

equipoRouter.patch('/equipo/:id', authenticate, (req, res) => {
    if(req.body.changes) {
        Equipo.findOne({_id: req.params.id}, (err, equipo) => {
            if(err) {
                res.status(404).send();
            }

            Object.assign(equipo, req.body.changes);
            equipo.save().then((eq) => {
                res.status(200).send(eq);
            }).catch((e) => {
                res.status(400).send(e.message)
            });
        })
    } else {
        res.status(400).send('Bad request')
    }
})

equipoRouter.delete('/equipo/:id', authenticate, (req, res) => {
    if(req.params.id) {
        Equipo.remove({_id: req.params.id}, (err, equipo) => {
            if(err) {
                res.status(404).send(err.message)
            } else if (equipo) {
                res.status(200).send(equipo)
            } else {
                res.status(404).send(err.message)
            }
        });
    } else {
        res.status(400).send('Bad request: Missing id')
    }
})

module.exports = {
    equipoRouter
}