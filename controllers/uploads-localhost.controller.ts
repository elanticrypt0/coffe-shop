import path from 'path';
import fs from 'fs';

import { response } from 'express';
import uploadFile from '../helpers/upload-file';

import UserModel from '../models/user.model';
import ProductModel from '../models/product.model';

class UploadsController{

    constructor() {}

    public async post(req,res=response):any{

        try {
            
            const fullPath=await uploadFile(req.files,['txt']).then((resp)=>{
                return res.status(400).json({
                    file:resp
                });
            }).catch(err => {
                res.status(400).json({
                    err
                });
            });

        } catch (error) {

            res.status(400).json({
                error
            });
            
        }
        
    }

    public async put(req,res=response):any{

        const {id, collection}= req.params;
        try {
            
                let model: any;
                let fullPath:string;
                switch (collection) {
                    case 'users':
                            
                            model=await UserModel.findById(id);
                            
                            if(!model){
                                return res.status(400).json({
                                    msg:'No existe un usuario con ese ID'
                                });
                            }

                            if(model.img){
                                deleteImgIfExist(model.img,collection);
                            }
                            
                            fullPath=await uploadFile(req.files,[],collection.toLowerCase()).then((resp)=>{
                                model.img=resp;
                            }).catch(err => {
                                res.status(400).json({
                                    err
                                });
                            });
                            
                            await model.save();

                        break;
                    case 'products':

                        model=await ProductModel.findById(id);
                        
                        if(!model){
                            return res.status(400).json({
                                msg:'No existe un producto con ese ID'
                            });
                        }

                        if(model.img){
                            deleteImgIfExist(model.img,collection);
                        }
                        
                        fullPath=await uploadFile(req.files,[],collection.toLowerCase()).then((resp)=>{
                            model.img=resp;
                        }).catch(err => {
                            res.status(400).json({
                                err
                            });
                        });
                        
                        await model.save();

                    break;
                    default:
                        break;
                }

                return res.status(400).json({
                    collection:model,
                });

        } catch (error) {

            res.status(400).json({
                error
            });
            
        }

        return true;
    }

    public async get(req,res=response):any{

        const {id, collection}= req.params;
        let img:string=defaultImg;
        try {
            
                let model: any;
                switch (collection) {
                    case 'users':
                            
                            model=await UserModel.findById(id);
                            
                            if(!model){
                                return res.status(400).json({
                                    msg:'No existe un usuario con ese ID'
                                });
                            }
                            
                            return res.sendFile(getImagePath(model.img,collection));
                            
                            break;
                            case 'products':
                                
                                model=await ProductModel.findById(id);
                                
                                if(!model){
                                    return res.status(400).json({
                                        msg:'No existe un producto con ese ID'
                                    });
                                }
                                
                                return res.sendFile(getImagePath(model.img,collection));

                    break;
                }

        } catch (error) {
            res.status(400).json({
                error
            });
            
        }

        return true;
    }


}

const defaultImg='no-image.jpg';

const getImagePath=(img:string,imagesFolder:string)=>{
    
    const imgPath:string= (img)? path.join(__dirname,'../uploads/', imagesFolder,img)
                                : path.join(__dirname,'../uploads/',defaultImg);
    
    if(fs.existsSync(imgPath)){
        return imgPath;
    }
    
    return false;
}

const deleteImgIfExist=(img:string,imagesFolder:string):boolean =>{
    const imgPath= getImagePath(img,imagesFolder);
    if(fs.existsSync(imgPath)){
        fs.unlinkSync(imgPath);
        return true;
    }
    return false;
}


export default UploadsController;