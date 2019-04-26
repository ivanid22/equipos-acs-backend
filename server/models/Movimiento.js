var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');
var {Ubicacion} = require('./Ubicacion');
var {Equipo} = require('./Equipo');

const ubicacionExists = (v, cb) => {
    Ubicacion.findById(v, (err, ubicacion) => {
        if(err) {
            cb(false);
        }
        else if (ubicacion) {
            cb(true);
        }
        cb(false);
    })
    
}

const equipoExists = (v, cb) => {
    Equipo.findById(v, (err, equipo) => {
        if(err) {
            cb(false);
        }
        else if (equipo) {
            cb(true);
        }
        cb(false)
    })
}

const MovimientoSchema = new mongoose.Schema({
    origenId: {
        type: ObjectID,
        required: true,
        validate: {
            isAsync: true,
            validator: ubicacionExists
        }
    },
    destinoId: {
        type: ObjectID,
        required: true,
        validate: {
            isAsync: true,
            validator: ubicacionExists
        }
    },
    equipoId: {
        type: ObjectID,
        required: true,
        validate: {
            isAsync: true,
            validator: equipoExists
        }
    },
    descripcion: {
        type: String,
        required: false
    },
    dateInicio: {
        type: Date,
        required: true,
        default: moment().valueOf()
    },
    dateFin: {
        type: Date,
        required: false
    },
    estado: {
        type: String,
        required: true,
        default: 'En transito'
    }
});

const Movimiento = mongoose.model('Movimiento', MovimientoSchema);

module.exports = {
    Movimiento
};