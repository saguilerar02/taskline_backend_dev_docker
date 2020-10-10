import Task from "../models/tasks/TaskModel";
import {Request,Response} from 'express'

   export const saveTask= async function (request:Request, res:Response){

        if( request.body && Object.keys(request.body).length>0){
            let session = null;
            try {
                session = await Task.db.startSession();
                await session.startTransaction();
                    await Task.create(request.body);

                await session.commitTransaction();
                res.status(201).send({msg:"Task save success"});

            } catch (err) {
                if(err.name==="ValidationError"){
                    let form_errors:any = {};
                    Object.keys(err.errors).forEach((key) => {
                        form_errors[key]=err.errors[key].message;
                    });
                    console.error(Object.values(form_errors));
                    res.status(422).send(form_errors);
                }else{
                    res.status(500).send({msg: 'Something went wrong, retry again'});
                    console.error("Validation error");
                }
                if(session) await session.abortTransaction();
            }  
        }else{
            res.status(404).send("Bad Request: Request body is null");
        }
       
    };

    export const deleteOne = async function (request:Request, res:Response){

        if(request.params["id"] && request.params["id"].length>0){
            let session = null;
            try {
                session = await Task.db.startSession();
                session.startTransaction({});
                console.log("Transaction Started");

                let t = await Task.findByIdAndDelete(request.params["id"]);
                if(t){
                    session.commitTransaction();
                    res.status(201).send({msg:"Task deleted successfully"});
                }else{
                    if(session) await session.abortTransaction();
                    res.status(404).send({msg:"Task not found"});
                }
            } catch (err) {
                if(session) await session.abortTransaction();
                res.status(500).send({msg:"Something went wrong"});
                console.log("ERROR: Transaction aborted");
            }
        }else{
            res.status(404).send({msg:"No id in the request"}) 
        }
    };


    export const update = async function(request:Request, res:Response){

        if(request.body && Object.keys(request.body).length>0 && request.params["id"]){
            let session = null;
            try {
                session = await Task.db.startSession();
                await session.startTransaction();

                let t = await Task.updateOne({_id:request.params["id"]}, request.body,{runValidators:true});

                if(t){
                    await session.commitTransaction();
                    res.status(201).send({msg:"Task save success"});
                }else{
                    if(session) await session.abortTransaction();
                    res.status(404).send({msg:"Task not found"});
                }
            } catch (err) {
                if(err.name==="ValidationError"){
                    let form_errors:any = {};
                    Object.keys(err.errors).forEach((key) => {
                        form_errors[key]=err.errors[key].message;
                    });
                    console.error(Object.values(form_errors));
                    res.status(422).send(form_errors);
                }else{
                    res.status(500).send({msg: 'Something went wrong, retry again'});
                    console.error(err);
                }
                if(session) await session.abortTransaction();
            }  
        }else{
            res.status(404).send("Bad Request: Request body is null");
        }
    }
/*
    export const getByList = async function(request:Request, res:Response){

        if(request.params["id_tasklist"] && request.params["id_tasklist"].length>0){
            try {
                let t = await Task.find({id_tasklist:request.query.id_tasklist});
                if(t){
                    res.status(201).send({tasks:t});
                }
                res.status(404).send({msg:"No tasks on this list"});
            } catch (err) {
                console.log("ERROR: Something went wrong")
                res.status(500).send({msg:"Something went wrong"});
            }  
        }else{
            res.status(404).send("Bad Request: Request body is empty");
        }
    }
*/


