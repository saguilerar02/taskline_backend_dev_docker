import { Request, Response } from 'express';
import { responseErrorMaker } from "../Handlers/ErrorHandler";
import { ITask } from '../models/tasks/TASK/ITask';
import Task from "../models/tasks/TASK/Task";


export const saveTask = async function (request: Request, res: Response) {

    if (request.body && Object.keys(request.body).length > 0) {
        try {
            if (request.body.reminders.length > 5) return res.status(500).send({ error: "Máximo 5 reminders por Task" })

            let t = new Task(request.body);
            
            if (await t.save()) {
                res.status(201).send({ task: t, msg: "La Task se ha guardado con éxito" });
            } else {
                res.status(500).send({ msg: "Ha ocurrido un error al intentar guardar la Task, inténtelo de nuevo más  tarde" });
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send(responseErrorMaker(err));
            } else {
                res.status(500).send({ error: err.message });
            }
        }
    } else {
        res.status(404).send("Bad Request: Request body is null");
    }
};

export const deleteOneTask = async function (request: Request, res: Response) {

    if (request.params["id"] && request.params["id"].length > 0) {
        try {

            let t = await Task.findById(request.params["id"]);
            console.log(t);
            if (t) {
                if ( await t.remove()) {
                    res.status(201).send({ msg: "Task deleted successfully" });
                } else {
                    res.status(404).send({ msg: "Impossible to delete this task, try again later" });
                }
            } else {
                res.status(500).send({ msg: "Task not found" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send({ msg: "Ha ocurrido un error al intentar eliminar la Task, inténtelo de nuevo más  tarde" });
        }
    } else {
        res.status(404).send({ msg: "No se ha especificado la Id de la tarea" })
    }
};


export const updateTask = async function (req: Request, res: Response) {

    if (req.body && Object.keys(req.body).length > 0 && req.params["id"]) {
        try {

            let t = await Task.findById(req.params["id"]);
            if(t){
               let updated = await t.updateOne(req.body,{runValidators:true});
                if (updated) {
                    res.status(201).send({msg: "La tarea se ha actualizado con éxito" });
                } else {
                    res.status(404).send({ msg: "Task not found" });
                }
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send(responseErrorMaker(err));
            } else {
                res.status(500).send({ msg: 'Something went wrong, retry again' });
                console.error(err);
            }
        }
    } else {
        res.status(404).send("Bad Request: Request body is null");
    }
}

export const showTimeLine = async function (req: Request, res: Response) {

    try {
        if (req.params && req.params['user']) {
            let tasks:ITask[]|null;
            if(req.params['last']){
                tasks = await Task.find({ "createdBy": req.params['user'], "_id": { $lt: req.params['last'] }, "status":"PENDING"  })
                .sort({ archivementDateTime: -1, _id: -1 })
                .limit(7);
            }else {
                console.log('Hola');
                tasks = await Task.find({ "createdBy": req.params['user'] })
                .sort({ archivementDateTime: -1, _id: -1 })
                .limit(7);
            }
            if (tasks && tasks.length > 0) {
                res.status(201).send({ timeline: tasks });
            } else {
                res.status(404).send({ msg: "Empty timeline" });
            }
        
        } else{
            res.status(500).send({ error: "Los parametros no son los correctos" });
        }
    } catch (err) {

        res.status(500).send({ msg: 'Something went wrong, retry again' });
        console.error(err);
    }
}