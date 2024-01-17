const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        //verificar si email existe

        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos'
            });
        }

        //validar si usuario esta activo


        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - estado false'
            })
        }


        //validar contraseña
        const validaPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validaPassword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password'
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

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { nombre, correo, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //crear usuario
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                rol:'USER_ROLE',
                google: true
            };

            usuario = new Usuario(data);  
            
            console.log(usuario,'usuario se creo');

            await usuario.save();
        }

        //si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador,usuario bloqueado '
            })
        }

          //generar el JWT

          

          const token = await generarJWT(usuario.id);

         

        res.json({
            usuario,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}