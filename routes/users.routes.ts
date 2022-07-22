import { Router } from "express";
import { check } from 'express-validator';
import mongoose from "mongoose";

import UsersController from "../controllers/users.controller";
import { isValidRole, isValidEmail, isValidUser } from '../helpers/db-validators';

// Middleware personalizado
import validateFields from "../middlewares/validate-fields";
import { validateJWT } from '../middlewares/validate-jwt';
import { isAdminRole, hasRole } from '../middlewares/validate-roles';


const router= Router();
const users=new UsersController();


router.get('/', users.get);
router.get('/:id',
        check('id').custom(mongoose.Types.ObjectId.isValid),
        check('id').custom(isValidUser),
        validateFields
, users.getOnlyOne);
router.put('/:id',
        check('id').custom(mongoose.Types.ObjectId.isValid),
        check('id').custom(isValidUser),
        check('role').custom(isValidRole),
        validateFields
, users.put);
router.post('/',
        check('email','Correo no válido').isEmail(),
        check('email').custom(isValidEmail),
        check('password','La contraseña debe tener más de 6 caractéres.').isLength({min:6}),
        check('name','Nombre es obligatorio').not().isEmpty(),
        check('role').custom(isValidRole),
        validateFields
,users.post);
router.delete('/:id',
        validateJWT,
        hasRole('ADMIN','SALES'),
        check('id').custom(mongoose.Types.ObjectId.isValid),
        check('id').custom(isValidUser),
        validateFields
, users.delete);


export default router;