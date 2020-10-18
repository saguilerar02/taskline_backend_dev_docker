import Task from "../models/tasks/TASK/Task";
import { Request, Response } from 'express'
import { responseErrorMaker } from "../Handlers/ErrorHandler";

export const saveTask = async function (request: Request, res: Response) {

    if (request.body && Object.keys(request.body).length > 0) {
        let session = null;

        try {
            session = await Task.db.startSession();
            await session.startTransaction();
            console.log("Transaction Started");

            let t = await Task.create(request.body);

            if (t) {
                await session.commitTransaction();
                console.log("Transaction Commited");
                res.status(201).send({ msg: "Task save success" });
            } else {
                await session.abortTransaction();
                console.log("Transaction Aborted");
                res.status(500).send({ msg: "ERROR" });
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send(responseErrorMaker(err));
            } else {
                res.status(500).send({ msg: err.message });
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

export const deleteOneTask = async function (request: Request, res: Response) {

    if (request.params["id"] && request.params["id"].length > 0) {
        let session = null;
        try {
            session = await Task.db.startSession();
            await session.startTransaction({});
            console.log("Transaction Started");
            let t = await Task.findById(request.params["id"]);
            if (t) {
                let deleted = await t.remove();
                if (deleted) {
                    await session.commitTransaction();
                    console.log("Transaction Commited");
                    res.status(201).send({ msg: "Task deleted successfully" });
                } else {
                    await session.abortTransaction();
                    res.status(404).send({ msg: "Impossible to delete this task, try again later" });
                }
            } else {
                await session.abortTransaction();
                res.status(500).send({ msg: "Task not found" });
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



