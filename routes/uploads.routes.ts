import { Router } from "express";
import { check } from 'express-validator';
import UploadsController from "../controllers/uploads.controller";

import UsersController from "../controllers/users.controller";
import { isValidCollection, isValidUser } from '../helpers/db-validators';

// Middleware personalizado
import validateFields from "../middlewares/validate-fields";
import { validateJWT } from '../middlewares/validate-jwt';
import validateFiles from '../middlewares/validate-files';

const router= Router();
const uploads=new UploadsController();

router.post('/',
    validateJWT,
    validateFiles,
    validateFields
,uploads.post);

router.put('/:collection/:id',
    validateJWT,
    validateFiles,
    check('id','El ID es obligatorio').isMongoId(),
    check('collection').custom(c => isValidCollection(c, ['users','products'])),
    validateFields
,uploads.put);

router.get('/:collection/:id',
    check('id','El ID es obligatorio').isMongoId(),
    check('collection').custom(c => isValidCollection(c, ['users','products'])),
validateFields,uploads.get);

export default router;