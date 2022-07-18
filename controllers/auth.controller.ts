import { response } from 'express';
import User from "../models/user.model";
import bcryptjs from 'bcryptjs';
import { ganerateJWT } from '../helpers/generate-jwt';


class AuthController{

    constructor(){
    }


    public async login(req:any,res= response):Promise<any>{


        const {email,password} = req.body
        let token:string;

        try {
            
            const user= await User.findOne({email});
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


}

export default AuthController;

function generateJwt() {
    throw new Error('Function not implemented.');
}
