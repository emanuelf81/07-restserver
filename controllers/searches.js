const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const Category = require('../models/category');
const Product = require('../models/product');
const User = require('../models/user');

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async( term = '', res = response ) => {
    
    // Busqueda por Id
    const isMongoId = ObjectId.isValid( term );
    if ( isMongoId ) {
        const user = await User.findById( term );
        return res.json({
            results: (user) ? [ user ] : []
        });
    }

    const regex = new RegExp( term, 'i'); // insensible a la busqueda
    const users = await User.find({ 
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    });

    res.json({
        results: users
    });
}

const searchCategories = async( term = '', res = response ) => {
    
    // Busqueda por Id
    const isMongoId = ObjectId.isValid( term );
    if ( isMongoId ) {
        const category = await Category.findById( term );
        return res.json({
            results: (category) ? [ category ] : []
        });
    }

    const regex = new RegExp( term, 'i'); // insensible a la busqueda
    const categories = await Category.find({ name: regex, status: true });

    res.json({
        results: categories
    });
}

const searchProducts = async( term = '', res = response ) => {
    
    // Busqueda por Id
    const isMongoId = ObjectId.isValid( term );
    if ( isMongoId ) {
        const product = await Product.findById( term ).populate('category','name');
        return res.json({
            results: (product) ? [ product ] : []
        });
    }

    const regex = new RegExp( term, 'i'); // insensible a la busqueda
    const products = await Product.find({ name: regex, status: true }).populate('category','name');

    res.json({
        results: products
    });
}

const search = ( req, res = response ) => {

    const { collection, term } = req.params;

    if ( !allowedCollections.includes( collection ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ allowedCollections }`
        })
    }

    switch (collection) {
        case 'users':
            searchUsers( term, res );
            break;
        case 'categories':
            searchCategories( term, res );
            break;
        case 'products':
            searchProducts( term, res );
            break;
        
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            })
            break;
    }    
}

module.exports = {
    search
}