const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
//npm i bcryptjs
//https://www.npmjs.com/package/bcryptjs
const User = require('../models/user');


// GET
const usersGet = async(  req = request, res = response ) => {
    const { limit = 3, from = 0 } = req.query;
    /*
    const users = await User.find({ status: true })
        .skip(Number( from ))
        .limit(Number( limit ));
    const totalRecords = await User.countDocuments({ status: true });
    */
    const [ totalRecords, users ] = await Promise.all([
        User.countDocuments({ status: true }),
        User.find({ status: true })
            .skip(Number( from ))
            .limit(Number( limit ))
    ]);

    res.json({
        totalRecords,
        users
    });
}
// POST
const usersPost = async( req, res = response ) => {
    const { name, email, password, role } = req.body;
    const user = new User ( { name, email, password, role } );
    
    // Hash Password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    await user.save();

    res.json({ user });
}
// PUT
const usersPut = async( req, res = response ) => {
    const { id } = req.params;
    const { _id, password, google, ...rest} = req.body;

    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt );
    }
    const user = await User.findByIdAndUpdate( id, rest );

    res.json({ user });
}

//DELETE
const usersDelete = async( req, res = response ) => {
    const { id } = req.params; 
    const user = await User.findByIdAndUpdate( id, { status: false } );
    res.json( user );
}

module.exports = { 
    usersGet,
    usersPost,
    usersPut,
    usersDelete
}