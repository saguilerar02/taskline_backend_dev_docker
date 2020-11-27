import { Request, Response } from 'express';
import { responseErrorMaker } from "../handlers/ErrorHandler";
import Reminder from '../models/reminders/Reminder';


export const saveReminder = async function (request: Request, res: Response) {

    if (request.body && Object.keys(request.body).length > 0) {
        try {
            request.body.createdBy = request.user;
            let r = new Reminder(request.body);
            
            if (await r.save()) {
                res.status(201).send({type:"SUCCESS", reminder: r, msg: "El reminder se ha guardado con éxito" });
            } else {
                res.status(500).send({type:"ERROR", error: "Ha ocurrido un error al intentar guardar el reminder, inténtelo de nuevo más  tarde" });
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send({type:"VALIDATION_ERROR", error: responseErrorMaker(err)});
            } else {
                res.status(500).send({type:"ERROR", error:err.message });
            }
        }
    } else {
        res.status(400).send("Bad Request: La peticion está inválida");
    }
};

export const deleteOneReminder = async function (request: Request, res: Response) {

    if (request.params["id"] && request.params["id"].length > 0) {
        try {
            let t = await Reminder.findOne({_id:request.params["id"],createdBy:request.user});
            if (t) {
                let deleted = await t.remove();
                if (deleted) {
                    res.status(201).send({type:'SUCCESS',msg: "El Reminder ha sido borrado con éxito" });
                } else {
                    res.status(404).send({type:'ERROR', error: "No se ha podido eliminar el Reminder, inténtelo de nuevo más tarde" });
                }
            } else {
                res.status(500).send({type:'ERROR', error:  "No se ha encontrado el Reminder" });
            }
        } catch (err) {
            res.status(500).send({type:'ERROR', error:  "Algo ha fallado, intentelo de nuevo más tarde" });
        }
    } else {
        res.status(400).send("Bad Request: La peticion está inválida");
    }
};



