const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');

//crear el servidor
const app = express();

//Conectar a la DB
conectarDB();

//Habilitar cors
app.use(cors());

//Habilitar express.json
app.use(express.json({extended: true}));
app.use(morgan('dev'));

//Puerto de la app
const PORT = process.env.PORT || 4000;

//Importar rutas

//Definir la pagina principal
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/proyectos',require('./routes/proyectos'));
app.use('/api/tareas',require('./routes/tareas'));

//arrancando la app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});