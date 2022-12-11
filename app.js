require('dotenv').config();
//npm i dotenv
const Server = require('./models/server');


const server = new Server();

server.listen();