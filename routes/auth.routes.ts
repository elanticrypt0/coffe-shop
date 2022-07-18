import { Router } from "express";
import { check } from 'express-validator';

import AuthController from "../controllers/auth.controller";

// Middleware personalizado
import validateFields from "../middlewares/validateUser";


const router= Router();
const auth=new AuthController();


router.post('/login',
    check('email','Correo no válido').isEmail(),
    check('password').not().isEmpty(),
    validateFields
,auth.login);

export default router;