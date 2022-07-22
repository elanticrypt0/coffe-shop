import { request, response } from 'express';
import { Jwt } from "jsonwebtoken";
import jwt from 'jsonwebtoken';
import { isUndefined } from 'util';
import { stringify } from 'querystring';
import User from '../models/user.model';
import { UserInterface } from '../interfaces/user.interface';

export const validateJWT= async (req=request,res = response, next:Function):any =>{

    let token:string='';

    try {
        token=req.header('x-token');
        if(!token) {
            return response.status(401).json({
                msg:'Token no válido'
            });
        }
    } catch (error) {
        console.log('Token inválido.')
        res.status(500).json({
            msg:'Token inválido. Hable con el admin.'
        });
        return false;
    }
    

    try {

        const {uid}= jwt.verify(token,process.env.PRIVATE_KEY);
        // busco el usuario de la db
        const userAuthorized:UserInterface | null=await User.findById(uid);
       
        if(!userAuthorized){
            return res.status(401).json({
                msg:'Token no válido'
            })
       }

       if(!userAuthorized.status){
            return res.status(401).json({
                msg:'Token no válido'
            })
       }


        // paso al request el UID.
        req.userAuthorized=userAuthorized;
        next();

    } catch (error) {
        console.log(error);
        throw new Error('No hay token');
        
    }

}
