const { response } = require("express");
const { Producto } = require('../models');



// obtener Producto - paginado - total - populate

//obtener Producto - pupulate {}


const obtenerProductos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }


    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('categoria', 'nombre')
            .populate('usuario','nombre')
            .skip(Number(desde))
            .limit(Number(limite))

    ]);

    res.json({
        total,
        productos,

    })

}


const obtenerProductosId = async (req, res = res) => {

    const { id } = req.params;


    const producto = await Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre');


    res.json({
        producto
    })

}


const crearProducto = async (req, res = response) => {


    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });


    if (productoDB) {
        res.status(400).json({
            msg: `La categoria ${productoDB.nombre} ya existe`
        })
        return;
    }

    //generar la data para guardar

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = await new Producto(data);

    //guardar DB
    await producto.save();

    res.status(201).json({ producto });


}

// actualizar categoria 

const actualizarProducto = async (req, res = res) => {

    

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
        
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });


    

    res.json({
        producto
    });


}

//borrra categoria - estado : false

const borrarProducto = async (req, res = response) => {

    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(200).json({
        productoBorrado
    })

}




module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductosId,
    actualizarProducto,
    borrarProducto
}