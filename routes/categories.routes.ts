import { Router } from "express";
import { check } from 'express-validator';

import CategoriesController from "../controllers/categories.controller";


// Middleware personalizado
import validateFields from "../middlewares/validate-fields";
import { validateJWT } from '../middlewares/validate-jwt';
import { isAdminRole, hasRole } from '../middlewares/validate-roles';
import { isValidCategory } from '../helpers/db-validators';



const router= Router();
const categories=new CategoriesController();

// public
router.get('/',
        validateFields
,categories.get);
// publico
router.get('/:id',
        check('id','El id es obligatorio').isMongoId(),
        check('id').custom(isValidCategory),
        validateFields
,categories.getOnlyOne);
// privado con token
router.post('/',
        validateJWT,
        check('name','El nombre del obligatorio').not().isEmpty(),
        validateFields
,categories.post);
// validar privado con token
router.put('/:id',
        validateJWT,
        check('name','El nombre del obligatorio').not().isEmpty(),
        check('id','El id es obligatorio').isMongoId(),
        check('id').custom(isValidCategory),
        validateFields
,categories.put);
// privado con token
router.delete('/:id',
        validateJWT,
        hasRole('ADMIN','SALES'),
        check('id','El id es obligatorio').isMongoId(),
        check('id').custom(isValidCategory),
        validateFields
,categories.delete);


export default router;