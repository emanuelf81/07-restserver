const { Router } = require('express');
const { check } = require('express-validator');//https://www.npmjs.com/package/express-validator
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categories');
const { existsCategoryById } = require('../helpers/db-validators');

const router = Router();


router.get( '/', getCategories );

router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existsCategoryById ),
    validateFields
], getCategoryById );

router.post( '/', [ 
    validateJWT,
    check('name','El nombre es obligatorio').not().isEmpty(),
    validateFields
    ], createCategory );

router.put('/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existsCategoryById ),
    validateFields
], updateCategory );

router.delete('/:id', [
    validateJWT,
    check('id', 'No es un id de mongo válido').isMongoId(),
    check('id').custom( existsCategoryById ),
    validateFields
], deleteCategory);

module.exports = router;