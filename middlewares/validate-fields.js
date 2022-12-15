const { validationResult } = require('express-validator'); 
//https://www.npmjs.com/package/express-validator
//npm i express-validator


const validateFields = ( req, res, next ) => {

    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json(errors);
    }

    next();
}

module.exports = {
    validateFields
}