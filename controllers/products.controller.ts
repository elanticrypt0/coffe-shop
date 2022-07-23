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
        const [total,products]=await Promise.all([
            ProductModel.countDocuments(query),
            ProductModel.find(query)
                .populate('created_by','email')
                .populate('category','name')
                .skip(from)
                .limit(limit)
        ]);

        return res.json({
            total,
            products
        });

    }
    public async getOnlyOne(req:any ,res=response):Promise<any>{

        const id=req.params.id;
        
        const ProductFromDB=await ProductModel.findById(id)
                            .populate('created_by','email')
                            .populate('category','name');
        
        return res.json({
            Product:ProductFromDB
        });
        
    }
    public async post(req:any ,res=response):Promise<any>{

        const userAuthorized:UserInterface | null =req.userAuthorized;
        const {name,price,category,description,available} = req.body;
        
        const ProductInDB:ProductInterface | null=await ProductModel.findOne({name});
        if(ProductInDB){
            return res.status(400).json({
                msg:`El producto ${name} ya existe.`
            });
        }

        const product=new ProductModel({
            name,
            status:true,
            created_by:userAuthorized._id,
            price,
            category,
            description,
            available
        });
        try {
            await product.save();
        
            return res.status(200).json({
                product,
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

        const ProductFromDB=await ProductModel.findByIdAndUpdate(id,{name,created_by:userAuthorized?._id},{new:true});
        
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
            product:ProductFromDB,
            userAuthorized
        });
    }

}

export default ProductsController;