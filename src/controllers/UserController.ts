import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import fs from 'fs'
import jsonwetoken from 'jsonwebtoken'
import { responseUserErrorMaker } from '../handlers/ErrorHandler'
import User from '../models/user/User'
import { encriptarPassword } from '../services/Bcrypter'
import { sendResetPasswordEmail } from '../services/Mailer'

export const signUp= async function(req:Request, res:Response) {

    if( req.body && Object.keys(req.body).length>0){
        try{

            if(req.file && req.file.filename){
                req.body.profileImage = req.file.filename
            }
            req.body.profileImage = null
            let user = new User(req.body);
            user.password = await encriptarPassword(req.body.password);
            let saved = await user.save();
            if(saved){
                res.status(201).send({msg:'Usuario registrado con exito'});
            }else{
                if(req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
                res.status(401).send({msg:'Ha ocurrido un error al registrar el usuario'});
            }
        }catch(err){
            console.log(err);
            if( req.file && fs.existsSync(req.file.path))await fs.unlinkSync(req.file.path)
            let response = responseUserErrorMaker(err);
            res.status(response.status).send({error:response.data})
        }
    }else{
        console.log(req.body)
        res.status(400).send("Bad Request: petición inválida");
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
                    console.log('SignedIn successfully');
                    res.status(401).send({token:token});
                }else{
                    res.status(500).send({msg:'El email y la contraseña no corresponden'});
                }
            }else{
                res.status(500).send({msg:'El email y la contraseña no corresponden'});
            }
        }catch(err){
            res.status(500).send({msg:'Ha ocurrido un error inesperado, por favor inténtelo más tarde'});
        }
    }else{
        res.status(400).send({msg:'El email y la contraseña son necesarios para hacer login'});
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
                        user.password=await encriptarPassword(req.body.pass1);
                        await user.save();
                        res.status(200).send({msg:'La contraseña ha sido cambiada con éxito'});
                    }else{
                        res.status(403).send({msg:'Las contraseñas no coinciden'});
                    }
                }else{
                    res.status(403).send({error:'Token inválido'});
                }
            
            }else{
                res.status(404).send({error:'No se ha encontrado al usuario'});
            }
        }catch(err){
            res.status(500).send({msg:'Ha ocurrido un error inesperado, por favor inténtelo más tarde'});
        }
    }else{
        res.status(403).send({error:'No tiene permiso para acceder a este enlace'});
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
                    res.status(500).send({msg:'Email de reseteo de password enviado'});
                }else{
                    res.status(500).send({msg:'This users dont exists'});
                }
            }catch(err){
                res.status(500).send({msg:'Ha ocurrido un error inesperado, por favor inténtelo más tarde'});
            }
        }else{
            res.status(400).send({msg:'El email es necesarios para poder enviar el email de reset'});
        }
    
}

export const updateUser= async function(req:Request, res:Response) {

    if( req.body){
        try{
            console.log(req.body.createdBy)
            let user = await User.findOne({_id:req.body.createdBy});
            if(user){
                if(req.file && req.file.filename){
                    req.body.profileImage = req.file.filename
                }
                let updated:any = await user.updateOne(req.body,{runValidators:true});
                if (updated && updated.nModified>0) {
                    res.status(201).send({msg: "El perfil de usuario se ha actualizado con éxito" });
                } else {
                    console.log(updated)
                    res.status(500).send({ msg: "Ha ocurrido un error inesperado, no se pudo actualizar el perfil de Usuario" });
                }
            }else{
                res.status(404).send({msg:'El usuario especificado no se encontró'});
            }

        }catch(err){
            let response = responseUserErrorMaker(err);
            res.status(response.status).send({error:response.data})
        }
    }else{
        res.status(500).send({msg: 'La petición no es válida'});
    }
}

export const getUserProfile= async function(req:Request, res:Response) {

    if( req.body.createdBy){
        try{
            let user =await User.findOne({_id:req.body.createdBy});
            if(user){
                res.status(200).send({user:user});
            }else{
                res.status(404).send({error:"El usuario especificado no se encontró"});
            }
        }catch(err){
            let response = responseUserErrorMaker(err);
            res.status(response.status).send({error:response.data})
        }
    }else{
        res.status(500).send({msg: 'La petición no es válida'});
    }
}