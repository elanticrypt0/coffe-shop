import { Router } from "express";
import { check } from 'express-validator';
import mongoose from "mongoose";

import SearchController from '../controllers/search.controller';

// Middleware personalizado
import validateFields from "../middlewares/validate-fields";
import { validateJWT } from '../middlewares/validate-jwt';
import { isAdminRole, hasRole } from '../middlewares/validate-roles';
import { isValidProduct,isValidCategory } from '../helpers/db-validators';

const router= Router();
const search=new SearchController();


router.get('/:collection/:term'
,search.find)


export default router;