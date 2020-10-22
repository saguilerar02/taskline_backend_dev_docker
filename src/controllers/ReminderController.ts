import { Request, Response } from 'express'
import { responseErrorMaker } from "../Handlers/ErrorHandler";
import Reminder from '../models/reminders/Reminder';

export const saveReminder = async function (request: Request, res: Response) {

    if (request.body.reminders && Object.keys(request.body.reminders).length > 0) {
        let session = null;

        try {
            session = await Reminder.db.startSession();
            await session.startTransaction();
            console.log("Transaction Started");

            let t = await Reminder.create(request.body.reminders);

            if (t) {
                await session.commitTransaction();
                console.log("Transaction Commited");
                res.status(201).send({reminder: t, msg: "Reminder save success" });
            } else {
                await session.abortTransaction();
                console.log("Transaction Aborted");
                res.status(500).send({ msg: "ERROR" });
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send(responseErrorMaker(err));
            } else {
                res.status(500).send({ error: err.message });
                console.error(err.message);
            }
            if (session) {
                await session.abortTransaction();
                console.log("Transaction Aborted");
            }
        }

    } else {
        res.status(404).send("Bad Request: Request body is null");
    }

};

export const deleteOneReminder = async function (request: Request, res: Response) {

    if (request.params["id"] && request.params["id"].length > 0) {
        let session = null;
        try {
            session = await Reminder.db.startSession();
            await session.startTransaction({});
            console.log("Transaction Started");
            let t = await Reminder.findById(request.params["id"]);
            if (t) {
                let deleted = await t.remove();
                if (deleted) {
                    await session.commitTransaction();
                    console.log("Transaction Commited");
                    res.status(201).send({ msg: "Reminder deleted successfully" });
                } else {
                    await session.abortTransaction();
                    res.status(404).send({ msg: "Impossible to delete this reminder, try again later" });
                }
            } else {
                await session.abortTransaction();
                res.status(500).send({ msg: "Reminder not found" });
            }
        } catch (err) {
            if (session) {
                await session.abortTransaction();
                console.log("ERROR: Transaction aborted");
            }
            res.status(500).send({ msg: "Something went wrong" });
            console.log(err);
        }
    } else {
        res.status(404).send({ msg: "No id in the request" })
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


