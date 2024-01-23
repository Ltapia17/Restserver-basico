const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar.campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearCategoria, obtenerCategoria, obtenerCategoriaPorId, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');
const { ValidarAdminRole } = require('../middlewares');
const router = Router();

//url/api/categorias

router.get('/', obtenerCategoria);

router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoriaPorId);


//crear categoria = privado cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   
    validarCampos
], crearCategoria);

//actualizar privadp - cualquier con token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoria), 
    validarCampos
],actualizarCategoria);

//borrar categoria - Admin
router.delete('/:id',[
    validarJWT,
    ValidarAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
],borrarCategoria);


module.exports = router;