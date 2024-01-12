const Role = require('../models/role');
const usuario = require('../models/usuario');

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
}

const existeEmail = async (correo = '') => {
    const existeEmail = await usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya existe en la BD`)
    }
}


const existeUsuarioPorId = async (id) => {
    const existeUsuario = await usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El ID: ${id} no existe en la BD`)
    }
}



module.exports = { esRolValido, existeEmail ,existeUsuarioPorId}