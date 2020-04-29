const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Crear un usuario
//api/proyectos
router.post('/', 
    auth,//Primero verifica el auth si se autentica pasa a la ejecucion
    [
        check('nombre','El nomber del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);
//Obtener todos los proyectos
router.get('/', 
    auth,//Primero verifica el auth si se autentica pasa a la ejecucion
    proyectoController.obtenerProyectos
);


//Actualizar proyectos via ID
router.put('/:id',
    auth,
    [
        check('nombre','El nomber del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);


//Eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;