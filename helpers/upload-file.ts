import path from 'path';
import { v4 as uuidv4 } from 'uuid';



const getFileExtension=(filename:string):string =>{
    return filename.substring(filename.lastIndexOf('.')+1);
}


const uploadFile= async (files:any, fileTypesAllowed:String[]=[],imagesFolder:String=''):Promise =>{


    const fileTypesAllowedDefault:string[]=[
        'gif',
        'jpeg',
        'jpg',
        'png',
    ];

        
    return new Promise( (resolve,reject) =>{

        
        try {
        
            fileTypesAllowed= (fileTypesAllowed.length < 0)? fileTypesAllowed : fileTypesAllowedDefault;

            const {fileUp}=files;
            
            const fileExt= getFileExtension(fileUp.name);
        
            if(!fileTypesAllowed.includes(fileExt)){
                return reject(`El achivo ${ fileExt } no es soportado. Se aceptan ${fileTypesAllowed}`);
            }

            const fileNewName:string=uuidv4() +"."+ fileExt;

            const uploadPath = path.join(__dirname,'../uploads/', imagesFolder,fileNewName);
                    
            fileUp.mv(uploadPath, function(err) {
                if (err) {
                    return reject(err);
                }
                resolve (fileNewName);
            });
        
        } catch (error) {

            console.log(error);

        }

    });

    
}


export default uploadFile;