import { Request, Response } from 'express';
import { responseErrorMaker } from "../Handlers/ErrorHandler";
import { ITask } from "../models/tasks/TASK/ITask";
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


export const updateTask = async function (request: Request, res: Response) {

    if (request.body && Object.keys(request.body).length > 0 && request.params["id"]) {
        try {

            let t = await Task.updateOne({ _id: request.params["id"] }, request.body, { runValidators: true });

            if (t) {
                res.status(201).send({ msg: "Task save success" });
            } else {
                res.status(404).send({ msg: "Task not found" });
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

/*
export const showTimeLine = async function (req: Request, res: Response) {

    try {
        let tasks:ITask[]|null;
        console.log(req.params['lastTask']);
            console.log(req.params['user']);
        if (!req.params['lastTask']) {

            tasks = await Task.find(t)
                .sort({ archivementDate: -1, _id: -1 })
                .limit(7);
        } else {
            tasks = await Task.find(new Task({ createdBy: new Schema.Types.ObjectId(req.params['user']), _id: { $lt: req.params['lastTask'] }, status:"PENDING"  }))
                .sort({ archivementDate: -1, _id: -1 })
                .limit(7);
        }

        if (tasks && tasks.length > 0) {
            res.status(201).send({ timeline: tasks });
        } else {
            res.status(404).send({ msg: "Empty timeline" });
        }
    } catch (err) {

        res.status(500).send({ msg: 'Something went wrong, retry again' });
        console.error(err);
    }
}
*/