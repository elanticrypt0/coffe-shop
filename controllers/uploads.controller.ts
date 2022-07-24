import { resolveSoa } from 'dns';
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


}


export default UploadsController;