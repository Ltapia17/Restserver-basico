
const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuarioget = async (req, res = response) => {
    // const { q, nombre = "no name", apikey } = req.query;

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };


    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    });



}

const usuariosPost = async (req, res = response) => {



    const { nombre, correo, google, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol, google: false });

    //verificar si el correo existe


    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en BD

    await usuario.save();


    res.json({
        msg: 'post Api - controlador',
        usuario

    })
}
const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, correo, ...resto } = req.body;

    //TODO Validar contra base de datos
    if (password) {
        //encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({

        usuario
    });
}
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch Api - controlador'
    })
}

const usuariosDelete = async (req, res = response) => {


    const { id } = req.params;
    const uid = req.uid;

    //Fisicamente lo borramos
    
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });


    res.json({
        msg: 'delete Api - controlador',
        usuario,
    })
}


module.exports = {
    usuarioget,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete

}    