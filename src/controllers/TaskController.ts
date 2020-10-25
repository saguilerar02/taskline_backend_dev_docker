import Task from "../models/tasks/TASK/Task";
import { Request, Response } from 'express'
import { responseErrorMaker } from "../Handlers/ErrorHandler";
import Reminder from "../models/reminders/Reminder";
import { IReminder } from "../models/reminders/IReminder";
import { abortTransaction, commitTransaction, startTransaction } from "../util/TransactionUtils";
import { ITask } from "../models/tasks/TASK/ITask";
import moment from "moment";

export const saveTask = async function (request: Request, res: Response) {

    if (request.body && Object.keys(request.body).length > 0) {
        let session = null;
        try {
            session = await startTransaction(Task);
            console.log(moment())
            if (request.body.reminders.length > 5) return res.status(500).send({ error: "Máximo 5 reminders por Task" })

            let reminders: [IReminder] = request.body.reminders
            let t = new Task(request.body);
            t.reminders = [];
            console.log(t);
            let ts:ITask[] = await Task.create([t],{session});

            if (ts[0]) {
                t = ts[0];
                if (reminders.length > 0) {
                    reminders.forEach(rem => {
                        rem.idTask = t.id;
                    });
                    let saved_reminders = await Reminder.create(reminders,{session});
                    if (saved_reminders) {
                        saved_reminders.forEach(rem => {
                            if (rem.remindAt > t.archivementDateTime || rem.remindAt < t.createdAt) {
                                throw new Error("Los Reminders " + saved_reminders.indexOf(rem) + 1 + " debe tener una fecha menor a la fecha de finalización de la tarea y mayor a la fecha y hora actuales");
                            } else {
                                t.reminders.push(rem._id);
                            }
                        });
                    }
                }
                let savedTask = await t.save();
                if (savedTask) {
                    commitTransaction(session);
                    res.status(201).send({ task: savedTask, msg: "La Task se ha guardado con éxito" });
                } else {
                    abortTransaction(session);
                    res.status(500).send({ msg: "Ha ocurrido un error al intentar guardar la Task, inténtelo de nuevo más  tarde" });
                }
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send(responseErrorMaker(err));
            } else {
                res.status(500).send({ error: err.message });
            }
            abortTransaction(session);
        }
    } else {
        res.status(404).send("Bad Request: Request body is null");
    }
};

export const deleteOneTask = async function (request: Request, res: Response) {

    if (request.params["id"] && request.params["id"].length > 0) {
        let session = null;
        try {
            session = await startTransaction(Task);
            let t = await Task.findById(request.params["id"]);
            if (t) {
                let deleted = await t.remove();
                if (deleted) {
                    commitTransaction(session);
                    res.status(201).send({ msg: "Task deleted successfully" });
                } else {
                    abortTransaction(session);
                    res.status(404).send({ msg: "Impossible to delete this task, try again later" });
                }
            } else {
                abortTransaction(session);
                res.status(500).send({ msg: "Task not found" });
            }
        } catch (err) {
            abortTransaction(session);
            res.status(500).send({ msg: "Something went wrong" });
            console.log(err);
        }
    } else {
        res.status(404).send({ msg: "No id in the request" })
    }
};


export const updateTask = async function (request: Request, res: Response) {

    if (request.body && Object.keys(request.body).length > 0 && request.params["id"]) {
        let session = null;
        try {
            session = await Task.db.startSession();
            await session.startTransaction();

            let t = await Task.updateOne({ _id: request.params["id"] }, request.body, { runValidators: true });

            if (t) {
                await session.commitTransaction();
                res.status(201).send({ msg: "Task save success" });
            } else {
                if (session) await session.abortTransaction();
                res.status(404).send({ msg: "Task not found" });
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send(responseErrorMaker(err));
            } else {
                res.status(500).send({ msg: 'Something went wrong, retry again' });
                console.error(err);
            }
            if (session) await session.abortTransaction();
        }
    } else {
        res.status(404).send("Bad Request: Request body is null");
    }
}


export const showTimeLine = async function (req: Request, res: Response) {

    //parametros:   items que quiero , lastValue: ultima Id que he listado
    try {
        let tasks;
        if (!req.params['lastTask']) {

            tasks = await Task.find(new Task({ createdBy: req.params["id"] }))
                .sort({ archivementDate: -1, _id: -1 })
                .limit(7);
        } else {
            tasks = await Task.find(new Task({ createdBy: req.params["id"], _id: { $lt: req.params['lastTask'] } }))
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

//ENcontrar las tareas ordenadas por fecha e id( id por si hay varias fechas iguales)
//db.Tasks.find({"created_by":ObjectId("5f89bf49b9cae802c2b5eaeb")}).sort({archivement_date_time: -1, _id:-1}).limit(3)
//Encontrar las tareas siguientes a partir de la Id de la ultima tarea con la fecha duplicada
//db.Tasks.find({"created_by":ObjectId("5f89bf49b9cae802c2b5eaeb"),_id: {$lt:ObjectId("5f8df8953c6b4003edf1bfc3")}}).sort({archivement_date_time: -1, _id:-1}).limit(1)

