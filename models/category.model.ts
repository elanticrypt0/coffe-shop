import { Schema, model } from "mongoose";

const CategorySchema= new Schema({
    name:{
        type:String,
        required: [true,'El nombre es requerido'],
        unique:true
    },
    status:{
        type:Boolean,
        default:true,
        required: [true,'El status es obligatorio']
    },
    created_by:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required: [true,'La categoría debe tener un usuario']
    }
});

/* CategorySchema.methods.toJSON = function(){
    const {__v, password, _id,...userData} = this.toObject();
    userData.uid=_id;
    return userData;
} */


export default model('Category', CategorySchema);