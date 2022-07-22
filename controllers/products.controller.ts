import { response } from 'express';

import ProductModel from "../models/product.model";
import { ProductInterface } from '../interfaces/product.interface';
import { UserInterface } from '../interfaces/user.interface';


class ProductsController{
    

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
            ProductModel.countDocuments(query),
            ProductModel.find(query)
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
        
        const ProductFromDB=await ProductModel.findById(id);
        
        return res.json({
            Product:ProductFromDB
        });
        
    }
    public async post(req:any ,res=response):Promise<any>{

        const name=req.body.name.toUpperCase();
        const userAuthorized:UserInterface | null =req.userAuthorized;
        
        const ProductInDB:ProductInterface | null=await ProductModel.findOne({name});
        if(ProductInDB){
            return res.status(400).json({
                msg:`La categoría ${name} ya existe.`
            });
        }

        const product=new ProductModel({
            name,
            status:true,
            created_by:userAuthorized._id
        });
        try {
            await product.save();
        
            return res.status(200).json({
                Product: ProductModel,
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

        const ProductFromDB=await ProductModel.findByIdAndUpdate(id,{name,created_by:userAuthorized?._id});
        ProductFromDB.name=name;

        return res.json({
            Product:ProductFromDB
        });

    }
    public async delete(req:any ,res=response):Promise<any>{
        // Este es el usuario que necesito para ejecutar este query
        const userAuthorized:UserInterface | null=req.userAuthorized;
        // usuario a borrar
        const id=req.params.id;
        const ProductFromDB=await ProductModel.findByIdAndUpdate(id,{status:false});
        return res.json({
            ProductFromDB,
            userAuthorized
        });
    }

}

export default ProductsController;