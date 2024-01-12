const express = require('express')
const app = express()
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor (){
        this.app = express();
        this.PORT = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //conectar a base de datos
        this.conectarDB();

        //middlewares

        this.middlewares();

        //rutas
        this.routes();
        
    }


    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //cors
        this.app.use(cors())

        //lectura y parseo del body
        this.app.use(express.json());

        //directorio publico
        this.app.use( express.static('public'));

    }

    routes(){

        this.app.use(this.usuariosPath,require('../routes/usuarios'));

    }


    listen(){
        
    this.app.listen(this.PORT,()=>{
    console.log('Servidor corriendo en puerto:',this.PORT);
})
    }

}

module.exports = Server;