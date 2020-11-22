import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import fs from 'fs'
import jsonwetoken from 'jsonwebtoken'
import { responseUserErrorMaker } from '../handlers/ErrorHandler'
import { IUser } from '../models/user/IUser'
import User from '../models/user/User'
import { comparePassword, encriptarPassword } from '../services/Bcrypter'
import { sendResetPasswordEmail } from '../services/Mailer'

export const signUp= async function(req:Request, res:Response) {

    if( req.body && Object.keys(req.body).length>0){
        try{
            let user = new User(req.body);
            let saved = await user.save();
            if(saved){
                res.status(201).send({type:'SUCCESS', msg:'Usuario registrado con exito'});
            }else{
                res.status(401).send({type:'ERROR', error:'Ha ocurrido un error al registrar el usuario'});
            }
        }catch(err){
            let response = responseUserErrorMaker(err);
            res.status(response.status).send({type:response.error.type, error:response.error.error});
        }
    }else{
        res.status(400).send({type:'ERROR', error:"Deber rellenar el formulario de registro"});
    }
}

export const signIn =async function (req:Request, res:Response) {

    if(req.body.email && req.body.password){
        try{
            let user = await User.findOne({email:req.body.email});
            if(user){
                const pass = await bcrypt.compare(req.body.password,user.password.toString());
                if(pass){
                
                    let token = await jsonwetoken.sign({user:user.id},process.env.PRIVATE_KEY as string,{
                        issuer:'taskline',
                        audience:'https://beermaginary.com',
                        algorithm:"RS256",
                        expiresIn: "3h"
                    });
                    res.status(200).send({type:'SUCCES',msg:'Ha iniciado sesión correctamente',user:user.id,token:token});
                }else{
                    res.status(500).send({type:"BAD_CREDENTIALS", error:'El email y la contraseña no corresponden'});
                }
            }else{
                res.status(500).send({type:"BAD_CREDENTIALS", error:'El email y la contraseña no corresponden'});
            }
        }catch(err){
            res.status(500).send({type:"ERROR", error:'Ha ocurrido un error inesperado, por favor inténtelo más tarde'});
        }
    }else{
        res.status(400).send({type:"ERROR", error:'El email y la contraseña son necesarios para hacer login'});
    }
}

export const resetUserPassword= async function (req:Request, res:Response) {
    
    if(req.params && req.params['user']&& req.params['token'] && req.body && req.body.pass1 && req.body.pass2){
        try{
            let user = await User.findById(req.params['user']);
            if(user){
                let key = user.password+user.createdAt.toDateString();
                let token = jsonwetoken.verify(req.params['token'],key,
                { 
                    issuer:'taskline',
                    audience:'https://beermaginary.com'
                });
                if(token){
                    if(req.body.pass1.length>0 && req.body.pass1.length>0 && req.body.pass1 === req.body.pass2){
                        if(req.body.pass1 !== comparePassword(req.body.pass1,user.password.toString())){
                            user.password=await encriptarPassword(req.body.pass1);
                            await user.save();
                            res.status(200).send({type:"SUCCESS",msg:'La contraseña ha sido cambiada con éxito'});
                        }else{
                            res.status(403).send({type:"BAD_CREDENTIALS",error:'Las contraseña no puede ser la misma de antes'});
                        }
                        
                    }else{
                        res.status(403).send({type:"BAD_CREDENTIALS",error:'Las contraseñas no coinciden'});
                    }
                }else{
                    res.status(403).send({type:"ERROR",error:'Token inválido'});
                }
            
            }else{
                res.status(404).send({type:"ERROR",error:'No se ha encontrado al usuario'});
            }
        }catch(err){
            res.status(500).send({type:"ERROR",error:'Ha ocurrido un error inesperado, por favor inténtelo más tarde'});
        }
    }else{
        res.status(403).send({type:"ERROR",error:'No tiene permiso para acceder a este enlace'});
    }
    
}

export const sendMailResetPassword= async function (req:Request, res:Response) {
    
        if(req.body.email){
            try{
                let user = await User.findOne({email:req.body.email});
                if(user){
                    let token = await jsonwetoken.sign({user:user.id},(user.password+user.createdAt.toDateString()),{
                        issuer:'taskline',
                        audience:'https://beermaginary.com',
                        expiresIn: '1h'
                    });
                    await sendResetPasswordEmail(user,token);
                    res.status(200).send({type:"SUCCESS",msg:'Email de reseteo de password enviado'});
                }else{
                    res.status(500).send({type:"ERROR",error:'This users dont exists'});
                }
            }catch(err){
                console.log(req.body)
                res.status(500).send({type:"ERROR",error:'Ha ocurrido un error inesperado, por favor inténtelo más tarde'});
            }
        }else{
            res.status(400).send({type:"ERROR",error:'El email es necesarios para poder enviar el email de reset'});
        }
    
}

