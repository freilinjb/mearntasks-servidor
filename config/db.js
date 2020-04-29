const mongoose = require('mongoose');
//Configuracion de variables de entorno

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB Conectada');
    } catch (error) {
        console.log('hubo un error')
        console.log(error);
        process.exit(1); // Detener la app
    }
}

module.exports = conectarDB;