import { Router } from "express";
import { check } from 'express-validator';
import UploadsController from "../controllers/uploads.controller";

import UsersController from "../controllers/users.controller";
import { isValidRole, isValidEmail, isValidUser } from '../helpers/db-validators';

// Middleware personalizado
import validateFields from "../middlewares/validate-fields";
import { validateJWT } from '../middlewares/validate-jwt';

const router= Router();
const uploads=new UploadsController();

router.post('/',
    validateJWT,
    validateFields
,uploads.post);

export default router;