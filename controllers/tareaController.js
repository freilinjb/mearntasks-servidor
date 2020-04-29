const Tarea = require('../models/tarea.js');
const Proyecto = require('../models/Proyecto.js');
const { validationResult } = require('express-validator');

//Crear nueva tarea

exports.crearTarea = async (req, res) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() });
    }



    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);   
        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        //creadir esta en el modelo y en la BD
        if(existeProyecto.creador.toString() !== req.usuario.id) { //Revisa de lo sesion del usuario si es el mismo
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();

        res.json({tarea});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}


//Obteiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    
    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;
         

        const existeProyecto = await Proyecto.findById(proyecto);   
        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        //creadir esta en el modelo y en la BD
        if(existeProyecto.creador.toString() !== req.usuario.id) { //Revisa de lo sesion del usuario si es el mismo
            return res.status(401).json({msg: 'No Autorizad o'});
        }
 
        //Obtener las tareas por proyecto
        //Donde el proyecto sea igual al proyecto que se le pasa por parametro
        const tareas = await Tarea.find({ proyecto});
        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarTarea = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body

        //Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        //Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario autenticado
        //creadir esta en el modelo y en la BD
        if(existeProyecto.creador.toString() !== req.usuario.id) { //Revisa de lo sesion del usuario si es el mismo
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Crear un objeto con la nueva informacion
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea,{new: true});

        res.json({tarea}); 

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Eliminar una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        //Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        //Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario autenticado
        //creadir esta en el modelo y en la BD
        if(existeProyecto.creador.toString() !== req.usuario.id) { //Revisa de lo sesion del usuario si es el mismo
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Eliminar
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'});


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}