export const updateUser= async function(req:Request, res:Response) {

    if( req.body){
        try{
            let user = await User.findOne({_id:req.user});
            if(user){
                let updated:any = await user.updateOne(req.body,{runValidators:true});
                if (updated && updated.nModified>0) {
                    res.status(201).send({type:'SUCCESS', msg: "El perfil de usuario se ha actualizado con éxito" });
                } else {
                    res.status(500).send({ type:'ERROR',error: "Ha ocurrido un error inesperado, no se pudo actualizar el perfil de Usuario" });
                }
            }else{
                res.status(404).send({ type:'ERROR',error:'El usuario especificado no se encontró'});
            }

        }catch(err){
            let response = responseUserErrorMaker(err);
            res.status(response.status).send({type:response.error.type, error:response.error.error});
        }
    }else{
        res.status(500).send({ type:'ERROR',error:'La petición no es válida'});
    }
}

export const getUserProfile= async function(req:Request, res:Response) {
    if( req.user){
        try{
            let user =await User.findOne({_id:req.user}).select("email username name phoneNumber birthDate profileImage");
            if(user){
                let img="";
                if(!user.profileImage.startsWith('/defaults')){
                    if(fs.existsSync(user.profileImage.toString())){
                        
                        img= fs.readFileSync(user.profileImage.toString(),{encoding: 'base64'})
                    }else{
                        img= fs.readFileSync(process.env.DEFAULT_USER_IMAGE as string,{encoding: 'base64'})
                    }
                    
                }else{
                    img= fs.readFileSync(process.env.DEFAULT_USER_IMAGE as string,{encoding: 'base64'})
                }
                res.status(200).send({type:"SUCCESS", user:user, img:'data:image/png;base64,' + img});
            }else{
                res.status(404).send({type:"ERROR",error:"El usuario especificado no se encontró"});
            }
        }catch(err){
            res.status(500).send({type:"ERROR",error:"Ha ocurrido un error al intentar obtener el usuario"})
        }
    }else{
        res.status(500).send({type:"ERROR",error: 'La petición no es válida'});
    }
}

export const changeProfileImage = async function (req:Request, res:Response) {
    if( req.user && req.file){
        try{
            let user =await User.findOne({_id:req.user});
            if(user){
                let updated = await user.updateOne({profileImage: process.env.UPLOADS +req.file.filename});
                if (updated && updated.nModified && updated.nModified>0) {
                    res.status(200).send({msg:"Foto de perfil actualizada"});
                }else{
                    if(fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                    res.status(500).send({type:"ERROR", error: "Ha ocurrido un error inesperado, no se pudo actualizar la foto de perfil" });
                }
            }else{
                if(fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                res.status(404).send({type:"ERROR",error:"El usuario especificado no se encontró"});
            }
        }catch(err){
            let response = responseUserErrorMaker(err);
            if(fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            res.status(response.status).send({type:"ERROR",error:response.error})
        }
    }else{
        res.status(500).send({msg: 'La petición no es válida'});
    }
    
}
export const getUserDTO= async function(req:Request, res:Response) {

    if( req.user){
        try{
            let user =await User.findOne({_id:req.user}).select("username profileImage");
            if(user){
                let img = "";
                let username = "";
                if(!user.profileImage.startsWith('/defaults')){
                    if(fs.existsSync(user.profileImage.toString())){
                        
                        img= fs.readFileSync(user.profileImage.toString(),{encoding: 'base64'})
                    }else{
                        img= fs.readFileSync(process.env.DEFAULT_USER_IMAGE as string,{encoding: 'base64'})
                    }
                    
                }else{
                    img= fs.readFileSync(process.env.DEFAULT_USER_IMAGE as string,{encoding: 'base64'})
                }
                user.profileImage ='data:image/png;base64,' +img

                res.status(200).send({user:user});
            }else{
                res.status(404).send({type:"ERROR",error:"El usuario especificado no se encontró"});
            }
        }catch(err){
            console.log(err);
            res.status(500).send({type:"ERROR",error:"Ha ocurrido un error al intentar obtener el usuario"})
        }
    }else{
        res.status(500).send({type:"ERROR",error: 'La petición no es válida'});
    }
}

export const getUsersByFilter= async function(req:Request, res:Response) {

    if(req.params["username"] && req.params["username"].length>0){
        try{
            let filter = new RegExp('^' + req.params["username"], 'i');
            let users:Array<IUser> =await User.find().where("username").regex(filter).select("username name profileImage");
            if(users.length>0){
                users.map((user)=>{
                    if(!user.profileImage.startsWith('/defaults')){
                        if(fs.existsSync(process.env.UPLOADS as string + user.profileImage.toString())){
                            
                            user.profileImage='data:image/png;base64,'+fs.readFileSync(user.profileImage.toString(),{encoding: 'base64'})
                        }else{
                            user.profileImage='data:image/png;base64,'+fs.readFileSync(process.env.DEFAULT_USER_IMAGE as string,{encoding: 'base64'})
                        }
                        
                    }else{
                        user.profileImage= 'data:image/png;base64,'+fs.readFileSync(process.env.DEFAULT_USER_IMAGE as string,{encoding: 'base64'})
                    }
                })
                res.status(200).send({type:"SUCCESS", users:users});
            }else{
                res.status(404).send({type:"ERROR",error:"El usuario especificado no se encontró"});
            }
        }catch(err){
            console.log(err);
            res.status(500).send({type:"ERROR",error:"Ha ocurrido un error al intentar obtener el usuario"})
        }
    }else{
        res.status(500).send({type:"ERROR",error: 'La petición no es válida'});
    }
}