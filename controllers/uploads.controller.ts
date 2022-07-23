import { resolveSoa } from 'dns';
import { response } from 'express';
import uploadFile from '../helpers/upload-file';




class UploadsController{

    constructor() {}

    public async post(req,res=response):any{

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.fileUp) {
            res.status(400).json({msg:'No files were uploaded.'});
            return;
        }

        const fullPath=await uploadFile(req.files).then((resp)=>{
            return res.status(400).json({
                file:resp
            });
        }).catch(err => {
            console.log(err);
        });

        
        
    }

}


export default UploadsController;