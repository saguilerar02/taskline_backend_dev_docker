import { Request, Response } from 'express';
import { responseErrorMaker } from '../Handlers/ErrorHandler';
import TaskList from '../models/lists/LIST/TaskList';

export const saveTaskList = async function (request: Request, res: Response) {

    if (request.body && Object.keys(request.body).length > 0) {
        let session = null;
        try {
            session = await TaskList.db.startSession();
            await session.startTransaction();

            let t = await TaskList.create(request.body);

            if (t) {
                await session.commitTransaction();
                res.status(201).send({ list:t,msg: "Tasklist save success" });
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
        try {

            let t = await TaskList.findById(request.params["id"]);
            if (t) {
                if ( await t.remove()) {
                    res.status(201).send({ msg: "La lista se ha borrado satisfactoriamente" });
                } else {
                    res.status(404).send({ msg: "No se ha podido borrar la lista, intentelo de nuevo más tarde" });
                }
            } else {
                res.status(500).send({ msg: "Task not found" });
            }
        } catch (err) {
            res.status(500).send({ msg: 'Something went wrong, retry again' });
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

/*

export const showUserLists = async function (req:Request, res:Response) {

    try {
        let lists;
        if(!req.params['lastTask']){
            lists = await TaskList.find({ createdBy: req.params["id"] })
            .sort({archivementDate:-1,_id:-1})
            .limit(7);
        }else{
            lists = await TaskList.find(
                { createdBy: req.params["id"],
                  _id:{$lt:req.params['lastTask']}})
            .sort({archivementDate:-1,_id:-1})
            .limit(7);
        }
        
        if (lists && lists.length>0) {
            res.status(201).send({ timeline:lists});
        } else {
            res.status(404).send({ msg: "Empty timeline" });
        }
    } catch (err) {

        res.status(500).send({ msg: 'Something went wrong, retry again' });
        console.error(err);
    }
}
*/