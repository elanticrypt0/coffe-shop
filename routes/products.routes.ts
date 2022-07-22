import { Router } from "express";
import { check } from 'express-validator';
import mongoose from "mongoose";

import ProductsController from "../controllers/products.controller";


// Middleware personalizado
import validateFields from "../middlewares/validate-fields";
import { validateJWT } from '../middlewares/validate-jwt';
import { isAdminRole, hasRole } from '../middlewares/validate-roles';
import { isValidCategory } from '../helpers/db-validators';



const router= Router();
const Products=new ProductsController();

// public
router.get('/',
        validateFields
,Products.get);
// publico
router.get('/:id',
        check('id').custom(mongoose.Types.ObjectId.isValid),
        check('id').custom(isValidCategory),
        validateFields
,Products.getOnlyOne);
// privado con token
router.post('/',
        validateJWT,
        check('name','El nombre del obligatorio').not().isEmpty(),
        validateFields
,Products.post);
// validar privado con token
router.put('/:id',
        validateJWT,
        check('name','El nombre del obligatorio').not().isEmpty(),
        validateFields
,Products.put);
// privado con token
router.delete('/:id',
        validateJWT,
        hasRole('ADMIN','SALES'),
        check('id').custom(mongoose.Types.ObjectId.isValid),
        check('id').custom(isValidCategory),
        validateFields
,Products.delete);


export default router;