import { Request, Response } from 'express';
import { responseErrorMaker } from '../Handlers/ErrorHandler';
import { ITaskList } from '../models/lists/LIST/ITaskList';
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


export const updateTaskList = async function (req: Request, res: Response) {

    if (req.body && Object.keys(req.body).length > 0 && req.params["id"]) {
        try {

            let t = await TaskList.findById(req.params["id"]);
            if(t){
               let updated = await t.updateOne(req.body,{runValidators:true});
                if (updated) {
                    res.status(201).send({msg: "La lista se ha actualizado con éxito" });
                } else {
                    res.status(404).send({ error: "Ha ocurrido un error inesperado, intentelo de nuevo más tarde" });
                }
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send(responseErrorMaker(err));
            } else {
                res.status(500).send({ error: "Ha ocurrido un error inesperado, intentelo de nuevo más tarde" });
                console.error(err);
            }
        }
    } else {
        res.status(404).send("Bad Request: Request body is null");
    }
}

export const getUserLists = async function (req: Request, res: Response) {

    try {
        if (req.params && req.params['user']) {
            let lists:ITaskList[]|null;
            if(req.params['user']){
                lists = await TaskList.find({ "createdBy": req.params['user']});

                if (lists && lists.length > 0) {
                    res.status(201).send({ lists: lists });
                } else {
                    res.status(404).send({ msg: "Aún no has creado ninguna lista" });
                }
            }
        } else{
            res.status(500).send({ error: "Los parametros no son los correctos" });
        }
    } catch (err) {

        res.status(500).send({ msg: 'Algo salió mal, intentelo de nuevo más tarde' });
        console.error(err);
    }
}