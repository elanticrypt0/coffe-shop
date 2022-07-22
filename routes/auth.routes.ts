import { Router } from "express";
import { check } from 'express-validator';

import AuthController from "../controllers/auth.controller";

// Middleware personalizado
import validateFields from "../middlewares/validate-fields";


const router= Router();
const auth=new AuthController();


router.post('/login',
    check('email','Correo no válido').isEmail(),
    check('password').not().isEmpty(),
    validateFields
,auth.login);

router.post('/google',
    check('id_token','Es necesario el Id Token').not().isEmpty(),
    validateFields
,auth.googleSignIn);

router.post('/logout',
    check('id_token','Es necesario el Id Token').not().isEmpty(),
    validateFields
,auth.googleLogout);

export default router;