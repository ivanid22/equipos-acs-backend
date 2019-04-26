const express = require('express');
const {authenticate} = require('../middleware/auth');
const {Movimiento} = require('../models/Movimiento');
const {Equipo} = require('../models/Equipo');
const {Ubicacion} = require('../models/Ubicacion');

var movimientoRouter = express.Router();

movimientoRouter.post('/movimiento', authenticate, (req, res) => {
    const {origenId, destinoId, descripcion, dateInicio, dateFin, estado, equipoId} = req.body;
    var mov = new Movimiento({
        origenId,
        destinoId,
        descripcion,
        dateInicio,
        dateFin,
        equipoId,
        estado: estado || undefined
    });

    var equipo = Equipo.findById(equipoId, (err, eq) => {
        if(err) {
            res.status(404).send();
        }
        else if (eq) {
            eq.ubicacionId = destinoId;
            console.log(req.body);
            eq.save().then((esaved) => {
                if(esaved) {
                    mov.save().then((m) => {
                        if (m) {
                            res.send(m);
                        }
                        else {
                            res.status(401).send();
                        }
                    }).catch((e) => {
                        res.status(402).send(e.message);
                    })
                }
            }).catch((err) => {
                res.status(403).send(err.message);
            })
        }
        else {
            res.status(500).send();
        }
    });
});


movimientoRouter.get('/movimiento', authenticate, (req, res) => {
    Movimiento.find({}, (err, movs) => {
        if(err) {
            res.status(400).send(err.message);
        }
        else if (movs) {
            res.send(movs);
        }
        else {
            res.status(404).send();
        }
    });
});

movimientoRouter.get('/movimiento/:id', authenticate, (req, res) => {
    Movimiento.findById(req.params.id, (err, mov) => {
        if(err) {
            res.status(404).send(err.message)
        }
        else if (mov) {
            res.send(mov);
        }
        else {
            res.status(404).send();
        }
    });
})

movimientoRouter.patch('/movimiento/:id', authenticate, (req, res) => {
    Movimiento.findById(req.params.id, (err, mov) => {
        if(err) {
            res.status(400).send(err.message);
        } else if(mov) {
            Object.assign(mov, req.body.changes);
            mov.save().then((mov) => {
                res.send(mov);
            }).catch((e) => {
                res.status(400).send(e.message)
            });
        }
        else {
            res.status(404).send();
        }
    })
})

movimientoRouter.delete('/movimiento/:id', authenticate, (req, res) => {
    Movimiento.findByIdAndRemove(req.params.id, (err, mov) => {
        if(err) {
            res.status(404).send(err.message)
        }
        else if (mov) {
            res.send(mov);
        }
        else {
            res.status(400).send();
        }
    })
})

module.exports = {
    movimientoRouter
}