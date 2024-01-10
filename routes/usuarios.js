const { Router } = require('express');
const { usuarioget, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

const router = Router();


router.get('/', usuarioget);
router.put('/:id', usuariosPut);
router.patch('/',usuariosPatch);
router.post('/', usuariosPost);
router.delete('/', usuariosDelete);


module.exports = router;