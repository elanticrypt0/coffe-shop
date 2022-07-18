import bcryptjs from 'bcryptjs';

export const passwordHash=(passw:string):string=>{
    const salt= bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(passw,salt);
}