const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        //verificar si email existe

        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'Usuario / password no son correctos'
            });
        }

        //validar si usuario esta activo

      
        if(!usuario.estado){
            return res.status(400).json({
                msg:'Usuario / password no son correctos - estado false'
            })
        }


        //validar contraseña
        const validaPassword = bcryptjs.compareSync(password,usuario.password);
        if(!validaPassword){
            return res.status(400).json({
                msg:'Usuario / password no son correctos - password'
            })
        }

        //generar el JWT

        

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
            msg: 'login ok'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con administrador'
        })
    }


    

}

module.exports = {
    login
}