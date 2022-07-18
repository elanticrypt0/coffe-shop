import mongoose from "mongoose";

const dbConn= async(urlDbConnect:string | undefined)=>{

    try {

        await mongoose.connect(<string>urlDbConnect);
        
        console.log('Base de datos Online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexión de la DB.');
    }

}

export default dbConn;
