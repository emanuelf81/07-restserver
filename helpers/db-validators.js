const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async( role = '' ) => {
    const existsRole = await Role.findOne({ role });
    if ( !existsRole ) {
        throw new Error( `El rol ${ role } no está registrado en la DB`);
    }
}

const emailExists = async( email = '' ) => {
    const existsEmail = await User.findOne({ email });
    if ( existsEmail ) {
        throw new Error(`El correo ${ email } ya está registrado`);
    }
}

const existsUserById = async( id ) => {
    const existsUser = await User.findById(id);
    if ( !existsUser ) {
        throw new Error(`El ${ id } ya está registrado`);
    }
}

module.exports = {
    isValidRole,
    emailExists,
    existsUserById
}