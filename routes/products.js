const { Router } = require('express');
const { check } = require('express-validator');//https://www.npmjs.com/package/express-validator
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { existsProductById, existsCategoryById } = require('../helpers/db-validators');

const router = Router();

router.get( '/', getProducts );

router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existsProductById ),
    validateFields
], getProductById );

router.post( '/', [ 
    validateJWT,
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un id de Mongo').isMongoId(),
    //check('category').custom( existsCategoryById ),
    validateFields
], createProduct );

router.put('/:id', [
    validateJWT,
    //check('category', 'No es un id de Mongo').isMongoId(),
    //check('price', 'Caracteres inválidos').isNumeric(),
    check('id').custom( existsProductById ),
    validateFields
], updateProduct );

router.delete('/:id', [
    validateJWT,
    check('id', 'No es un id de mongo válido').isMongoId(),
    check('id').custom( existsProductById ),
    validateFields
], deleteProduct);

module.exports = router;