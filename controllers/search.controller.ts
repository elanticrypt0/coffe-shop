import { response } from 'express';
import { isValidObjectId } from 'mongoose';

import UserModel from '../models/user.model';
import CategoryModel from '../models/category.model';
import ProductModel from '../models/product.model';

class SearchController{

    private readonly allowedCollections:string[];

    constructor(){
        this.allowedCollections=[
            'Users',
            'Products',
            'Categories',
        ];
    }

    async find(req:any,res:any=response):Response{

        const allowedCollections:string[]=[
            'categories',
            'products',
            'productsbycategory',
            'users',
        ];
        const { collection='', term='' }=req.params;

        const { from=0, limit=5 } = req.query;

        if(!allowedCollections.includes(collection)) return res.status(402).json({msg:`No se puede buscar... ${ collection } / ${term}`});

        let results:any='';

        switch (collection) {
            case 'products':
                results=await findInProducts(term);
            break;
            case 'productsbycategory':
                results=await findInProductsByCategory(term);
            break;
            case 'users':
                results=await findInUsers(term);
            break;
            case 'categories':
                results=await findInCategories(term);
            break;
            default:
                results='';
            break;
        }        

        console.log(results);

        return res.status(200).json({
            results: [ results ]
        });

    }
       
    

}

const findInProducts = async (term:string):Promise =>{
    
    const isMongoId:Boolean=isValidObjectId(term);
    let results:any='';
    if(isMongoId){
        results=await ProductModel.findById(term).populate('category','name');;
    }else{
        const regExp=new RegExp(term,'i');
        results=await ProductModel.find({name:regExp, status:true})
                                    .populate('category','name')
                                    .populate('created_by','name');
    }
    
    return (results)? results : [];
}

const findInProductsByCategory = async (term:string):Promise =>{
    
    //primero traigo el nombre de la categoría
    
    const regExp=new RegExp(term,'i');
    const categories=await CategoryModel.find({name:regExp, status:true});
    console.log(categories.length);
    let results:any[]=[];

    // results=categories.map(async (elem)=>{
    //     const isMongoId:Boolean=isValidObjectId(elem?._id);
    //     if(isMongoId){
    //         results=await ProductModel.findById(elem?._id).populate('category','name');;
    //     }

    // });

    for (let elem of categories){
        const isMongoId:Boolean=isValidObjectId(elem?._id);
        if(isMongoId){
            results.push(await ProductModel.find({category:elem?._id}).populate('category','name'));
        }
    }

    return (results)? results : [];
}

const findInUsers= async (term:string):Promise=>{
        
    const isMongoId:Boolean=isValidObjectId(term);
    let results:any='';
    if(isMongoId){
        results=await UserModel.findById(term);
    }else{
        const regExp=new RegExp(term,'i');
        results=await UserModel.find({
            $or: [{ name:regExp },{ email:regExp }],
            $and:[{ status:true }]
        });
    }

    return results;
}

const findInCategories= async(term:string) =>{
    
    const isMongoId:Boolean=isValidObjectId(term);
    let results:any='';
    if(isMongoId){
        results=await CategoryModel.findById(term);
    }else{
        const regExp=new RegExp(term,'i');
        results=await CategoryModel.find({ name: regExp, status:true }).populate('created_by','name');
    }
    
    return results;
}

export default SearchController;

