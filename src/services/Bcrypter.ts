import bcrypt from 'bcrypt'

export const encriptarPassword = async function (password:string) {
    return await bcrypt.hash(password, 10);
}

export const comparePassword = async function (password:string, hashedpassword:string) {
    return await bcrypt.compare(password, hashedpassword);
}