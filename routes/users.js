const { Router } = require('express');
const { check } = require('express-validator');//https://www.npmjs.com/package/express-validator
const { validateFields } = require('../middlewares/validate-fields');
const { isValidRole, emailExists, existsUserById } = require('../helpers/db-validators');

const { usersGet, usersPost, usersPut, usersDelete, usersPatch } = require('../controllers/users');

const router = Router();

router.get('/', usersGet );

router.post('/',[
    check( 'name', 'El nombre es obligatorio').not().isEmpty(),
    check( 'password', 'El password debe contener 6 caracteres').isLength({ min: 6 }),
    check( 'email' ).custom( emailExists ),
    //check( 'role', 'No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    /* Role va a ser validado contra la base de datos en mongo asi es más fácil de controlar y modificar
    Pasos:
    - Mongo Compas
        - cafeDB
        - Create collection "roles"
        - BD "roles"
        - ADD DATA
        - un ej:
        {
            "_id": {
            "$oid": "6397e42a360797966c2761d5"
            },
            "role": "ADMIN_ROLE"
        }
    */
    check('role').custom( isValidRole ),
    validateFields  
], usersPost );

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsUserById ),
    check('role').custom( isValidRole ),
    validateFields 
], usersPut );

router.patch( '/', usersPatch );

router.delete( '/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsUserById ),
    validateFields 
], usersDelete );


module.exports = router;
