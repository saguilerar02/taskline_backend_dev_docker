import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jsonwetoken from 'jsonwebtoken'
import { responseUserErrorMaker } from '../Handlers/ErrorHandler'
import User from '../models/USER/User'
import { encriptarPassword } from '../services/Bcrypter'
import { sendResetPasswordEmail } from '../services/Mailer'

export const signUp= async function(req:Request, res:Response) {

    if( req.body && Object.keys(req.body).length>0){
        try{
            let user = new User(req.body);
            user.password = await encriptarPassword(req.body.password);
            await user.save();
            res.status(401).send({msg:'Usuario registrado con exito'});

        }catch(err){
            let response = responseUserErrorMaker(err);
            res.status(response.status).send({error:response.data})
        }
    }else{
        res.status(500).send({msg: 'La petición no es válida'});
    }
}

export const signIn =async function (req:Request, res:Response) {

    try{
        if(req.body.email && req.body.password){
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
        }else{
            res.status(500).send({msg:'El email y la contraseña son necesarios para hacer login'});
        }
    }catch(err){
        res.status(500).send({msg:'Ha ocurrido un error inesperado, por favor inténtelo más tarde'});
    }
}

export const resetUserPassword= async function (req:Request, res:Response) {
    try{
        if(req.params && req.params['user']&& req.params['token'] && req.body && req.body.pass1 && req.body.pass2){
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
                        res.status(500).send({msg:'Las contraseñas no coinciden'});
                    }
                }else{
                    res.status(500).send({error:'Token inválido'});
                }
            }else{
                res.status(500).send({error:'No se ha encontrado al usuario'});
            }
        }else{
            res.status(404).send({error:'No tiene permiso para acceder a este enlace'});
        }
    }catch(err){
        res.status(500).send({msg:'Ha ocurrido un error inesperado, por favor inténtelo más tarde'});
    }
}

export const sendMailResetPassword= async function (req:Request, res:Response) {
    try{
        if(req.body.email){
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
        }else{
            res.status(500).send({msg:'Email and password are needed'});
        }
    }catch(err){
        //console.log(err);
        res.status(500).send({msg:'Ha ocurrido un error inesperado, por favor inténtelo más tarde'});

    }
}