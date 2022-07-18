import { response } from 'express';

import User from "../models/user.model";
import { passwordHash } from "../helpers/hash";
import { isNumberObject } from "util/types";
import { UserInterface } from '../interfaces/user.interface';

class UsersController{
    

    constructor(){
        
    }

    public async get(req:any,res=response):Promise<any>{
        
        let { from=0, limit=5 } = req.query;
        // traigo sólo los registros que están activos.
        const query={status:true}; 

        from=Number(from);
        limit=Number(limit);
        
        if(isNaN(from)) from=0;
        if(isNaN(limit)) limit=1;

        //  El problema es que ejecutando de esta forma disparo dos promesas sucesivas: una y después la otra.
        // const users=await User.find(query)
        //     .skip(from)
        //     .limit(limit); 
        // const total=await User.countDocuments(query);
        
        // De esta forma ejecuto las dos promesas juntas. Hasta que no terminan las dos no obtengo el result.
        const [total,users]=await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(from)
                .limit(limit)
        ]);

        res.json({
            total,
            users
        });
    }
    public async getOnlyOne(req:any,res=response):Promise<any>{
        
        const id=req.params.id;
        
        const userFromDB=await User.findById(id);
        
        res.json({
            userFromDB
        });
    }
    public async put(req:any,res=response):Promise<any>{
        const id=req.params.id;
        const {_id, password,google, email,...restData}=req.body;

        // si viene el password le user desea actualizar el passw
        if(password){
            restData.password=passwordHash(password);
        }
        const userFromDB=await User.findByIdAndUpdate(id,restData);
        res.json({
            userFromDB
        });
    }
    public async post(req:any,res=response):Promise<any>{

        const { name, email, password, role }= req.body;
        const user=new User({name, email, password,role});        
        // encriptar passw
        user.password = passwordHash(password);
        // guardar en db
        try {
            await user.save();
        } catch (error) {
            console.error(error);
            throw new Error('Fallo al guardar el usuario');
        }
        
        res.json({
            user
        });
    }
    public async delete(req:any,res=response):Promise<any>{
        // Este es el usuario que necesito para ejecutar este query
        const userAuthorized:UserInterface | null=req.userAuthorized;
        // usuario a borrar
        const id=req.params.id;
        const userFromDB=await User.findByIdAndUpdate(id,{status:false});
        res.json({
            userFromDB,
            userAuthorized
        });
    }

}

export default UsersController;