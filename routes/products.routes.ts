import { Router } from "express";
import { check } from 'express-validator';

import ProductsController from "../controllers/products.controller";

// Middleware personalizado
import validateFields from "../middlewares/validate-fields";
import { validateJWT } from '../middlewares/validate-jwt';
import { isAdminRole, hasRole } from '../middlewares/validate-roles';
import { isValidProduct,isValidCategory } from '../helpers/db-validators';



const router= Router();
const products=new ProductsController();

// public
router.get('/',
        validateFields
,products.get);
// publico
router.get('/:id',
        check('id','El id es obligatorio').isMongoId(),
        check('id').custom(isValidProduct),
        validateFields
,products.getOnlyOne);
// privado con token
router.post('/',
        validateJWT,
        check('name','El nombre del obligatorio').not().isEmpty(),
        check('category','La categoría es obligatoria').not().isEmpty(),
        check('category').custom(isValidCategory),
        check('available','La disponiblidad es obligatoria'),
        validateFields
,products.post);
// validar privado con token
router.put('/:id',
        validateJWT,
        check('name','El nombre del obligatorio').not().isEmpty(),
        check('category','La categoría es obligatoria').not().isEmpty(),
        check('category').custom(isValidCategory),
        check('available','La disponiblidad es obligatoria'),
        check('id','El id es obligatorio').isMongoId(),
        check('id').custom(isValidProduct),
        validateFields
,products.put);
// privado con token
router.delete('/:id',
        validateJWT,
        hasRole('ADMIN','SALES'),
        check('id','El id es obligatorio').isMongoId(),
        check('id').custom(isValidProduct),
        validateFields
,products.delete);


export default router;