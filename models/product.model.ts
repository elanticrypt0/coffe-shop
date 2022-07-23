import { Schema, model } from "mongoose";

const ProductSchema= new Schema({
    name:{
        type:String,
        required: [true,'El nombre es requerido'],
    },
    status:{
        type:Boolean,
        default:true,
        required: [true,'El status es obligatorio']
    },
    created_by:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required: [true,'El producto debe tener un usuario']
    },
    price:{
        type:Number,
        default:0,
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category',
        required:[true,'La categoría es obligatoria'],
    },
    description:{
        type:String,
    },
    available:{
        type:Boolean,
        required:[true,'La disponibildiad es obligatoria']
    }
});

ProductSchema.methods.toJSON = function(){
    const {__v,...data} = this.toObject();
    return data;
}

export default model('Product', ProductSchema);