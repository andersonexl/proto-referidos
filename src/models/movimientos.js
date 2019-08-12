const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

const MovimientoSchema = new Schema({
    usuario: String,
    tipoMovimiento: String,
    cantidadTotal: Number,
    cantidadDepositada: Number,
    porcentajeOrinoco: Number,
    porcentajeReferencer: Number,
    fechaMovimiento: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('movimientos', MovimientoSchema);