const { Router } = require('express');
const { check } = require('express-validator');
const { usuarioget, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

const { esRolValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');

// const { validarCampos } = require('../middlewares/validar.campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { ValidarAdminRole, tieneRole } = require('../middlewares/validar-roles');

const {validarCampos,validarJWT,tieneRole} = require('../middlewares');

 
const router = Router();


router.get('/', usuarioget);
router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);
router.patch('/', usuariosPatch);
router.post('/', [
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(existeEmail),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password tiene que ser maximo de 6 caracteres').isLength({ min: 6 }),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
   // ValidarAdminRole,
    tieneRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);


module.exports = router;