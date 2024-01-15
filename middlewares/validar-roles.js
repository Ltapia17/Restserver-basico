const { response } = require("express")

const ValidarAdminRole = (req, res = response, next) => {

    if (!req.usuario) {
        res.status(500).json({
            msg: 'No se puede validar rol '
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador`
        })
    }

    next();


}


const tieneRole = (...roles) => {

    return (req, res = response, next) => {

        if (!req.usuario) {
            res.status(500).json({
                msg: 'No se puede validar rol '
            });
        }

        if (!roles.includes(req.usuario.rol)) {

            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }


        next();
    }

}

module.exports = { ValidarAdminRole, tieneRole }