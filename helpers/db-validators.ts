import Role from "../models/role.model";
import User from "../models/user.model";
import Category from "../models/category.model";
import Product from "../models/product.model";

export const isValidRole= async (role='')=>{
    const roleExist = await Role.findOne({role});
    if(!roleExist){
        throw new Error(`El rol: ${role} no existe en la DB.`);
    }
    return true;
}

export const isValidEmail=async (email='')=>{
    const emailExist= await User.findOne({email});
    if(emailExist){
        throw new Error(`El email: ${email} ya existe con otro usuario.`);
    }
    return true;
}

export const isValidUser=async (id='')=>{
    const userExist= await User.findById(id);
    if(!userExist){
        throw new Error(`El id: ${id} no es válido.`);
    }
    return true;
}

export const isValidCategory=async (id='')=>{
    const categoryExist= await Category.findById(id);
    if(!categoryExist){
        throw new Error(`El id: ${id} no es válido.`);
    }
    return true;
}

export const isValidProduct=async (id='')=>{
    const productExist= await Product.findById(id);
    if(!productExist){
        throw new Error(`El id: ${id} no es válido.`);
    }
    
    return true;
}

export const isValidCollection= async (c:String , collections:String[]):Boolean{
    if(!collections.includes(c)){
        throw new Error(`La colección ${ c } no es válida. Colecciones válidas: ${ collections }`);
    }
    return true;
}