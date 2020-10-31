import bcrypt from 'bcrypt'

export const encriptarPassword = async function (password:string) {
    return await bcrypt.hash(password, 10);
}