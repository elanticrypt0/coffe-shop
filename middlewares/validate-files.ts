const validateFiles=(req:any,res:any,next:Function) => {

    
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.fileUp) {
        return res.status(400).json({msg:'No hay archivos para subir.'});
    }

    next();

}

export default validateFiles;