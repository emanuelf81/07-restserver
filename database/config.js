const mongoose = require('mongoose');
// https://www.npmjs.com/package/mongoose
// npm i mongoose


const dbConnection = async() => {

    try {
        mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos Online')
        
    } catch (err) {
        console.log(err);
        throw new Error('Error al iniciar la base de datos.');        
    }

}

module.exports = {
    dbConnection
}