const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    nombre: String,
    apellido: String,
    cedula: {
        type: Number,
        unique: true
    },
    usuario: {
        type: String,
        unique: true
    },
    saldoActivo: {
        type: Number,
        default: 0
    },
    saldoReferidos: {
        type: Number,
        default: 0
    },
    enlace: String,
    referencer: String,
    referidos: Array,
});

module.exports = mongoose.model('users', UserSchema);