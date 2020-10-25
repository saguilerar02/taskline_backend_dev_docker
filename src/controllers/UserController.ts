import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jsonwetoken from 'jsonwebtoken'
import User from '../models/USER/User'

export const signUp= async function(req:Request, res:Response) {

    if( req.body && Object.keys(req.body).length>0){
        try{
            await User.create(req.body);
            res.status(401).send({msg:'User signed up successfully'});

        }catch(err){
            switch(err.constructor.name){
                case 'MongoError':{
                    let message ="Something went wrong";
                    if(err.code === 11000 && err.keyPattern.email === 1){
                        message='Email duplicated';
                    }else if(err.code === 11000 && err.keyPattern.username===1){
                        message='Username duplicated';
                    }
                    res.status(422).send({message});
                }break;
                case 'ValidationError':{
                    let form_errors:any = {};
                    Object.keys(err.errors).forEach((key) => {
                        form_errors[key]=err.errors[key].message;
                    });
                    res.status(500).send({errors:form_errors});
                }break;
                default:{
                    res.status(500).send({msg: 'Something went wrong, retry again'});
                }break;
            }
        }
    }else{
        res.status(500).send({msg: 'Empty Request'});
    }
}

export const signIn =async function (req:Request, res:Response) {

    try{
        if(req.body.email && req.body.password){
            let user = await User.findOne({email:req.body.email});
            if(user){
                const pass = await bcrypt.compare(req.body.password,user.password.toString());
                if(pass){
                    let token = await jsonwetoken.sign({user:user.id},'fasdfdsf',{
                        issuer:'taskline',
                        audience:'https://beermaginary.com',
                        expiresIn: 240
                    });
                    let rt = await jsonwetoken.sign({user:user.id},'fasdfdsf',{
                        issuer:'taskline',
                        audience:'https://beermaginary.com',
                        expiresIn: '1d'
                    });
                    console.log('SignedIn successfully');
                    res.status(401).send({token:token, refresh_token:rt, user:user});
                }else{
                    res.status(500).send({msg:'Email and password not corresponding'});
                }
            }else{
                res.status(500).send({msg:'This users dont exists'});
                
            }
        }else{
            res.status(500).send({msg:'Email and password are needed'});
        }
    }catch(err){
        //console.log(err);
        res.status(500).send({msg:'Something went wrong'});
    }
}
