import { Request, Response } from 'express'
import { responseErrorMaker } from "../Handlers/ErrorHandler";
import Reminder from '../models/reminders/Reminder';


export const saveReminder = async function (request: Request, res: Response) {

    if (request.body && Object.keys(request.body).length > 0) {
        try {
            let r = new Reminder(request.body);
            
            if (await r.save()) {
                res.status(201).send({ reminder: r, msg: "El reminder se ha guardado con éxito" });
            } else {
                res.status(500).send({ msg: "Ha ocurrido un error al intentar guardar el reminder, inténtelo de nuevo más  tarde" });
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send(responseErrorMaker(err));
            } else {
                res.status(500).send({ error: err.message });
            }
        }
    } else {
        res.status(404).send("El cuerpo de la petición esta vacío o es nulo");
    }
};

export const deleteOneReminder = async function (request: Request, res: Response) {

    if (request.params["id"] && request.params["id"].length > 0) {
        try {
            let t = await Reminder.findById(request.params["id"]);
            if (t) {
                let deleted = await t.remove();
                if (deleted) {
                    res.status(201).send({ msg: "El Reminder ha sido borrado con éxito" });
                } else {
                    res.status(404).send({ msg: "No se ha podido eliminar el Reminder, inténtelo de nuevo más tarde" });
                }
            } else {
                res.status(500).send({ msg: "No se ha encontrado el Reminder" });
            }
        } catch (err) {
            res.status(500).send({ msg: "Algo ha fallado, intentelo de nuevo más tarde" });
        }
    } else {
        res.status(404).send({ msg: "La ID no ha sido especificada" })
    }
};


export const updateReminder = async function (request: Request, res: Response) {

    if (request.body && Object.keys(request.body).length > 0 && request.params["id"]) {
        let session = null;
        try {
            session = await Reminder.db.startSession();
            await session.startTransaction();

            let t = await Reminder.updateOne({ _id: request.params["id"] }, request.body, { runValidators: true });

            if (t) {
                await session.commitTransaction();
                res.status(201).send({ msg: "Reminder save success" });
            } else {
                if (session) await session.abortTransaction();
                res.status(404).send({ msg: "Reminder not found" });
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


