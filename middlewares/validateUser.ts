import { validationResult } from 'express-validator';


/*

    Esto es un middleware, una función que se ejecuta antes que otras funciones.
    Le paso los parámetros que necesita y por último un parámetro que es "next",
    que es la función que sigue. En realidad se le pasa la referencia y esta se ejecuta aquí dentro.

*/

const validateFields=(req:any,res:any, next:Function) => {

    const valErrors=validationResult(req);
    if(!valErrors.isEmpty()){
        return res.status(400).json(valErrors);
    }

    next();

}


export default validateFields;