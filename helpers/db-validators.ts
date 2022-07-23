import Role from "../models/role.model";
import User from "../models/user.model";
import Category from "../models/category.model";
import Product from "../models/product.model";

export const isValidRole= async (role='')=>{
    const roleExist = await Role.findOne({role});
    if(!roleExist){
            throw new Error(`El rol: ${role} no existe en la DB.`);
    }
}

export const isValidEmail=async (email='')=>{
    const emailExist= await User.findOne({email});
    if(emailExist){
        throw new Error(`El email: ${email} ya existe con otro usuario.`);
    }
}

export const isValidUser=async (id='')=>{
    const userExist= await User.findById(id);
    if(!userExist){
        throw new Error(`El id: ${id} no es válido.`);
    }
}

export const isValidCategory=async (id='')=>{
    const categoryExist= await Category.findById(id);
    if(!categoryExist){
        throw new Error(`El id: ${id} no es válido.`);
    }
}

export const isValidProduct=async (id='')=>{
    const productExist= await Product.findById(id);
    if(!productExist){
        throw new Error(`El id: ${id} no es válido.`);
    }
}