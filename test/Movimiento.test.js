process.env.MONGODB_URI = 'mongodb://localhost:27017/EquiposACSTest';

var mongoose = require('../server/db/mongoose');
var ObjectID = require('mongodb').ObjectID;
var {Movimiento} = require('../server/models/Movimiento');
var moment = require('moment');
var expect = require('expect');

it('create instance of Movimiento', function(done) {
    const oid = new ObjectID();
    const now = moment();
    var mv = new Movimiento({
        _id: oid,
        origenId: oid,
        destinoId: oid,
        estado: 'Inicio',
        dateInicio: now.valueOf(),
        dateFin: now.valueOf()
    });
    mv.save();
    setTimeout(() => {
        var movimiento = await Movimiento.findOne({dateInicio: now.valueOf()}).exec();
        console.log(movimiento);
        done();
    }, 500);
});