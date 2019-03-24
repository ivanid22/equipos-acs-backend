const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const EquipoSchema = new mongoose.Schema({
    ubicacionId: {
        type: ObjectID,
        required: true
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

module.exports = {
    Equipo
}