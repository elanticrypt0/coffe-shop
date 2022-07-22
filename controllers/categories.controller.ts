import { response } from 'express';


import Category from "../models/category.model";
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
            Category.countDocuments(query),
            Category.find(query)
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
        
        const categoryFromDB=await Category.findById(id);
        
        return res.json({
            categoryFromDB
        });
        
    }
    public async post(req:any ,res=response):Promise<any>{

        const name=req.body.name.toUpperCase();
        const userAuthorized:UserInterface | null=req.userAuthorized;
        
        const categoryInDB:CategoryInterface | null=await Category.findOne({name});
        if(categoryInDB){
            return res.status(400).json({
                msg:`La categoría ${name} ya existe.`
            });
        }

        const category=new Category({
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

        const categoryForUpdate:CategoryInterface={
            _id:id,
            name,
            created_by:userAuthorized._id
        }

        const categoryFromDB=await Category.findByIdAndUpdate(categoryForUpdate);
        return res.json({
            id,
            name,
            categoryFromDB
        });
    }
    public async delete(req:any ,res=response):Promise<any>{
        // Este es el usuario que necesito para ejecutar este query
        const userAuthorized:UserInterface | null=req.userAuthorized;
        // usuario a borrar
        const id=req.params.id;
        const categoryFromDB=await Category.findByIdAndUpdate(id,{status:false});
        return res.json({
            categoryFromDB,
            userAuthorized
        });
    }

}

export default CategoriesController;