const mongoose = require('mongoose');

const UbicacionSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        default: 'Deposito'
    },
    nombre: {
        type: String,
        required: true
    },
});

const Ubicacion = mongoose.model('Ubicacion', UbicacionSchema);

module.exports = {
    Ubicacion
}