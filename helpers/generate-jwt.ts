import dotenv from 'dotenv';
dotenv.config();

import jwt, { Secret } from 'jsonwebtoken';

export const ganerateJWT= (uid:string =''):Promise<any> =>{
    return new Promise((resolve,reject) => {
        console.log(uid);
        const payload={ uid };
        jwt.sign(payload,process.env.PRIVATE_KEY,{

        },(err,token)=>{
            if(err){
                console.log(err);
                reject('No se pudo generar el token.');
            } else {
                resolve(token);
            }
        });
    });
};
