import { response, request } from 'express';
import UserModel from "../models/user.model";
import bcryptjs from 'bcryptjs';
import { ganerateJWT } from '../helpers/generate-jwt';
import { googleVerify } from '../helpers/google-verify';
// import { Model } from 'mongoose';


class AuthController{


    constructor(){
    }


    public async login(req:any,res= response):Promise<any>{


        const {email,password} = req.body
        let token:string;

        try {
            
            const user= await UserModel.findOne({email});
            if(!user){
                return res.status(400).json({
                    msg:'Usuario / password no son correctos - email'
                });
            }
            if(!user.status){
                return res.status(400).json({
                    msg:'Usuario / password no son correctos - status'
                });
            }
            const validPassword=bcryptjs.compareSync(password,user.password);
            if(!validPassword){
                return res.status(400).json({
                    msg:'Usuario / password no son correctos - passw'
                });
            }
            const token=await ganerateJWT(user.id);
            res.json({
                user,
                token
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg:'Hable con el administrador.'
            });
        }
    }

    public async googleSignIn(req=request,res=response):Promise<any>{
        
        const {id_token}=req.body;
        
        try {
           
            const {email,name,img}=await googleVerify(id_token);

            let user= await UserModel.findOne({email});            

            //? si el usuario no existe entonces lo crea en la base de datos

            if(!user){
                const data={
                    name,
                    email,
                    password:':P',
                    img,
                    google:true,
                    role:'USER'
                }

                user=new User(data);
                await UserModel.save();
            }

            if(!user.status){
                res.status(401).json({
                    msg:'Usuario bloqueado. Hable con el administrador'
                });
            }

            const token=await ganerateJWT(user.id);

            res.json({
                user,
                token
            });
            
        } catch (error) {
            res.status(400).json({
                msg:'No se pudo verificar el token'
            })
        }

    }

    public async googleLogout(req=request,res=response):Promise<any>{
        
    }


}

export default AuthController;
