import { Request, Response } from 'express';
import { responseErrorMaker } from '../Handlers/ErrorHandler';
import TaskList from '../models/lists/TaskList';

export const saveTaskList = async function (request: Request, res: Response) {

    if (request.body && Object.keys(request.body).length > 0) {
        let session = null;
        try {
            session = await TaskList.db.startSession();
            await session.startTransaction();

            let t = await TaskList.create(request.body);

            if (t) {
                await session.commitTransaction();
                res.status(201).send({ msg: "Tasklist save success" });
            } else {
                await session.abortTransaction();
                res.status(500).send({ msg: 'Something went wrong, retry again' });
            }

        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send(responseErrorMaker(err));
            } else {
                res.status(500).send({ msg: 'Something went wrong, retry again' });
            }
            if (session) {
                await session.abortTransaction();
                console.log("Transaction aborted");
            }
        }
    } else {
        res.status(404).send("Bad Request: Request body is null");
    }

};

export const deleteOneTaskList = async function (request: Request, res: Response) {

    if (request.params["id"] && request.params["id"].length > 0) {
        let session = null;
        try {
            session = await TaskList.db.startSession();
            session.startTransaction({});
            console.log("Transaction Started");

            let t = await TaskList.findByIdAndDelete(request.params["id"]);
            if (t) {
                session.commitTransaction();
                res.status(201).send({ msg: "TaskList deleted successfully" });
            } else {
                if (session) await session.abortTransaction();
                res.status(404).send({ msg: "TaskList not found" });
            }
        } catch (err) {
            res.status(500).send({ msg: 'Something went wrong, retry again' });
            if (session) {
                await session.abortTransaction();
                console.log("Transaction aborted");
            }
        }
    } else {
        res.status(404).send({ msg: "No id in the request" })
    }
};


export const updateTaskList = async function (request: Request, res: Response) {

    if (request.body && Object.keys(request.body).length > 0 && request.params["id"]) {
        let session = null;
        try {
            session = await TaskList.db.startSession();
            await session.startTransaction();

            let t = await TaskList.updateOne({ _id: request.params["id"] }, request.body, { runValidators: true });

            if (t) {
                await session.commitTransaction();
                res.status(201).send({ msg: "TaskList save success" });
            } else {
                if (session) await session.abortTransaction();
                res.status(404).send({ msg: "TaskList not found" });
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send(responseErrorMaker(err));
            } else {
                res.status(500).send({ msg: 'Something went wrong, retry again' });
                console.error(err);
            }
            if (session) {
                await session.abortTransaction();
                console.log("Transaction aborted");
            }
        }
    } else {
        res.status(404).send("Bad Request: Request body is null");
    }
}


