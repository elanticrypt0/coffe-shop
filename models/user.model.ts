import { Schema, model } from "mongoose";

const UserSchema= new Schema({
    name:{
        type:String,
        required: [true,'El nombre es requerido']
    },
    email:{
        type:String,
        required:[true, 'El email es obligatorio']
    },
    password:{
        type:String,
        required:[true,'Contraseña obligatoria']
    },
    img:{
            type:String,
    },
    role:{
        type:String,
        required:[true,'Contraseña obligatoria'],
        enum:['ADMIN','USER']
    },
    status:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    },
});


/*? Esta funció sobre-escribe a la función toJSON y lo que hago es:
    desestructurar quitando el valor de versión (__v) y password del objeto
    al ser pasado por la funcion toJSON
    y el resto de los datos: utilizo la función REST(resto) (...NOMBRE VAR)
    los devuelvo en un return para poder seguir trabajando con el objeto por fuera.
*/
UserSchema.methods.toJSON = function(){
    const {__v, password, _id,...userData} = this.toObject();
    userData.uid=_id;
    return userData;
}


export default model('User', UserSchema);