const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() })
    }

    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardar el creador via JWT 
        proyecto.creador = req.usuario.id;

        //guardamos el proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        //Traer todos los registros del id de usuario
        //find: condicion para traer los datos
        //sort cambia el orden en que fueron creados
    const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1});
        res.json({proyectos});
        
    } catch (error) {
        console.log(error); 
        res.status(500).send('Hubo un error en el servidor');
    }
}

//Actualizar un proyecto
exports.actualizarProyecto = async(req, res) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() })
    }

    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre) {
        nuevoProyecto.nombre = nombre;
    } 
    //La parte de actualizar es un poco mas complicada
    try {
        //Revisar el ID
        // console.log(req.params.id); //Prueba
        let proyecto = await Proyecto.findById(req.params.id);
        
        //Verificar si el proyecto existe
        if(!proyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        //Verificar el creador del proyecto
        //creadir esta en el modelo y en la BD
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true});

        res.json({proyecto});


    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Elimina un proyecto por su id
exports.eliminarProyecto = async (req, res) => {
    try {
        //Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //Verificar si el proyecto existe
        if(!proyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        //Verificar el creador del proyecto
        //creadir esta en el modelo y en la BD
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Eliminar el Proyecto
        await Proyecto.findByIdAndRemove({_id: req.params.id});
        res.json({msg: 'Proyecto eliminado'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
        
    }
}

