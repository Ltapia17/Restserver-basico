const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models/index');
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]


const buscarProductos = async (termino = '', res = response) => {

    const mongoID = ObjectId.isValid(termino); //true

    if (mongoID) {

        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });

    }


    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({
            $or: [{ nombre: regex }, { correo: regex }],
        })
        .populate('categoria', 'nombre');

    res.json({
        results: productos
    });

    return;


}


const buscarCategorias = async (termino = '', res = response) => {

    const mongoID = ObjectId.isValid(termino); //true

    if (mongoID) {
        console.log('entro');
        const categoria = await Categoria.findById(termino)
            .populate('usuario', 'nombre');
        return res.json({
            results: (categoria) ? [categoria] : []
        });

    }


    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find

        ({ nombre: regex, estado: true })
        .populate('usuario', 'nombre');

    res.json({
        results: categorias
    });

    return;


}

const buscarUsuarios = async (termino = '', res = response) => {

    const mongoID = ObjectId.isValid(termino); //true

    if (mongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });

    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });

}





const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })

    }


    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'No se hizo esta busqueda'
            })

    }


}


module.exports = {
    buscar
}