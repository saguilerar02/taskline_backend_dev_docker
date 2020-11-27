import { Request, Response } from 'express';
import { responseErrorMaker } from "../handlers/ErrorHandler";
import { ITask } from '../models/tasks/TASK/ITask';
import Task from "../models/tasks/TASK/Task";
import fs from 'fs'
import moment from 'moment';

const ITEMS = 7;

export const saveTask = async function (req: Request, res: Response) {

    if (req.body && Object.keys(req.body).length > 0) {
        try {
            if (req.body.reminders.length > 5) return res.status(500).send({ type:"ERROR", error: "Máximo 5 reminders por Task" })
                req.body.createdBy = req.user;
                let t = new Task(req.body);
                t.archivementDateTime = moment(req.body.archivementDateTime).toDate();
                
                if (await t.save()) {
                    res.status(201).send({ type:"SUCCESS", task: t, msg:"La Task se ha guardado con éxito" });
                } else {
                    res.status(500).send({ type:"ERROR", error:  "Ha ocurrido un error al intentar guardar la Task, inténtelo de nuevo más  tarde" });
                }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send({type:"VALIDATION_ERROR", error: responseErrorMaker(err) });
            } else {
                if(err.code === 11000){
                    res.status(500).send({type:"ERROR", error: 'La tarea tiene la misma fecha de realización que otra, por favor introduzca una fecha distinta' });
                }
                res.status(500).send({type:"ERROR", error: err.message });
            }
        }
    } else {
        res.status(400).send({ type:"ERROR", error: "Bad Request: La peticion está inválida"});
    }
};

export const deleteOneTask = async function (req: Request, res: Response) {

    if (req.params["id"] && req.params["id"].length > 0) {
        try {

            let t = await Task.findOne({_id:req.params["id"],createdBy:req.user});
            if (t) {
                if ( await t.remove()) {
                    res.status(200).send({type:"SUCCESS", msg: "La Task ha sido borrada con éxito" });
                } else {
                    res.status(500).send({type:"ERROR", error: "No se ha podido borrar la Task, inténtelo de nuevo más tarde" });
                }
            } else {
                res.status(404).send({type:"ERROR", error: "La Task especificada no se encontró" });
            }
        } catch (err) {
            res.status(500).send({type:"ERROR",error: "Ha ocurrido un error al intentar eliminar la Task, inténtelo de nuevo más  tarde" });
        }
    } else {
        res.status(400).send({type:"ERROR",error:"Bad Request: La peticion está inválida"});
    }
};


export const updateTask = async function (req: Request, res: Response) {

    if (req.body && Object.keys(req.body).length > 0 && req.params["id"]) {
        try {
            let t = await Task.findOne({_id:req.params["id"],createdBy:req.user});
            if(t){
                let task = new Task(req.body);
                await  task.validate();
                let updated = await t.updateOne(req.body,{runValidators:true});
                if (updated && updated.nModified>0) {
                    res.status(201).send({type:"SUCCESS", msg:"La Task se ha actualizado con éxito" });
                }else{
                    res.status(500).send({type:"ERROR", error: "Ha ocurrido un error inesperado, no se pudo actualizar la Task" });
                }
            }else {
                res.status(404).send({type:"ERROR", error: "La Task especificada no se encontró" });
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send({type:"VALIDATION_ERROR", error: responseErrorMaker(err) });
            } else {
                if(err.code === 11000){
                    res.status(500).send({type:"ERROR", error: 'La tarea tiene la misma fecha de realización que otra, por favor introduzca una fecha distinta' });
                }
                res.status(500).send({type:"ERROR", error: err.message });
            }
        }
    } else {
        res.status(400).send({type:"ERROR", error:"Bad Request: La peticion está inválida"});
    }
}

export const showTimeLine = async function (req: Request, res: Response) {

        if (req.params) {
            try {
                let tasks:ITask[]|null;
                if(req.params['last']){
                    tasks = await Task.find({$or: 
                                                [{ createdBy: req.user,
                                                    $and: [ 
                                                        { archivementDateTime: { $gte:  moment(req.params['lastDate']).toDate() } }, 
                                                        { _id: { $gt:  req.params['last'] } }
                                                    ] }, 
                                                { contributors:req.user,
                                                    $and: [ 
                                                            { archivementDateTime: { $gte:  moment(req.params['lastDate']).toDate() } }, 
                                                            { _id: { $gt:  req.params['last'] } }
                                                        ]
                                                }

                                                ]}
                                            )
                    .sort({ archivementDateTime: 1, _id:1 })
                    .limit(ITEMS)
                    .populate({
                        path:'idTasklist',
                        model:'TaskList',
                        select:'name _id',
                    })
                    .populate({
                        path:'contributors',
                        model:'User',
                        select:'username name profileImage _id',
                    })
                    .populate({
                        path:"reminders",
                        model:'Reminder'
                    });
                }else {
                    tasks = await Task.find({$or: [{ createdBy: req.user }, {  contributors:req.user }]})
                    .sort({ archivementDateTime: 1, _id:1 })
                    .limit(ITEMS)
                    .populate({
                        path:'idTasklist',
                        model:'TaskList',
                        select:'name _id',
                    }).populate({
                        path:'contributors',
                        model:'User',
                        select:'username name profileImage',
                    })
                    .populate({
                        path:"reminders",
                        model:'Reminder'
                    });
                }
                tasks.map((t)=>{
                    t.contributors.map((c:any)=>{
                        if(c.profileImage){
                            c.profileImage = 'data:image/png;base64,'+fs.readFileSync(c.profileImage, {encoding: 'base64'});
                        }
                    })
                })
                let userTasksNumber =  await Task.find({$or: [{ createdBy: req.user }, {contributors:req.user }]})
                .countDocuments();

                if (tasks && tasks.length > 0) {
                    res.status(200).send({ timeline: tasks, items:userTasksNumber });
                } else {
                    res.status(404).send({ error: "Ya has cargado todas las tareas" });
                }
            } catch (err) {
                console.log(err)
                res.status(500).send({ error: "Ha ocurrido un error inesperado, inténtelo de nuevo más  tarde" });
            }
        
        } else{
            res.status(400).send({ error: "Bad Request: La peticion está inválida"});
        }
    
}