const { response } = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
//npm i bcryptjs
//https://www.npmjs.com/package/bcryptjs
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");
//https://www.npmjs.com/package/jsonwebtoken
//https://jwt.io/
//npm i jsonwebtoken


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrecto - El correo no existe'
            });
        }

        if ( !user.status ) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrecto - El usuario no esta activo'
            });
        }
        
        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrecto - Password incorrecto'
            });
        }

        const token = await generateJWT( user.id );


        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });        
    }
}

const googleSignIn = async( req, res = response ) => {
    //https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
    //npm install google-auth-library --save
    const { id_token } = req.body;
    
    try {
        const { name, img, email } = await googleVerify( id_token );

        let user = await User.findOne({ email });
        if ( !user ) {
            const data = {
                name,
                email,
                password: "1234",
                img,
                google: true,
                role: "USER_ROLE"
            }
            user = new User( data );
            await user.save();
        }

        if ( !user.status ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario inactivo '
            });
        }

        const token = await generateJWT( user.id );
        
        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'El token no se pudo verificar'
        });
        
    }

}

module.exports = {
    login,
    googleSignIn
}