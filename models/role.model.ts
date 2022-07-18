
import { Schema, model } from "mongoose";

const RoleSchema= new Schema({
    role:{
        type:String,
        required: [true,'El rol es requerido']
    }
});



export default model('Role', RoleSchema);