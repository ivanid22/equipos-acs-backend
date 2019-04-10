const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const {Equipo} = require('./Equipo');
const moment = require('moment');

const equipoExists = (v, cf) => {
    Equipo.findById({_id: v}, (err, equipo) => {
        if(err) {
            cf(false);
        }
        else if (equipo) {
            cf(true);
        }
        else {
            cf(false);
        }
    })
}

const EventoSchema = new mongoose.Schema({
    equipoId: {
        type: ObjectID,
        validate: {
            isAsync: true,
            validator: equipoExists
        },
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: moment().valueOf()
    }
});

const Evento = mongoose.model('Evento', EventoSchema);

module.exports = {
    Evento
}