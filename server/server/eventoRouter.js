const express = require('express');
const moment = require('moment');
const {authenticate} = require('../middleware/auth');
const {Evento} = require('../models/Evento');
const {Equipo} = require('../models/Equipo');

var eventoRouter = express.Router();

eventoRouter.post('/evento', authenticate, (req, res) => {
    const {equipoId, descripcion, timestamp} = req.body;
    var evento = new Evento({
        equipoId,
        descripcion,
        timestamp: timestamp || undefined
    });
    evento.save().then((ev) => {
        if(ev) {
            res.send(ev);
        }
        else {
            res.status(400).send();;
        }
    }).catch((e) => {
        res.status(400).send(e.message);
    })
});

eventoRouter.get('/evento', authenticate, (req, res) => {
    Evento.find({}, (err, eventos) => {
        if(err) {
            req.status(404).send(err.message);
        }
        else if (eventos) {
            res.send(eventos)
        }
        else {
            res.status(400).send();
        }
    })
})

eventoRouter.get('/evento/:id', authenticate, (req, res) => {
    Evento.findById(req.params.id, (err, evento) => {
        if(err) {
            res.status(404).send(e.message)
        }
        else if (evento) {
            res.send(evento)
        }
        else {
            res.status(404).send();
        }
    })
})

eventoRouter.patch('/evento/:id', authenticate, (req, res) => {
    Evento.findById(req.params.id, (err, evento) => {
        if(err) {
            res.status(400).send(e.message);
        }
        else if (evento) {
            Object.assign(evento, req.body.changes);
            evento.save().then((ev) => {
                res.send(ev);
            }).catch((e) => {
                res.status(400).send(e.message)
            });
        }
        else {
            res.status(400).send();
        }
    })
})

eventoRouter.delete('/evento/:id', authenticate, (req, res) => {
    Evento.findByIdAndRemove(req.params.id, (err, evento) => {
        if(err) {
            res.status(404).send(err.message);
        }
        else if (evento) {
            res.send({
                deleted: {
                    evento
                }
            })
        }
        else {
            res.status(404).send();
        }
    })
})

module.exports = {
    eventoRouter
}