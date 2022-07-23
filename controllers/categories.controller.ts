import { response } from 'express';

import CategoryModel from "../models/category.model";
import { CategoryInterface } from '../interfaces/category.interface';
import { UserInterface } from '../interfaces/user.interface';


class CategoriesController{

    
    constructor(){
        
    }

    public async get(req:any ,res=response):Promise<any>{
        let { from=0, limit=5 } = req.query;
        // traigo sólo los registros que están activos.
        const query={status:true}; 

        from=Number(from);
        limit=Number(limit);
        
        if(isNaN(from)) from=0;
        if(isNaN(limit)) limit=1;
        const [total,categories]=await Promise.all([
            CategoryModel.countDocuments(query),
            CategoryModel.find(query)
                .populate('created_by','email')    
                .skip(from)
                .limit(limit)
        ]);

        return res.json({
            total,
            categories
        });

    }
    public async getOnlyOne(req:any ,res=response):Promise<any>{

        const id=req.params.id;
        
        const categoryFromDB=await CategoryModel.findById(id).populate('created_by','email');
        
        return res.json({
            category:categoryFromDB
        });
        
    }
    public async post(req:any ,res=response):Promise<any>{

        const name=req.body.name.toUpperCase();
        const userAuthorized:UserInterface | null =req.userAuthorized;
        
        const categoryInDB:CategoryInterface | null=await CategoryModel.findOne({name});
        if(categoryInDB){
            return res.status(400).json({
                msg:`La categoría ${name} ya existe.`
            });
        }
        const category=new CategoryModel({
            name,
            status:true,
            created_by:userAuthorized._id
        });
        try {
            await category.save();
        
            return res.status(200).json({
                category,
                userAuthorized
            });
        } catch (error) {
            return res.status(500).json({
                msg:'Error del servidor. Por favor intente más tarde.'
            });
        }
        
    }
    public async put(req:any ,res=response):Promise<any>{
        
        const userAuthorized:UserInterface | null=req.userAuthorized;
        
        const id=req.params.id;
        const name=req.body.name.toUpperCase();

        try {
            const categoryFromDB=await CategoryModel.findByIdAndUpdate(id,{name,created_by:userAuthorized?._id},{new:true}).populate('created_by','email');
            
            return res.json({
                category:categoryFromDB,
            });
        } catch (error) {
            return res.status(500).json({
                msg:'Error del servidor.'
            });
        }

    }
    public async delete(req:any ,res=response):Promise<any>{
        // Este es el usuario que necesito para ejecutar este query
        const userAuthorized:UserInterface | null=req.userAuthorized;
        // usuario a borrar
        const id=req.params.id;
        const categoryFromDB=await CategoryModel.findByIdAndUpdate(id,{status:false});
        return res.json({
            category:categoryFromDB,
            userAuthorized
        });
    }

}

export default CategoriesController;