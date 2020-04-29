const mongoose  = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true);
mongoose.set('useCreateIndex', true);

const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true//No puede haber dos usuarios registrados
    },
    password: {
        type: String,
        require: true,
        trim: true,
    },
    registro: {
        type: Date,
        default: Date.now() //Genera una fecha en el momento que se registra
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);