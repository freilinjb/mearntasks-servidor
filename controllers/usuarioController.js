const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
//El resultado de la validacion
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    const {email, password } = req.body;

    try {
        //Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({msg: 'Usuario existe '});
            // return res.state(400).json({msg: 'El usuario ya existe'});
        }
        //crea el nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt );

        //guar el nuevo usuario
        await usuario.save();

        //Crear y firmar el JWT
        /*
        Consiste en dos partes, primero hay que crear el JWT
        con algo que se conoce como payload de cierta informacion que se va almacenar 
        en el json y luego hay que firmarlo
        */

        /**
        token con el id del usuario, cuando inicia sesion
        podemos consultar los datos registrados por el
        **/
        const payload = {
            //Informacion que va a guardar el JWT
            //guarda como peylo el ID del usuario que se esta firmando
            usuario: {
                //El id viene del suario que se almacena por mogoose
                id: usuario.id
            }
        };

        //firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            //Configuracion, activo por una hora
            expiresIn: 3600 //1 hora
        },(error, token) => {
            //callback
            if(error) throw error;

            //Mensaje de confirmacion
            //mover el mensaje
            res.json({token});

        });

    } catch (error) {
        console.log(error);
        res.state(400).send('Hubo un error');
    }
}