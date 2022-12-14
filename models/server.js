const express = require('express');
//https://www.npmjs.com/package/express
//npm i express

const cors = require('cors');
//https://www.npmjs.com/package/cors
//npm i cors

const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersRoutePath = '/api/users';

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares (funciones que añaden funcionalidades)
        this.middlewares();

        // Rutas de mi app
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio público **index.html
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use(this.usersRoutePath, require('../routes/users'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port )
        });
    }

}

module.exports = Server;