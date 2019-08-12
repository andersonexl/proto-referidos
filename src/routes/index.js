const express = require('express');
const router = express.Router();

const User = require('../models/users');
const Movimiento = require('../models/movimientos');

//Lista todos los usuarios
router.get('/', async (req, res) => {
    const usuarios = await User.find();
    const movimientos = await Movimiento.find();

    const gananciasOrinoco = await Movimiento.aggregate([
        { $group: { _id: null, gananciasOrinoco: { $sum: "$porcentajeOrinoco" }, montoTotal: { $sum: "$cantidadTotal" }  } }
    ]);

    montoTotalOrinoco = gananciasOrinoco[0].gananciasOrinoco;
    montoTotalMovimientos = gananciasOrinoco[0].montoTotal;

    res.render('index.ejs', {
        usuarios,
        movimientos,
        montoTotalOrinoco,
        montoTotalMovimientos
    });
});

//Muestra vista par registrar un nuevo usuario desde link de referido
router.get('/registrar/:usuario', (req, res) => {
    const { usuario } = req.params;
    res.render('registrar.ejs', {
        usuario
    });
});

//Muestra vista par registrar un nuevo usuario
router.get('/registrar', (req, res) => {
    /* const usuario = 'OrinocoTeam';*/
    const usuario = '';
    res.render('registrar.ejs', {
        usuario
    });
});

//Registra un Usuario desde la página
router.post('/registrar', async (req, res) => {
    const usuario = new User(req.body);
    if (usuario.saldoActivo == null)
    {
        usuario.saldoActivo = 0;
    }
    usuario.enlace = `/registrar/${usuario.usuario}`;
    await usuario.save();
    res.redirect('/');
});

//Registra un Usuario desde un link de referido
router.post('/registrar/:referencer', async (req, res) => {
    const { referencer } = req.params;
    const usuario = new User(req.body);
    usuario.referencer = referencer;
    usuario.enlace = `/registrar/${usuario.usuario}`;
    await usuario.save((error) => console.log(error));
    
    const refer = await User.findOne({usuario: referencer});
    refer.referidos.push(usuario.usuario);
    refer.save();
    res.redirect('/');
    
});

//Muestra vista para depositar
router.get('/depositar/:id', async (req, res) => {
    const { id } = req.params;
    const usuario = await User.findById(id);
    res.render('depositar.ejs', {
        usuario
    });
});

//Deposita dinero a un usuario
router.post('/depositar/:id', async (req, res) => {
    const { id } = req.params;
    let { fondos } = req.body;
    porcentajeOrinoco = (fondos * 3 ) / 100;
    nuevosfondos = fondos - porcentajeOrinoco;
    const usuario = await User.findById(id);
    usuario.saldoActivo = usuario.saldoActivo + nuevosfondos;
    await usuario.save();

    const movimientoU = new Movimiento({
        usuario: usuario.usuario,
        tipoMovimiento: 'Deposito',
        cantidadTotal: fondos,
        cantidadDepositada: nuevosfondos,
        porcentajeOrinoco: porcentajeOrinoco
    });

    if (usuario.referencer != '')
    {
        const referencer = await User.findOne({usuario: usuario.referencer});
        referencer.saldoReferidos = referencer.saldoReferidos + ( (porcentajeOrinoco * 5) / 100 );
        movimientoU.porcentajeReferencer = referencer.saldoReferidos;
        await referencer.save();
    }

    await movimientoU.save();
    res.redirect('/');
});

//Muestra vista para retirar
router.get('/retirar/:id', async (req, res) => {
    const { id } = req.params;
    const usuario = await User.findById(id);
    res.render('retirar.ejs', {
        usuario
    });
});

//Retira dinero a un usuario
router.post('/retirar/:id', async (req, res) => {
    const { id } = req.params;
    let { retirofondos } = req.body;
    const usuario = await User.findById(id);
    if (usuario.saldoActivo > retirofondos)
    {
        usuario.saldoActivo = usuario.saldoActivo - retirofondos;
        await usuario.save();

        const movimientoU = new Movimiento({
            usuario: usuario.usuario,
            tipoMovimiento: 'Retiro',
            cantidadTotal: retirofondos,
            cantidadDepositada: '',
            porcentajeOrinoco: ''
        });

        await movimientoU.save();

        res.redirect('/');
    }
    else
    {
        res.redirect('/');
    }
});

//Muestra vista para retirar
router.get('/reclamar/:id', async (req, res) => {
    const { id } = req.params;
    const usuario = await User.findById(id);
    usuario.saldoActivo = usuario.saldoActivo + usuario.saldoReferidos;
    usuario.saldoReferidos = 0;
    usuario.save();
    res.redirect('/');
});

//Elimina un usuario por su id
router.get('/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    await User.findOneAndDelete({_id: id});
    res.redirect('/');
});

//Limpia el historial
router.get('/limpiar', async (req, res) => {
    await Movimiento.deleteMany();
    res.redirect('/');
});

module.exports = router;