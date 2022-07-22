import { Schema, model } from "mongoose";

const ProductSchema= new Schema({
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

ProductSchema.methods.toJSON = function(){
    const {__v, _id,...ProductData} = this.toObject();
    return ProductData;
}


export default model('Product', ProductSchema);