const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar.campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { } = require('../controllers/categorias');
const { existeCategoria, existeProducto } = require('../helpers/db-validators');
const { ValidarAdminRole } = require('../middlewares');
const { crearProducto,
    actualizarProducto,
    borrarProducto,
    obtenerProductos,
    obtenerProductosId } = require('../controllers/productos');
const router = Router();

//url/api/categorias

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProductosId);


//crear categoria = privado cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'Debe colocar un id de categoria').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto);

//actualizar privadp - cualquier con token valido
router.put('/:id', [
    validarJWT,
    //check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], actualizarProducto);

// //borrar categoria - Admin
router.delete('/:id', [
    validarJWT,
    ValidarAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto);


module.exports = router;