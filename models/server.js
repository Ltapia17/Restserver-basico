const express = require('express')
const app = express()
const cors = require('cors')

class Server {

    constructor (){
        this.app = express();
        this.PORT = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        //middlewares

        this.middlewares();

        //rutas
        this.routes();
        
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