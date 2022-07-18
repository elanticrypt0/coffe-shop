import { request, response } from 'express';


export const isAdminRole=(req=request,res=response, next:Function)=>{

    if(!req.userAuthorized){
        return res.status(500).json({
            msg:'Se requiere validar token primero.'
        });
    }

    const {role,name}=req.userAuthorized;

    if(role==='ADMIN'){
        next();
    }else{
        return res.status(401).json({
            msg:`Usuario ${name} no autorizado`
        });
    }
}

export const hasRole=(...roles:string[])=>{
    // Como es un middleweare recibe 3 parámetros: request,response y next - próxima función a ejecutar -
    // entonces este middleware tiene que retornar una función con esos 3 params
    return (req=request,res=response,next:Function)=>{


        if(!req.userAuthorized){
            return res.status(500).json({
                msg:'Se requiere validar token primero.'
            });
        }

        if( !roles.includes(req.userAuthorized.role) ){
            return res.status(401).json({
                msg:'Usuario no autorizado'
            })
        }
        next();
    }

}