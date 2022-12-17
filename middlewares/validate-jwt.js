const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async( req, res = response, next ) => {

    const token = req.header('x-token');
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const user = await User.findById( uid );
        if ( !user ) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe en DB'
            }); 
        }
        if ( !user.status ) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario con status = false'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }
}

module.exports = {
    validateJWT
}