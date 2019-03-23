const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ObjectID = require('mongodb').ObjectID;

const EquipoSchema = new mongoose.Schema({
    ubicacionId: {
        type: ObjectID,
        required: true
    },
    ubicacion: {
        type: String,
        required: true,
        default: 'Eter'
    },
    identificacion: {
        tipo: {
            type: String,
            required: true,
        },
        valor: {
            type: String,
            required: true,
        }
    },
    tipo: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true,
        default: 'En funcionamiento'
    }
});

const Equipo = mongoose.model('Equipo', EquipoSchema);