const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();

//Connecting DataBase
mongoose.connect('mongodb://localhost/crud-mongo', { useNewUrlParser: true })
    .then(db => console.log('Database Connected'))
    .catch(error => console.log(error));

//Routing
const index = require('./routes');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));                 //Establece que los datos recibidos seran Json

//Routes
app.use(index);

//Listening
app.listen(app.get('port'), () => {
    console.log(`Server on Port ${app.get('port')}`);
});

//Esto es una prueba
//Esta es una nueva pruebaaa
//Mas pruebaaas